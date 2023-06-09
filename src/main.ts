import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  //swagger for api documentation
  const config = new DocumentBuilder()
    .setTitle('Task Management')
    .setDescription('Tast Management Site')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, document);
  await app.listen(5000);
}
bootstrap();
