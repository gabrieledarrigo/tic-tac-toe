import { NestFactory } from "@nestjs/core";
import { AppModule } from "./App.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app
    .enableShutdownHooks()
    .useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    .listen(3000);
}

bootstrap();
