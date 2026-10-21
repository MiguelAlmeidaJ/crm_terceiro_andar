import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './module';
async function bootstrap(){
 const app=await NestFactory.create(AppModule);
 app.use(cookieParser());
 app.enableCors({origin:(process.env.WEB_ORIGIN||'http://localhost:3445').split(','),credentials:true});
 app.setGlobalPrefix('api');
 app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,transform:true}));
 await app.listen(Number(process.env.PORT||3446),'0.0.0.0');
}
bootstrap();
