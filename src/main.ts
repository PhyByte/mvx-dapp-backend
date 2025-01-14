import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'express';
import morgan from 'morgan';
import { AppModule } from './app.module';

// Load environment variables from a .env file into process.env
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Define the server port
  const SERVER_PORT = process.env.SERVER_PORT || 4000;

  // Middleware that parses incoming requests with JSON payloads
  app.use(json({ limit: '50mb' }));

  // Middleware to parse incoming requests with urlencoded payloads
  app.use(urlencoded({ extended: true }));

  // Morgan middleware for logging HTTP requests to the console for development use
  app.use(morgan('dev'));

  /*
   ** Swagger API documentation
   */
  const config = new DocumentBuilder()
    .setTitle('MVX Dapp Template API')
    .setDescription('This is the API documentation for the backend template.')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the server
  await app.listen(SERVER_PORT, () => {
    console.log('\n\n----------------------------');
    console.log(`Server ready at: http://localhost:${SERVER_PORT}`); // Log the server's listening address
    console.log('MultiversX Network: ' + process.env.NETWORK); // Log the network the server is configured to use
    console.log('----------------------------\n\n');
  });
}

// If the application is not running in a test environment, start the server
if (process.env.NODE_ENV !== 'test') {
  bootstrap();
}
