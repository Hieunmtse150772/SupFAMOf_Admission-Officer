import TrainingRegistrationI from "models/trainingRegistrationI.model";


export default interface TrainingRegistrationDto {
    data: Array<TrainingRegistrationI>;
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
