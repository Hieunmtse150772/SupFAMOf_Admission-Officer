import { Moment } from "moment"

export type ClassTrainingI = {
    id: string | number,
    date: Date,
    class: string,
    timeFrom: Date,
    timeTo: Date,
    status: string,
    createAt: Date,
    updateat: Date,
    trainingRegistrations: TrainingRegistrationsI[]
}
export type TrainingRegistrationsI = {
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
    },
    newItem: {
        date: Date,
        timeFrom: Date,
        timeTo: Date
    }

}
export type ClassTrainingViewI = {
    id: string | number,
    date?: Date | string,
    class?: string,
    timeFrom?: Date | string,
    timeTo?: Date | string,
    status?: number,
    timeFrom_timeTo?: Moment[],
    disable?: boolean
}
export type ClassTrainingViewI2 = {
    date: Date | string,
    class: string,
    timeFrom: Date | string,
    timeTo: Date | string,
    status: number,
    timeFrom_timeTo: Moment[]
}