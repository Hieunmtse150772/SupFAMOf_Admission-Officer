import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import SearchTrainingRegistrationParamsDto from "dtos/searchTrainingRegistration.dto";
import { getCertificate, getCertificateRegistration } from "features/certificateSlice";
import { useEffect, useState } from "react";

function useViewCertificate() {
    const dispatch = useAppDispatch();
    const certificateRegistrationList = useAppSelector(state => state.certificate.trainingRegistration);
    const loading = useAppSelector(state => state.certificate.loading);
    const certificateList = useAppSelector(state => state.certificate.certificateOption);
    const [openAddCertificateModal, setOpenAddCertificateModal] = useState(false);


    const fetchCertificateRegistration = async () => {
        try {
            const params: SearchTrainingRegistrationParamsDto = {
                isActive: true
            }
            await dispatch(getCertificateRegistration(params))

        } catch (error) {
            console.error(error)
        }
    }
    const fetchCertificate = async () => {
        try {
            await dispatch(getCertificate())

        } catch (error) {
            console.error(error)
        }
    }
    const onOpenAddCertificateModal = () => {
        setOpenAddCertificateModal(true);
    };
    useEffect(() => {
        const fetchData = async () => {
            await fetchCertificateRegistration();
            await fetchCertificate();
        }
        fetchData();
    }, [])
    const handler = {
        onOpenAddCertificateModal,
        fetchCertificate,
        setOpenAddCertificateModal
    }
    const props = {
        certificateRegistrationList,
        openAddCertificateModal,
        certificateList,
        loading
    }
    return { handler, props }
}

export default useViewCertificate;
