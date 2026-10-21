import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { ClientStage, Prisma } from '@prisma/client';
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { PrismaService } from '../prisma/service';
import { SessionGuard,assertWrite } from '../auth/auth';
import type { Request } from 'express';
class ClientDto {
 @IsString() @MaxLength(160) name!:string;
 @IsOptional() @IsString() @MaxLength(160) company?:string;
 @IsOptional() @IsEmail() email?:string;
 @IsOptional() @IsString() @MaxLength(40) phone?:string;
 @IsOptional() @IsString() notes?:string;
 @IsOptional() @IsEnum(ClientStage) stage?:ClientStage;
 @IsOptional() @IsNumber() @Min(0) value?:number;
}
class UpdateClientDto extends ClientDto { @IsOptional() @IsString() declare name:string; }
@Controller('clients') @UseGuards(SessionGuard) export class ClientsController {
 constructor(private db:PrismaService){}
 @Get() list(@Query('search') search?:string,@Query('stage') stage?:ClientStage){return this.db.client.findMany({where:{...(search?{OR:[{name:{contains:search,mode:'insensitive' as const}},{company:{contains:search,mode:'insensitive' as const}}]}:{}),...(stage && Object.values(ClientStage).includes(stage)?{stage}:{})},orderBy:{updatedAt:'desc'},take:200});}
 @Post() create(@Body() dto:ClientDto,@Req() req:Request){assertWrite(req);return this.db.client.create({data:dto});}
 @Patch(':id') async update(@Param('id') id:string,@Body() dto:UpdateClientDto,@Req() req:Request){assertWrite(req); const existing=await this.db.client.findUnique({where:{id}});if(!existing)throw new NotFoundException();return this.db.client.update({where:{id},data:dto});}
 @Delete(':id') async remove(@Param('id') id:string,@Req() req:Request){assertWrite(req);await this.db.client.delete({where:{id}});return {ok:true};}
}
