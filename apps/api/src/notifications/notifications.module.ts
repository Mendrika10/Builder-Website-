import { Global, Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";

/** AUTH-004 — Module global : tous les modules métier peuvent envoyer des emails. */
@Global()
@Module({
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
