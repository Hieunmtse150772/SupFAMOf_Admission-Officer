export default interface CollabOverViewDto {
    data: {
        totalCollaborator: number,
        newCollaborators: [
            {
                imgUrl: string
            }
        ]
    }

}