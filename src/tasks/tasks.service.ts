/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from "./task-status.enum";
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { error } from 'console';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Task)
    //private  taskRepository : TaskRepository,
    private readonly taskRepository : Repository<Task>,
  ){}


  async getAllTask(filterDto : GetTaskFilterDto, user: User): Promise<Task[]>{

    const {status, search} = filterDto;
    const query = this.taskRepository.createQueryBuilder('task');
    query.where({ user });

    if(status){
      query.andWhere('task.status = :status', { status })
    }
    if(search){
      console.log(search)
        query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
          { search : `%${search}%`},
        );
    }

    const task = await query.getMany();
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>{
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
          title,
          description,
          status : TaskStatus.OPEN,
          user,
      });

      await this.taskRepository.save(task);
      return task;
  }

  async getTaskById(id: string, user: User): Promise<Task>{
    //const found = await this.taskRepository.findOneBy({ id: id, user: user }); 
    const found = await this.taskRepository.findOne({ where: {id, user}})

    if(!found){
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    return found;
  }

  async delete(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if(result.affected === 0){
      throw new NotFoundException(`Task with Id "${id}" not found`)
    }
  }

  async updateTask(id: string, status: TaskStatus, user: User): Promise<Task>{
    
    const task =  await this.getTaskById(id, user);

    task.status = status;
    await this.taskRepository.save(task);

    return task;
  }
}