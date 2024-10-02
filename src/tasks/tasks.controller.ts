/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from "./task-status.enum";
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdaetTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { ConfigService } from '@nestjs/config';

@Controller('tasks')
 @UseGuards(AuthGuard())
export class TasksController {
    constructor(private taskServices: TasksService,
        private configService: ConfigService,
    ){
        //console.log(this.configService.get('TEST_VALUE'));
    }
    
    @Get()
    async getTasks(@Query() filterDto: GetTaskFilterDto, @GetUser() user: User) : Promise<Task[]> {
        return await this.taskServices.getAllTask(filterDto, user);
    }

    @Post()
    createTask(@Body() createTaskDto : CreateTaskDto, @GetUser() user: User): Promise<Task>{
        return this.taskServices.createTask(createTaskDto, user);
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task>{
        return this.taskServices.getTaskById(id, user);
    }

    @Delete('/:id')
    async deleteTask(@Param('id') id: string): Promise<void>{
        return await this.taskServices.delete(id);
    }

    @Patch('/:id/status')
    async updateTask(
        @Param('id') id: string,
        @Body() updateTaskDto: UpdaetTaskStatusDto,
        @GetUser() user: User
    ): Promise<Task>{
        const {status} = updateTaskDto;
        return this.taskServices.updateTask(id, status, user);
    }
}
