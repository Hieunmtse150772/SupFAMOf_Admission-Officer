import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { getCertificate } from "features/certificateSlice";
import { useEffect, useState } from "react";

function useViewCertificate() {
    const dispatch = useAppDispatch()
    const certificateList = useAppSelector(state => state.certificate.certificateOption)
    const [openAddCertificateModal, setOpenAddCertificateModal] = useState(false);


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
        fetchCertificate()
    }, [])
    const handler = {
        onOpenAddCertificateModal,
        fetchCertificate,
        setOpenAddCertificateModal
    }
    const props = {
        certificateList,
        openAddCertificateModal
    }
    return { handler, props }
}

export default useViewCertificate;
