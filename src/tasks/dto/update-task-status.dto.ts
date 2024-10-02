/* eslint-disable prettier/prettier */
import { IsEnum } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class UpdaetTaskStatusDto{
    @IsEnum(TaskStatus)
    status: TaskStatus;
}