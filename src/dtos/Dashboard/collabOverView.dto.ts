export default interface CollabOverViewDto {
    data: {
        totalCollaborator: number,
        newCollaborators: [
            {
                imgUrl: string
            }
        ]
    };
    status?: {
        success: boolean,
        message: string,
        errorCode: number
    }

}