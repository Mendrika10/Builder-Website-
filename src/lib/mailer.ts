import * as nodemailer from "nodemailer";

export function createTransporter() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  const secure = process.env.SMTP_SECURE === "true";
  const port = Number(process.env.SMTP_PORT) || (secure ? 465 : 587);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter
    .verify()
    .then(() => {
      console.log("SMTP OK", { host, port, secure });
    })
    .catch((err) => {
      console.error("SMTP ERROR", err);
    });

  return transporter;
}
