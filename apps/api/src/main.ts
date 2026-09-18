import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  // Le front (3200) appelle l'API depuis le navigateur — CORS obligatoire
  const origins = (process.env.CORS_ORIGIN ?? "http://localhost:3200").split(",");
  app.enableCors({ origin: origins });
  app.enableShutdownHooks();
  const port = Number(process.env.PORT) || 3201;
  await app.listen(port);
  logger.log(`listening on http://localhost:${port}`);
}
bootstrap();
