import { BadRequestException, ConflictException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { AuthService, TooManyRequestsException } from "./auth.service";
import type { RegisterDto } from "./dto/register.dto";

const dto = (over: Partial<RegisterDto> = {}): RegisterDto =>
  ({ nom: "Test User", email: "u@test.mg", motDePasse: "Secret123", ...over });

/** Factory d'un enregistrement email_verification avec dates fraîches. */
const verification = (over: Record<string, unknown> = {}) => ({
  id: "v1",
  idUtilisateur: "u1",
  code: "654321",
  expiresAt: new Date(Date.now() + 10 * 60_000),
  isValidated: false,
  countAttempts: 0,
  codeBlocked: false,
  blockedUntil: null,
  createdAt: new Date(Date.now() - 120_000),
  ...over,
});

const prismaMock = {
  utilisateur: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  emailVerification: { create: jest.fn(), findFirst: jest.fn(), update: jest.fn() },
  $transaction: jest.fn(),
};
const notificationsMock = { sendVerificationCode: jest.fn() };

const makeService = () => new AuthService(prismaMock as never, notificationsMock as never);

beforeEach(() => {
  jest.clearAllMocks();
  prismaMock.$transaction.mockImplementation((ops: unknown[]) => Promise.all(ops));
});

describe("AuthService.register (AUTH-001)", () => {
  it("crée l'utilisateur, hashe le mot de passe et envoie un code à 6 chiffres", async () => {
    const service = makeService();
    prismaMock.utilisateur.findUnique.mockResolvedValue(null);
    prismaMock.utilisateur.create.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
      Promise.resolve({ id: "u1", ...data, emailVerifie: false, createdAt: new Date() }),
    );
    prismaMock.emailVerification.create.mockResolvedValue({});

    const { user } = await service.register(dto());

    expect(prismaMock.utilisateur.findUnique).toHaveBeenCalledWith({ where: { email: "u@test.mg" } });
    const createdData = prismaMock.utilisateur.create.mock.calls[0][0].data;
    expect(createdData.motDePasse).not.toBe("Secret123");
    expect(await bcrypt.compare("Secret123", createdData.motDePasse)).toBe(true);
    expect(user).toEqual({
      id: "u1",
      nom: "Test User",
      email: "u@test.mg",
      emailVerifie: false,
      createdAt: expect.any(Date),
    });
    const codeData = prismaMock.emailVerification.create.mock.calls[0][0].data;
    expect(codeData.code).toMatch(/^\d{6}$/);
    expect(codeData.expiresAt.getTime()).toBeGreaterThan(Date.now());
    expect(notificationsMock.sendVerificationCode).toHaveBeenCalledWith("u@test.mg", codeData.code);
  });

  it("normalise l'email (trim + minuscules)", async () => {
    const service = makeService();
    prismaMock.utilisateur.findUnique.mockResolvedValue(null);
    prismaMock.utilisateur.create.mockResolvedValue({
      id: "u1",
      nom: "T",
      email: "a@b.mg",
      emailVerifie: false,
      createdAt: new Date(),
    });

    await service.register(dto({ email: "  A@B.MG " }));

    expect(prismaMock.utilisateur.create.mock.calls[0][0].data.email).toBe("a@b.mg");
  });

  it("rejette un email déjà utilisé (409)", async () => {
    const service = makeService();
    prismaMock.utilisateur.findUnique.mockResolvedValue({ id: "existing" });

    await expect(service.register(dto())).rejects.toBeInstanceOf(ConflictException);
    expect(prismaMock.utilisateur.create).not.toHaveBeenCalled();
  });
});

describe("AuthService.verify (AUTH-002)", () => {
  const userNonVerifie = {
    id: "u1",
    nom: "T",
    email: "u@test.mg",
    emailVerifie: false,
    createdAt: new Date(),
  };

  it("valide un code correct (emailVerifie=true, transaction)", async () => {
    const service = makeService();
    prismaMock.utilisateur.findUnique.mockResolvedValue(userNonVerifie);
    prismaMock.emailVerification.findFirst.mockResolvedValue(verification());
    prismaMock.utilisateur.update.mockResolvedValue({ ...userNonVerifie, emailVerifie: true });

    const { user } = await service.verify("u@test.mg", "654321");

    expect(user.emailVerifie).toBe(true);
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
  });

  it("refuse un code expiré même s'il est correct", async () => {
    const service = makeService();
    prismaMock.utilisateur.findUnique.mockResolvedValue(userNonVerifie);
    prismaMock.emailVerification.findFirst.mockResolvedValue(
      verification({ expiresAt: new Date(Date.now() - 1000) }),
    );

    await expect(service.verify("u@test.mg", "654321")).rejects.toBeInstanceOf(BadRequestException);
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it("signale les tentatives restantes avant blocage", async () => {
    const service = makeService();
    prismaMock.utilisateur.findUnique.mockResolvedValue(userNonVerifie);
    prismaMock.emailVerification.findFirst.mockResolvedValue(verification({ countAttempts: 0 }));

    await expect(service.verify("u@test.mg", "111111")).rejects.toThrow("2 tentative(s)");
    expect(prismaMock.emailVerification.update).toHaveBeenCalledTimes(1);
  });

  it("bloque temporairement après 3 codes erronés", async () => {
    const service = makeService();
    prismaMock.utilisateur.findUnique.mockResolvedValue(userNonVerifie);
    prismaMock.emailVerification.findFirst.mockResolvedValue(verification({ countAttempts: 2 }));

    await expect(service.verify("u@test.mg", "111111")).rejects.toBeInstanceOf(
      TooManyRequestsException,
    );
    const data = prismaMock.emailVerification.update.mock.calls[0][0].data;
    expect(data.countAttempts).toBe(3);
    expect(data.codeBlocked).toBe(true);
    expect(data.blockedUntil).toBeInstanceOf(Date);
  });

  it("refuse immédiatement pendant un blocage actif (429)", async () => {
    const service = makeService();
    prismaMock.utilisateur.findUnique.mockResolvedValue(userNonVerifie);
    prismaMock.emailVerification.findFirst.mockResolvedValue(
      verification({ blockedUntil: new Date(Date.now() + 10 * 60_000) }),
    );

    await expect(service.verify("u@test.mg", "654321")).rejects.toBeInstanceOf(
      TooManyRequestsException,
    );
  });
});

describe("AuthService.resendCode (AUTH-003)", () => {
  const userNonVerifie = {
    id: "u1",
    nom: "T",
    email: "u@test.mg",
    emailVerifie: false,
    createdAt: new Date(),
  };

  it("renvoie un code pour un compte non vérifié", async () => {
    const service = makeService();
    prismaMock.utilisateur.findUnique.mockResolvedValue(userNonVerifie);
    prismaMock.emailVerification.findFirst.mockResolvedValue(null);
    prismaMock.emailVerification.create.mockResolvedValue({});

    const { message } = await service.resendCode("u@test.mg");

    expect(message).toContain("nouveau code");
    expect(notificationsMock.sendVerificationCode).toHaveBeenCalledWith(
      "u@test.mg",
      expect.stringMatching(/^\d{6}$/),
    );
  });

  it("applique un cooldown de 60 s (429)", async () => {
    const service = makeService();
    prismaMock.utilisateur.findUnique.mockResolvedValue(userNonVerifie);
    prismaMock.emailVerification.findFirst.mockResolvedValue(
      verification({ createdAt: new Date(Date.now() - 10_000) }),
    );

    await expect(service.resendCode("u@test.mg")).rejects.toBeInstanceOf(TooManyRequestsException);
    expect(prismaMock.emailVerification.create).not.toHaveBeenCalled();
  });

  it("vérifie le blocage avant le cooldown (429 « bloqué »)", async () => {
    const service = makeService();
    prismaMock.utilisateur.findUnique.mockResolvedValue(userNonVerifie);
    prismaMock.emailVerification.findFirst.mockResolvedValue(
      verification({ blockedUntil: new Date(Date.now() + 10 * 60_000) }),
    );

    await expect(service.resendCode("u@test.mg")).rejects.toThrow("bloqué");
  });

  it("répond de façon identique pour un email inconnu (anti-énumération)", async () => {
    const service = makeService();
    prismaMock.utilisateur.findUnique.mockResolvedValue(null);

    const { message } = await service.resendCode("inconnu@mg.mg");

    expect(message).toContain("nouveau code");
    expect(prismaMock.emailVerification.create).not.toHaveBeenCalled();
    expect(notificationsMock.sendVerificationCode).not.toHaveBeenCalled();
  });
});
