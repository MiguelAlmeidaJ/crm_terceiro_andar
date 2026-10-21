import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
@Injectable() export class PrismaService extends PrismaClient implements OnModuleInit,OnModuleDestroy {
 constructor(){
   if(!process.env.DATABASE_URL) throw new Error('DATABASE_URL obrigatória');
   super({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
 }
 async onModuleInit(){await this.$connect();}
 async onModuleDestroy(){await this.$disconnect();}
}
