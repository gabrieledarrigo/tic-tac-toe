import { Controller, Get } from "@nestjs/common";
import { TestRepository } from "../../infrastructure/repositories/TestRepository";

@Controller()
export class GameController {
  constructor(private readonly testRepository: TestRepository) {}

  @Get()
  public async get(): Promise<string> {
    return this.testRepository.test();
  }
}
