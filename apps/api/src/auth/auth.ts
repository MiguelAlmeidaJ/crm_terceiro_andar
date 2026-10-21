import { Body, CanActivate, Controller, ExecutionContext, ForbiddenException, Get, Injectable, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IsEmail, IsString } from 'class-validator';
import { compare } from 'bcryptjs';
import { PrismaService } from '../prisma/service';
import type { Request, Response } from 'express';
class LoginDto { @IsEmail() email!:string; @IsString() password!:string; }
@Injectable() export class SessionGuard implements CanActivate {
 constructor(private jwt:JwtService,private db:PrismaService){}
 async canActivate(ctx:ExecutionContext){const req=ctx.switchToHttp().getRequest<Request & {user?:{id:string;role:string}}>();
 const token=req.cookies?.crm_session; if(!token) throw new UnauthorizedException();
 try{const payload=await this.jwt.verifyAsync<{sub:string}>(token); const user=await this.db.user.findUnique({where:{id:payload.sub},select:{id:true,role:true,active:true}});
 if(!user?.active) throw new UnauthorizedException();req.user=user;return true;}catch{throw new UnauthorizedException();}}
}
export const userSelect={id:true,name:true,email:true,role:true} as const;
@Controller('auth') export class AuthController {
 constructor(private db:PrismaService,private jwt:JwtService){}
 @Post('login') async login(@Body() dto:LoginDto,@Res({passthrough:true}) res:Response){
 const user=await this.db.user.findUnique({where:{email:dto.email.toLowerCase()}});
 if(!user?.active || !(await compare(dto.password,user.passwordHash))) throw new UnauthorizedException('E-mail ou senha inválidos');
 const token=await this.jwt.signAsync({sub:user.id,role:user.role});
 res.cookie('crm_session',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',maxAge:12*60*60*1000,path:'/'});
 return {id:user.id,name:user.name,email:user.email,role:user.role}; }
 @Get('me') @UseGuards(SessionGuard) async me(@Req() req:Request & {user:{id:string}}){return this.db.user.findUnique({where:{id:req.user.id},select:userSelect});}
 @Post('logout') logout(@Res({passthrough:true}) res:Response){res.clearCookie('crm_session',{path:'/'});return {ok:true};}
}
export function assertWrite(req:Request & {user?:{role:string}}){if(!req.user || req.user.role==='VIEWER') throw new ForbiddenException('Sem permissão de escrita');}
