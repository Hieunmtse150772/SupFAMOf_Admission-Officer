import { unwrapResult } from '@reduxjs/toolkit';
import { message } from 'antd';
import { useAppSelector } from 'app/hooks';
import { useAppDispatch } from 'app/store';
import { createPost } from 'features/postSlice';
import { getPostTitle } from 'features/postTitleSlice';
import useTitle from 'hooks/useTitle';
import PostCreated, { PositionI, TrainingPositionsI } from 'models/post.model';
import PostOptionI from 'models/postOption.model';
import moment, { Moment } from 'moment';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";

interface AdditionalPosition {
    namePosition: string;
    number: number | null;
    salary: number | null;
}
interface AdditionalTrainingPosition {
    namePosition: string,
    number: number | null;
    salary: number | null;
}
const steps = [
    {
        title: 'First',
        content: 'First-content',
    },
    {
        title: 'Last',
        content: 'Last-content',
    }
]
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
    const [error, setError] = useState<String>('');
    const [errorTraining, setErrorTraining] = useState<String>('');
    const [modalVisit, setModalVisit] = useState(false);

    const [piority, setPiority] = useState<number | null>(0);
    const [isPremium, setIsPremium] = useState<boolean>(false);
    const [createParams, setCreateParams] = useState<PostCreated>()
    const [messageApi, contextHolder] = message.useMessage();
    const [additionalPositions, setAdditionalPositions] = useState<AdditionalPosition[]>([{
        namePosition: '',
        number: null,
        salary: null,
    }]);
    const [additionalTrainingPositions, setAdditionalTrainingPositions] = useState<AdditionalTrainingPosition[]>([{
        namePosition: '',
        number: null,
        salary: null,
    }]);
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<readonly PostOptionI[]>([]);
    const loading = open && options.length === 0;
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
        console.log("data: ", data);
        console.log("positionValue1", getValues('postPosition1'))
        const timeRange: Moment[] = getValues('TimeFrom-TimeTo')
        const formattedTimeRange = timeRange.map((time) => time.format('HH:mm:ss'));
        console.log('formattedTimeRange :', formattedTimeRange)
        const position: PositionI[] = (additionalPositions || []).map((_, index) => {
            const positionValue = getValues(`postPosition${index}`);
            const numberStudentValue = getValues(`numberStudent${index}`);
            const salaryValue = getValues(`Salary${index}`);
            return {
                positionName: positionValue,
                amount: numberStudentValue,
                salary: salaryValue,
            };
        });
        const trainingPosition: TrainingPositionsI[] = (additionalTrainingPositions || []).map((_, index) => {
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
            dateFrom: moment(getValues('DateFrom-DateTo')[0]).format(Formater),
            dateTo: moment(getValues('DateFrom-DateTo')[1]).format(Formater),
            timeFrom: formattedTimeRange[0], //00:00:00 
            timeTo: formattedTimeRange[1],
            priority: piority, //độ ưu tiên 1-5, defaultvalue: 0
            isPremium: isPremium, // false
            location: getValues('location'),
            postPositions: position,
            trainingPositions: trainingPosition ? trainingPosition : []
        }
        console.log("params: ", params)
        const result = await dispatch(createPost(params)).then((response) => {
            console.log('response111: ', response.meta.requestStatus)
            const result2 = unwrapResult(response);
            console.log('first: ', result2)
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
            namePosition: '',
            number: null,
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
        unwrapResult(result)
    }
    const handleChangePosition = (value: PostOptionI | null) => {
        setValue('postTitle', value?.id)
        console.log("newValue: ", value)
    }
    useEffect(() => {
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
                setOptions([...postTitleOptionsAPI]);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    useEffect(() => {
        if (!open) {
            setOptions([]);
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
        openAddTitleModal
    }
    return { handler, props }

}
export default useAddNewPostHook;
