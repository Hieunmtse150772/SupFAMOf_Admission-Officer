import AdmissionInfo from "models/admission.model";

export interface AdmissionDto {
    data: AdmissionInfo[];
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