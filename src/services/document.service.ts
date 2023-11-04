// AuthService.ts
import { AxiosResponse } from 'axios';

import { default as DocumentOptionDto } from 'dtos/documentOption.dto';
import DocumentCreated from 'models/document.model';
import axiosClient from './axiosClient';

export const documentService = {
    getDocument: (): Promise<AxiosResponse<DocumentOptionDto>> => {
        const url = '/admission/admission-document?pagesize=100';
        return axiosClient.get(url);
    },
    createDocument: (payload: DocumentCreated): Promise<AxiosResponse<DocumentOptionDto>> => {
        const url = '/admission/admission-document';
        return axiosClient.post(url, payload);
    },
    deleteDocument: (id: string): Promise<AxiosResponse<DocumentOptionDto>> => {
        const url = '/admission/admission-document';
        return axiosClient.delete(url, {
            params: {
                documentId: id,
            },
        });
    }
};
