import { Body,Controller,Get,Post,Patch,Param,Req,UseGuards,NotFoundException } from '@nestjs/common';
import { IsEnum,IsISO8601,IsOptional,IsString,MaxLength } from 'class-validator';
import { TaskPriority,TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/service';
import {SessionGuard,assertWrite} from '../auth/auth';
import type {Request} from 'express';
class TaskDto {
 @IsString() @MaxLength(200) title!:string;
 @IsOptional() @IsString() description?:string;
 @IsOptional() @IsEnum(TaskStatus) status?:TaskStatus;
 @IsOptional() @IsEnum(TaskPriority) priority?:TaskPriority;
 @IsOptional() @IsISO8601() dueDate?:string;
 @IsOptional() @IsString() clientId?:string;
 @IsOptional() @IsString() assigneeId?:string;
}
class UpdateTaskDto extends TaskDto { @IsOptional() @IsString() declare title:string; }
@Controller('tasks') @UseGuards(SessionGuard) export class TasksController {
 constructor(private db:PrismaService){}
 @Get() list(){return this.db.task.findMany({include:{client:{select:{id:true,name:true}},assignee:{select:{id:true,name:true}}},orderBy:[{dueDate:'asc'},{createdAt:'desc'}],take:200});}
 @Post() create(@Body() dto:TaskDto,@Req() req:Request){assertWrite(req);const {dueDate,...rest}=dto;return this.db.task.create({data:{...rest,dueDate:dueDate?new Date(dueDate):undefined}});}
 @Patch(':id') async update(@Param('id') id:string,@Body() dto:UpdateTaskDto,@Req() req:Request){assertWrite(req);if(!await this.db.task.findUnique({where:{id}}))throw new NotFoundException();const {dueDate,...rest}=dto;return this.db.task.update({where:{id},data:{...rest,dueDate:dueDate?new Date(dueDate):undefined}});}
}
