import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { getCertificate, getCertificateRegistration } from "features/certificateSlice";
import { useEffect, useState } from "react";

function useViewCertificate() {
    const dispatch = useAppDispatch()
    const certificateRegistrationList = useAppSelector(state => state.certificate.trainingRegistration)
    const certificateList = useAppSelector(state => state.certificate.certificateOption)

    const [openAddCertificateModal, setOpenAddCertificateModal] = useState(false);


    const fetchCertificateRegistration = async () => {
        try {
            await dispatch(getCertificateRegistration(''))

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
            await fetchCertificate();
            await fetchCertificateRegistration()
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
        certificateList
    }
    return { handler, props }
}

export default useViewCertificate;
