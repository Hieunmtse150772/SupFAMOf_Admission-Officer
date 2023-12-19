export default interface AnalyticsDto {
    data: {
        collaboratorNeeded: number,
        collaboratorCompleteJob: number
    };
    status?: {
        success: boolean,
        message: string,
        errorCode: number
    }

}