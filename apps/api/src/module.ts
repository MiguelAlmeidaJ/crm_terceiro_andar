import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma/service';
import { AuthController,SessionGuard } from './auth/auth';
import { ClientsController } from './clients/clients';
import { TasksController } from './tasks/tasks';
import { DashboardController } from './dashboard/dashboard';
@Module({imports:[JwtModule.register({secret:process.env.JWT_SECRET || (()=>{throw new Error('JWT_SECRET obrigatório')})(),signOptions:{expiresIn:'12h'}})],controllers:[AuthController,ClientsController,TasksController,DashboardController],providers:[PrismaService,SessionGuard]})
export class AppModule{}
