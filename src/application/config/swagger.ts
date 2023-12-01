import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { API_VERSION } from "../main";

export function setupAPIDoc(app: INestApplication<unknown>) {
  const config = new DocumentBuilder()
    .setTitle("Tic Tac Toe")
    .setDescription("Tic Tac Toe API")
    .setLicense(
      "MIT",
      "https://github.com/gabrieledarrigo/tic-tac-toe/blob/main/LICENSE",
    )
    .setVersion(API_VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });

  SwaggerModule.setup("api/docs", app, document);
}
