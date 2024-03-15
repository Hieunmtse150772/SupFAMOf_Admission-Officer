export default interface RegistrationOverViewDto {
    data: {
        totalRegistration: number,
    };
    status?: {
        success: boolean,
        message: string,
        errorCode: number
    }

}