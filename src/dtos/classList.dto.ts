import { ClassTrainingI } from "models/classTraining.model";


export default interface AllClassTrainingDto {
    data: Array<ClassTrainingI>;
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
