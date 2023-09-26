import { unwrapResult } from '@reduxjs/toolkit';
import { message } from 'antd';
import { useAppSelector } from 'app/hooks';
import { useAppDispatch } from 'app/store';
import { getProvince } from 'features/addressSlice';
import { createPost } from 'features/postSlice';
import { getPostTitle } from 'features/postTitleSlice';
import useTitle from 'hooks/useTitle';
import PostCreated, { PositionCreatedI, TrainingPositionsCreatedI } from 'models/postCreated.model';
import PostOptionI from 'models/postOption.model';
import { Moment } from 'moment';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";

interface AdditionalPosition {
    positionName: string;
    amount: number | null;
    salary: number | null;
}
interface AdditionalTrainingPosition {
    namePosition: string,
    number: number | null;
    salary: number | null;
}

const useAddNewPostHook = () => {
    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue, getValues, reset
    } = useForm();
    const Formater = 'DD/MM/YYYY';
    const dispatch = useAppDispatch();
    useTitle("Add New Post");

    const postTitleOptionsAPI = useAppSelector(state => state.postTitle.postTitleOption)
    const province = useAppSelector(state => state.address.province)
    const district = useAppSelector(state => state.address.district)
    const ward = useAppSelector(state => state.address.ward)

    const [error, setError] = useState<String>('');
    const [errorTraining, setErrorTraining] = useState<String>('');
    const [modalVisit, setModalVisit] = useState(false);
    const [piority, setPiority] = useState<number | null>(0);
    const [isPremium, setIsPremium] = useState<boolean>(false);
    const [createParams, setCreateParams] = useState<PostCreated>()
    const [messageApi, contextHolder] = message.useMessage();
    const [additionalPositions, setAdditionalPositions] = useState<AdditionalPosition[]>([{
        positionName: '',
        amount: 0,
        salary: 0,
    }]);
    const [additionalTrainingPositions, setAdditionalTrainingPositions] = useState<AdditionalTrainingPosition[]>([{
        namePosition: '',
        number: null,
        salary: null,
    }]);
    const [open, setOpen] = useState(false);
    const [optionsAPI, setOptionsAPI] = useState<readonly PostOptionI[]>([]);
    const options = postTitleOptionsAPI?.map((title) => ({
        value: title.id,
        label: title.postCategoryDescription
    }));
    const provinceOptions = province?.map((province) => ({
        value: province.province_id,
        label: province.province_name
    }));
    const districtOptions = district?.map((district) => ({
        value: district.district_id,
        label: district.district_name
    }));

    const wardOptions = ward?.map((ward) => ({
        value: ward.ward_id,
        label: ward.ward_name
    }));


    const loading = open && optionsAPI.length === 0;
    const FormatTime = 'HH:mm:ss'
    const isLoading = useAppSelector(state => state.postTitle.loading)
    const [openAddTitleModal, setOpenAddTitleModal] = useState(false)
    const onCloseAddTitleModal = () => {
        setOpenAddTitleModal(false);
    };

    const onOpenAddTitleModal = () => {
        setOpenAddTitleModal(true);
    };
    const onPremiumChange = () => {
        setIsPremium(!isPremium);
    }
    const onChangeSliderPiority = (newValue: number | null) => {
        setPiority(newValue);
    };
    const onSubmit = async (data: any) => {
        const timeRange: Moment[] = getValues('TimeFrom-TimeTo')
        const dateRange: Date[] = getValues('DateFrom-DateTo')

        const formattedTimeRange = timeRange.map((time) => time.format(FormatTime));
        const formattedDateRange = dateRange.map((time) => time);

        const position: PositionCreatedI[] = (additionalPositions || []).map((_, index) => {
            const positionValue = getValues(`postPosition${index}`);
            const numberStudentValue = getValues(`numberStudent${index}`);
            const salaryValue = getValues(`Salary${index}`);
            return {
                positionName: positionValue,
                amount: numberStudentValue,
                salary: salaryValue,
            };
        });
        const trainingPosition: TrainingPositionsCreatedI[] = (additionalTrainingPositions || []).map((_, index) => {
            const positionValue = getValues(`postPositionTraining${index}`);
            const numberStudentValue = getValues(`numberStudentTraining${index}`);
            const salaryValue = getValues(`SalaryTraining${index}`);
            return {
                positionName: positionValue,
                amount: numberStudentValue,
                salary: salaryValue,
            };
        });
        const params: PostCreated = {
            postTitleId: getValues('postTitle'), //completetext box     
            postDescription: getValues('postDescription'),
            dateFrom: formattedDateRange[0],
            dateTo: formattedDateRange[1],
            timeFrom: formattedTimeRange[0], //00:00:00 
            timeTo: formattedTimeRange[1],
            priority: piority, //độ ưu tiên 1-5, defaultvalue: 0
            isPremium: isPremium, // false
            location: getValues('location'),
            postPositions: position,
            trainingPositions: trainingPosition ? trainingPosition : []
        }
        await dispatch(createPost(params)).then((response) => {
            const result2 = unwrapResult(response);
            if (result2.status === 200) {
                message.success('Create post success!');
                reset()
            }
        }).catch((error) => {
            console.error(error)
        })
        // You can perform your submission logic here
    };

    const handleAddPosition = () => {
        const newPosition = {
            positionName: '',
            amount: null,
            salary: null,
        };
        setError('');
        setAdditionalPositions([...additionalPositions, newPosition]);
    };
    const handleAddTrainingPosition = () => {
        const newPosition = {
            namePosition: '',
            number: null,
            salary: null,
        };
        setErrorTraining('');
        setAdditionalTrainingPositions([...additionalTrainingPositions, newPosition]);
    };

    const handleDeleteTrainingPosition = (indexToDelete: number) => {
        const updatedPositions = additionalTrainingPositions.filter((_, index) => index !== indexToDelete);
        setAdditionalTrainingPositions(updatedPositions);
    };
    const handleDeletePosition = (indexToDelete: number) => {
        if (additionalPositions.length === 1) {
            messageApi.open({
                type: 'warning',
                content: 'Need at least 1 position to create a post!',
            });
        } else {
            setError('')
            const updatedPositions = additionalPositions.filter((_, index) => index !== indexToDelete);
            setAdditionalPositions(updatedPositions);
        }

    };
    const fetchPostTitleOption = async () => {
        const result = await dispatch(getPostTitle());
    }
    const fetchProvinceOption = async () => {
        const result = await dispatch(getProvince());
        console.log('first: ', province)
    }
    const handleChangePosition = (value: PostOptionI | null) => {
        setValue('postTitle', value?.id)
    }
    useEffect(() => {
        fetchProvinceOption()
        fetchPostTitleOption()
    }, [])

    function sleep(delay = 0) {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    }
    useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            await sleep(1e1); // For demo purposes.

            if (active) {
                setOptionsAPI([...postTitleOptionsAPI]);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    useEffect(() => {
        if (!open) {
            setOptionsAPI([]);
        }
    }, [open]);
    const handler = {
        handleAddPosition,
        handleAddTrainingPosition,
        handleChangePosition,
        handleDeletePosition,
        handleSubmit,
        onPremiumChange,
        onChangeSliderPiority,
        onSubmit,
        setOpen,
        reset,
        setOpenAddTitleModal,
        onCloseAddTitleModal,
        onOpenAddTitleModal,
        fetchPostTitleOption,
        handleDeleteTrainingPosition
    }
    const props = {
        open,
        options,
        loading,
        control,
        errors,
        piority,
        additionalPositions,
        error,
        additionalTrainingPositions,
        contextHolder,
        openAddTitleModal,
        provinceOptions,
        districtOptions,
        wardOptions
    }
    return { handler, props }

}
export default useAddNewPostHook;
