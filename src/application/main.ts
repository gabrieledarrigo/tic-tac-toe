import { NestFactory } from "@nestjs/core";
import { AppModule } from "./App.module";
import { setupAPIDoc } from "./config/swagger";
import { ValidationPipe } from "@nestjs/common";

export const API_VERSION = "v1";

async function bootstrap() {
  const app = (await NestFactory.create(AppModule))
    .enableShutdownHooks()
    .useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    .setGlobalPrefix(`api/${API_VERSION}`);
  setupAPIDoc(app);

  await app.listen(3000);
}

bootstrap();
