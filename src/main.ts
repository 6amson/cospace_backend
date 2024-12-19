import { ModuleRef, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as functions from 'firebase-functions';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.log('Full error:', error);
    console.log('Stack trace:', error.stack); console.log('Full error:', error);
    console.log('Stack trace:', error.stack);
  }
}
bootstrap();

// async function bootstrap() {
//   try {
//     const app = await NestFactory.create(AppModule, {
//       logger: ['error', 'warn', 'debug', 'verbose'], // Increase logging level
//     });
    
//     // Get the dependency graph
//     // const dependencyGraph = app.get(ModuleRef);
//     // console.log('Modules:', dependencyGraph);
//     app.useGlobalPipes(
//       new ValidationPipe({
//         forbidNonWhitelisted: true,
//         transform: true,
//       }),
//     );
//     await app.listen(3000);
//     console.log(`Application is running on: ${await app.getUrl()}`);
//   } catch (error) {
//     console.error('Initialization error:', {
//       message: error.message,
//       stack: error.stack,
//       module: error.module?.name,
//       dependencies: error.dependencies,
//     });
//     throw error;
//   }
// }

// bootstrap();
