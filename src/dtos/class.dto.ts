import { ClassTrainingViewI } from "models/classTraining.model";


export default interface ClassTrainingDto {
    data: Array<ClassTrainingViewI>;
    status?: {
        success: boolean,
        message: string,
        errorCode: number
    },
    metadata?: {
        page: number,
        size: number,
        total: number
    },
}
