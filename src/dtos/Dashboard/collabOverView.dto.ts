export default interface CollabOverViewDto {
    data: {
        totalCollaborator: number,
        newCollaborators: [
            {
                imgUrl: string
            }
        ],
        totalPost: number,

    };
    status?: {
        success: boolean,
        message: string,
        errorCode: number
    }

}