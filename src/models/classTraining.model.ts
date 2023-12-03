export type ClassTrainingI = {
    id: string | number,
    date: Date,
    class: string,
    timeFrom: Date,
    timeTo: Date,
    status: string,
    createAt: Date,
    updateat: Date,
    trainingRegistrations: [
        {
            id: number,
            status: number,
            account: {
                id: number,
                name: string,
                imgUrl: string,
                isPremium: boolean,
                email: string,
                phone: string,
                idStudent: string
            },
            trainingCertificate: {
                id: number,
                trainingTypeId: string,
                certificateName: string,
                isActive: boolean
            }
        }
    ]
}
export type ClassTrainingViewI = {
    id: string | number,
    date?: Date | string,
    class?: string,
    timeFrom?: Date | string,
    timeTo?: Date | string,
    status?: string,
}