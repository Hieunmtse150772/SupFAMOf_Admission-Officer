// AuthService.ts
import { AxiosResponse } from 'axios';

import DocumentOption from 'dtos/documentOption.dto';
import DocumentCreated from 'models/document.model';
import axiosClient from './axiosClient';

export const documentService = {
    getDocument: (): Promise<AxiosResponse<DocumentOption>> => {
        const url = '/admission/admission-document?pagesize=100';
        return axiosClient.get(url);
    },
    createDocument: (payload: DocumentCreated): Promise<AxiosResponse<DocumentOption>> => {
        const url = '/admission/admission-document';
        return axiosClient.post(url, payload);
    }
};
