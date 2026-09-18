import { Controller, Get } from "@nestjs/common";
import { Public } from "../../auth/public.decorator";
import { PlansService } from "./plans.service";

@Controller("plans")
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  /** PLAN-001 — Catalogue public des plans. */
  @Public()
  @Get()
  list() {
    return this.plansService.listActive();
  }
}
