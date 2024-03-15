import Registrations from "models/registration.model";

export default interface RegistrationsDto {
    data: Array<Registrations>;
    metadata?: {
        page: number,
        size: number,
        total: number
    },
    status?: {
        success: boolean,
        message: string,
        errorCode: number
    }
}
