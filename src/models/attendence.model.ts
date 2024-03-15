
type AttendenceI = {
    id: number,
    checkInTime: Date,
    checkOutTime: Date,
    status: number,
    account: {
        name: string,
        email: string,
        imgUrl: string
    },
    postRegistration: {
        id: number,
        registrationCode: string,
        status: number,
        schoolBusOption: true,
        createAt: Date,
        updateAt: Date,
        positionId: number,
        note: string,
        salary: number,
        post: {
            id: number,
            accountId: number,
            postCategoryId: number,
            postCode: string,
            postImg: string,
            postDescription: string,
            priority: number,
            dateFrom: string,
            dateTo: string,
            isPremium: boolean,
            status: number,
            attendanceComplete: boolean,
            createAt: Date,
            updateAt: Date,
            account: {
                id: number,
                roleId: number,
                accountInformationId: number,
                name: string,
                email: string,
                phone: string,
                dateOfBirth: Date,
                imgUrl: string,
                postPermission: Boolean,
                isPremium: Boolean,
                isActive: Boolean,
                isBanned: Boolean,
                createAt: Date,
                updateAt: Date,
                accountInformation: {
                    id: number,
                    accountId: number,
                    identityNumber: string,
                    idStudent: string,
                    fbUrl: string,
                    address: string,
                    identityIssueDate: Date,
                    placeOfIssue: string,
                    identityFrontImg: string,
                    identityBackImg: string,
                    taxNumber: string
                }
            },
            postCategory: {
                id: number,
                postCategoryDescription: string,
                postCategoryType: string,
                isActive: boolean,
                createAt: Date,
                updateAt: Date
            }
        },
        position: {
            id: number,
            postId: number,
            trainingCertificateId: number,
            certificateName: string,
            documentId: number,
            positionName: string,
            positionDescription: string,
            schoolName: string,
            location: string,
            date: Date,
            latitude: string,
            longitude: string,
            timeFrom: {
                ticks: number,
                days: number,
                hours: number,
                milliseconds: number,
                minutes: number,
                seconds: number,
                totalDays: number,
                totalHours: number,
                totalMilliseconds: number,
                totalMinutes: number,
                totalSeconds: number
            },
            timeTo: {
                ticks: number,
                days: number,
                hours: number,
                milliseconds: number,
                minutes: number,
                seconds: number,
                totalDays: number,
                totalHours: number,
                totalMilliseconds: number,
                totalMinutes: number,
                totalSeconds: number
            },
            status: number,
            isBusService: true,
            amount: number,
            salary: number,
            positionRegisterAmount: number
        }
    }
}

export default AttendenceI;