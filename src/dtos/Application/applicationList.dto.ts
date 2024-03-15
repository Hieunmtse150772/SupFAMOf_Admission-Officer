import { ApplicationI } from "models/application.model";

export interface ApplicationListDto {
    data: Array<ApplicationI>,
    metadata?: {
        page: number,
        size: number,
        total: number
    }
}