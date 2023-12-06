import {
    ModalForm,
    ProForm,
    ProFormDatePicker
} from '@ant-design/pro-components';
import { Modal, message } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { useAppSelector } from 'app/hooks';
import { useAppDispatch } from 'app/store';
import dayjs from 'dayjs';
import { handleDownloadMonthLyReportOpenDay, handleDownloadMonthLyReportTuyenSinh } from 'features/reportSlice';
import { ParamsExportI } from 'models/paramsExport.model';
import { FC } from 'react';

interface ExportModalProps {
    open: boolean,
    setOpenExportModal: React.Dispatch<React.SetStateAction<boolean>>,
    nameFile: string,
}
const ExportModal: FC<ExportModalProps> = ({ open, setOpenExportModal, nameFile }) => {
    const { confirm } = Modal;
    const Formatter = 'DD/MM/YYYY';
    const dispatch = useAppDispatch();
    const loading = useAppSelector(state => state.report.loading)
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };
    const handleExportMonthlyReportExcelOpenDay = async (params: ParamsExportI) => {

        await dispatch(handleDownloadMonthLyReportOpenDay(params)).then((response: any) => {
            if (response?.payload?.status === 200) {
                message.success('Export successful');
                setOpenExportModal(false);
            } else {
                message.error('Does not have post or account to generate in that month of the year');
            }
        })
    }
    const handleExportMonthlyReportExcelTuyenSinh = async (params: ParamsExportI) => {
        await dispatch(handleDownloadMonthLyReportTuyenSinh(params)).then((response: any) => {
            if (response?.payload?.status === 200) {
                message.success('Export successful');
                setOpenExportModal(false);
            } else {
                message.error('Does not have post or account to generate in that month of the year');
            }
        })
    }
    const handleExport = async (value: any) => {
        const params: ParamsExportI = {
            Month: value?.month.split('-')[1],
            Year: value?.month.split('-')[0]
        }
        console.log('params: ', params)
        if (nameFile === 'tuyen-sinh') {
            handleExportMonthlyReportExcelTuyenSinh(params);
        } else {
            handleExportMonthlyReportExcelOpenDay(params);
        }
    }

    return (
        <>
            <ModalForm
                title="Select month/year"
                open={open}
                loading={loading}
                onOpenChange={setOpenExportModal}
                onFinish={handleExport}
                submitter={{
                    searchConfig: {
                        submitText: 'Submit',
                        resetText: 'Cancel'// Đặt lại văn bản cho nút gửi
                    }
                }}
                width={400}
            >
                <ProForm.Group>
                    <ProFormDatePicker.Month
                        name='month'
                        label='Month'
                        width='lg'
                        rules={[{ required: true, message: 'The month is required!' }]}
                    />
                </ProForm.Group>
            </ModalForm>
        </>
    );
};

export default ExportModal;