import { Injectable } from "@nestjs/common";
import { Prisma } from "../Prisma";

@Injectable()
export class TestRepository {
  constructor(private readonly prisma: Prisma) {}

  public async test(): Promise<string> {
    return this.prisma.$queryRaw<string>`SELECT '1';`;
  }
}
