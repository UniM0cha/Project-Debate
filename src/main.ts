import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import { join } from 'path';
import { AppModule } from './app.module';
const hbs = require('hbs');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  hbs.registerHelper('dateFormat', require('handlebars-dateformat'));
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));

  const FileStore = require('session-file-store')(session);
  app.use(
    session({
      secret: 'mochamocha',
      resave: false,
      saveUninitialized: false,
      store: new FileStore(),
    }),
  );

  await app.listen(3000);
}
bootstrap();
