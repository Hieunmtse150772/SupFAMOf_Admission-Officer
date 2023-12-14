export default interface MoneyYearReportDto {
    data: Array<number>;
    status?: {
        success: boolean,
        message: string,
        errorCode: number
    }
}