import { BadRequestException, ConflictException, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { createHash } from "crypto";
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
  refreshToken: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
  $transaction: jest.fn(
    async (arg: unknown[] | ((tx: unknown) => unknown)): Promise<unknown> => {
      // Les deux formes : tableau de promesses ou fonction interactive
      if (typeof arg === "function") return arg(prismaMock);
      return Promise.all(arg);
    },
  ),
};
const notificationsMock = { sendVerificationCode: jest.fn() };
const jwtMock = { signAsync: jest.fn(async () => "access-token-test") };

const makeService = () =>
  new AuthService(prismaMock as never, notificationsMock as never, jwtMock as never);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("AuthService.register (AUTH-001)", () => {
  it(
    "crée l'utilisateur, hashe le mot de passe et envoie un code à 6 chiffres",
    async () => {
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
    },
    15_000,
  );

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

describe("AuthService.login / refresh / logout (AUTH-010/011)", () => {
  const userVerifie = {
    id: "u1",
    nom: "T",
    email: "u@test.mg",
    emailVerifie: true,
    motDePasse: "$2a$12$hashfictif",
    createdAt: new Date(),
  };

  it("AUTH-010 : login OK émet access + refresh (persisté hashé)", async () => {
    const service = makeService();
    prismaMock.utilisateur.findUnique.mockResolvedValue(userVerifie);
    prismaMock.refreshToken.create.mockResolvedValue({});
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);

    const result = await service.login({ email: "u@test.mg", motDePasse: "Secret123" });

    expect(result.user.email).toBe("u@test.mg");
    expect(result.accessToken).toBe("access-token-test");
    expect(result.refreshToken).toMatch(/^[0-9a-f-]{36}$/);
    expect(result.expiresIn).toBe(900);
    const data = prismaMock.refreshToken.create.mock.calls[0][0].data;
    expect(data.tokenHash).toHaveLength(64); // sha256 hex
    expect(data.idUtilisateur).toBe("u1");
  });

  it("AUTH-010 : mot de passe erroné → 401 (anti-énumération)", async () => {
    const service = makeService();
    prismaMock.utilisateur.findUnique.mockResolvedValue(userVerifie);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

    await expect(
      service.login({ email: "u@test.mg", motDePasse: "Wrong123" }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("AUTH-010 : email inconnu → même 401 (anti-énumération)", async () => {
    const service = makeService();
    prismaMock.utilisateur.findUnique.mockResolvedValue(null);

    await expect(
      service.login({ email: "x@mg.mg", motDePasse: "Whatever1" }),
    ).rejects.toThrow("Email ou mot de passe incorrect");
  });

  it("AUTH-010 : compte non vérifié → 403", async () => {
    const service = makeService();
    prismaMock.utilisateur.findUnique.mockResolvedValue({ ...userVerifie, emailVerifie: false });
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);

    await expect(
      service.login({ email: "u@test.mg", motDePasse: "Secret123" }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("AUTH-011 : refresh valide émet de nouveaux tokens et révoque l'ancien", async () => {
    const service = makeService();
    const oldHash = createHash("sha256").update("old-refresh").digest("hex");
    prismaMock.refreshToken.findUnique.mockResolvedValue({
      id: "rt1",
      tokenHash: oldHash,
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: null,
      utilisateur: userVerifie,
    });
    prismaMock.refreshToken.update.mockResolvedValue({});

    const result = await service.refresh("old-refresh");

    expect(result.user.email).toBe("u@test.mg");
    expect(prismaMock.refreshToken.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "rt1" }, data: expect.anything() }),
    );
  });

  it("AUTH-011 : refresh révoqué/expiré/inconnu → 401", async () => {
    const service = makeService();
    prismaMock.refreshToken.findUnique.mockResolvedValue(null);

    await expect(service.refresh("garbage")).rejects.toBeInstanceOf(UnauthorizedException);
    expect(prismaMock.refreshToken.update).not.toHaveBeenCalled();
  });

  it("AUTH-011 : logout révoque le token (updateMany)", async () => {
    const service = makeService();
    prismaMock.refreshToken.updateMany.mockResolvedValue({ count: 1 });

    await service.logout("old-refresh");

    expect(prismaMock.refreshToken.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: { revokedAt: expect.any(Date) } }),
    );
  });
});
