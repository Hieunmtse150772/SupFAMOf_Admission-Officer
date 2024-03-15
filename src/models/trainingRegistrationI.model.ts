type TrainingRegistrationI = {
    id: number,
    trainingTypeId: string,
    certificateName: string,
    isActive: boolean,
    createAt: Date,
    registrations: [
        {
            id: number,
            name: string,
            imgUrl: string,
            isPremium: boolean,
            email: string,
            phone: string,
            idStudent: string,
            status: number
        }
    ],
    actions: any[],
    avatar: any,
    registerAmount: number
}
export default TrainingRegistrationI;