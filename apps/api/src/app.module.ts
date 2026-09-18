import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { HealthController } from "./modules/health/health.controller";
import { NotificationsModule } from "./notifications/notifications.module";
import { PlansModule } from "./modules/plans/plans.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [PrismaModule, NotificationsModule, AuthModule, PlansModule],
  controllers: [HealthController],
})
export class AppModule {}
