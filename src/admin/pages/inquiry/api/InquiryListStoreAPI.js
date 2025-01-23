import { API_BASE_URL } from '../../../../config/api.config';

export async function InquiryListStoreAPI(category, word){
    let inquiryList = {}
    if(category == null && word == null){
        const res = await fetch(`${API_BASE_URL}/admin/inquiries/list/store`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        inquiryList = await res.json();
    }else if(category == 'none' && word != null){
        const res = await fetch(`${API_BASE_URL}/admin/inquiries/list/store?word=${word}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        inquiryList = await res.json();
    }else if(category != null && word !=null){
        const res = await fetch(`${API_BASE_URL}/admin/inquiries/list/store?category=${category}&word=${word}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        inquiryList = await res.json();
    }
    return inquiryList
} 