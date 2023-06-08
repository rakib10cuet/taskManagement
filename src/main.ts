import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //setting the global prefix for routing and versiong routes
  app.setGlobalPrefix('api', {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });
  //global validation pipe
  app
    .useGlobalPipes
    // new ValidationPipe({
    //   whitelist: false,
    //   transform: false,
    //   forbidNonWhitelisted: true,
    //   transformOptions: {
    //     enableImplicitConversion: true,
    //   },
    // }),
    ();
  //enbale cors policy for production and dev
  app.enableCors();
  await app.listen(5001);
}
bootstrap();
