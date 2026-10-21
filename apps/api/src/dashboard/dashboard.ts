import { Controller,Get,UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/service';
import { SessionGuard } from '../auth/auth';
@Controller('dashboard') @UseGuards(SessionGuard) export class DashboardController {
 constructor(private db:PrismaService){}
 @Get() async get(){const [clients,leads,tasks,pending,won,users]=await Promise.all([
 this.db.client.count(),this.db.client.count({where:{stage:'LEAD'}}),this.db.task.count(),this.db.task.count({where:{status:{not:'DONE'}}}),this.db.client.count({where:{stage:'WON'}}),this.db.user.count({where:{active:true}})]);return {clients,leads,tasks,pending,won,users};}
}
