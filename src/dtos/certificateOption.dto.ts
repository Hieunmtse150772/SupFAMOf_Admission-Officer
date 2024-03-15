import CertificateOptionI from "models/certificateOption.model";


export default interface CertificateOptionDto {
    data: CertificateOptionI[];
    status?: {
        success: boolean,
        message: string,
        errorCode: number
    }
}
