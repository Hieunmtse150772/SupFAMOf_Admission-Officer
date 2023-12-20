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
    const [page, setPage] = useState<number>(1);
    const pageSizeOptions = [5, 10, 20]; // Các tùy chọn cho pageSize
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    const total = certificateRegistrationList.metadata?.total;
    const [searchKeywords, setSearchKey] = useState<string>('')
    const handleSearch = async (keywords: string) => {
        const params: SearchTrainingRegistrationParamsDto = {
            isActive: true,
            page: page,
            PageSize: pageSize,
            certificateName: keywords
        }
        await dispatch(getCertificateRegistration(params)).catch((error) => {
            console.log("Error in getting the data", error)
        });
    }
    const fetchCertificateRegistration = async () => {
        try {
            const params: SearchTrainingRegistrationParamsDto = {
                isActive: true,
                page: page,
                PageSize: pageSize
            }
            await dispatch(getCertificateRegistration(params)).catch((error) => {
                console.log("Error in getting the data", error)
            })

        } catch (error) {
            console.error(error)
        }
    }
    const fetchCertificate = async () => {
        try {
            await dispatch(getCertificate()).catch((error) => {
                console.log("Error in getting the data", error)
            })
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
    useEffect(() => {
        const fetchData = async () => {
            await fetchCertificateRegistration();
            await fetchCertificate();
        }
        fetchData();
    }, [page, pageSize])
    const handler = {
        onOpenAddCertificateModal,
        fetchCertificate,
        setOpenAddCertificateModal,
        fetchCertificateRegistration,
        setPage,
        setPageSize,
        handleSearch
    }
    const props = {
        certificateRegistrationList,
        openAddCertificateModal,
        certificateList,
        loading,
        pageSizeOptions,
        total
    }
    return { handler, props }
}

export default useViewCertificate;
