import { unwrapResult } from '@reduxjs/toolkit';
import { useAppSelector } from 'app/hooks';
import { useAppDispatch } from 'app/store';
import { getPostTitle } from 'features/postTitleSlice';
import useTitle from 'hooks/useTitle';
import PostCreated, { PositionI, TrainingPositionsI } from 'models/post.model';
import PostOptionI from 'models/postOption.model';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";

interface AdditionalPosition {
    namePosition: string;
    number: number | null;
    salary: number | null;
}
interface AdditionalTrainingPosition {
    number: number | null;
    salary: number | null;
}
const useAddNewPostHook = () => {
    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue, getValues
    } = useForm();
    const Formater = 'DD/MM/YYYY';
    const dispatch = useAppDispatch();
    useTitle("Add New Post");

    const postTitleOptionsAPI = useAppSelector(state => state.postTitle.postTitleOption)
    const [error, setError] = useState<String>('');
    const [errorTraining, setErrorTraining] = useState<String>('');

    const [piority, setPiority] = useState<number | null>(0);
    const [isPremium, setIsPremium] = useState<boolean>(false);
    const [createParams, setCreateParams] = useState<PostCreated>()

    const onPremiumChange = () => {
        setIsPremium(!isPremium);
    }
    const onChangeSliderPiority = (newValue: number | null) => {
        setPiority(newValue);
    };
    const onSubmit = async (data: any) => {
        console.log("data: ", data);
        console.log("positionValue1", getValues('postPosition1'))

        const position: PositionI[] = (additionalPositions || []).map((_, index) => {
            const positionValue = getValues(`postPosition${index}`);
            const numberStudentValue = getValues(`numberStudent${index}`);
            const salaryValue = getValues(`Salary${index}`);
            console.log("positionValue", positionValue)
            console.log("numberStudentValue", numberStudentValue)
            console.log("salaryValue", salaryValue)

            return {
                position: positionValue,
                amount: numberStudentValue,
                salary: salaryValue,
            };
        });
        const trainingPosition: TrainingPositionsI[] = [{
            amount: null,
            salary: null
        }]
        const params: PostCreated = {
            postTitleId: getValues('postTitle'), //completetext box 
            postDescription: getValues('postDescription'),
            dateFrom: moment(getValues('DateFrom-DateTo')[0]).format(Formater),
            dateTo: moment(getValues('DateFrom-DateTo')[1]).format(Formater),
            timeFrom: '', //00:00:00 
            timeTo: '',
            priority: piority, //độ ưu tiên 1-5, defaultvalue: 0
            isPremium: isPremium, // false
            location: '',
            postPositions: position,
            trainingPositions: trainingPosition
        }
        console.log("params: ", params)
        // const result = dispatch(createPost(data)).then(() => {
        //     console.log(result);
        // }).catch((error) => {
        //     console.error(error)
        // })
        // You can perform your submission logic here
    };
    const [additionalPositions, setAdditionalPositions] = useState<AdditionalPosition[]>([{
        namePosition: '',
        number: null,
        salary: null,
    }]);
    const [additionalTrainingPositions, setAdditionalTrainingPositions] = useState<AdditionalTrainingPosition[]>([{
        number: null,
        salary: null,
    }]);
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
            number: null,
            salary: null,
        };
        setErrorTraining('');
        setAdditionalTrainingPositions([...additionalTrainingPositions, newPosition]);
    };
    const handleDeletePosition = (indexToDelete: number) => {
        if (additionalPositions.length === 1) {
            setError('Need at least 1 position to make a post')
        } else {
            setError('')
            const updatedPositions = additionalPositions.filter((_, index) => index !== indexToDelete);
            setAdditionalPositions(updatedPositions);
        }

    };
    const featchPostTitleOption = async () => {
        const result = await dispatch(getPostTitle());
        unwrapResult(result)
    }
    const handleChangePosition = (value: PostOptionI | null) => {
        setValue('postTitle', value?.id)
        console.log("newValue: ", value)
    }
    useEffect(() => {
        featchPostTitleOption()
    }, [])
    const [open, setOpen] = useState(false);

    const [options, setOptions] = useState<readonly PostOptionI[]>([]);
    const loading = open && options.length === 0;
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
        setOpen
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
        additionalTrainingPositions
    }
    return { handler, props }

}
export default useAddNewPostHook;
