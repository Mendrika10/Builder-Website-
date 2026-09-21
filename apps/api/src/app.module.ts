import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { HealthController } from "./modules/health/health.controller";
import { NotificationsModule } from "./notifications/notifications.module";
import { PlansModule } from "./modules/plans/plans.module";
import { SitesModule } from "./modules/sites/sites.module";
import { PagesModule } from "./modules/pages/pages.module";
import { UploadsModule } from "./modules/uploads/uploads.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { SubscriptionModule } from "./modules/subscription/subscription.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [PrismaModule, NotificationsModule, AuthModule, PlansModule, SitesModule, PagesModule, UploadsModule, SubscriptionModule, AnalyticsModule],
  controllers: [HealthController],
})
export class AppModule {}
