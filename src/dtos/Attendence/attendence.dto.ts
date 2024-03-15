import AttendenceI from "models/attendence.model";

export default interface AttendenceDto {
    data: Array<AttendenceI>;
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
