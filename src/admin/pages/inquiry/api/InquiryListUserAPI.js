import { API_BASE_URL } from '../../../../config/api.config';

export async function InquiryListUserAPI(category, word){
    let inquiryList = {}
    if(category == null && word == null){
        const res = await fetch(`${API_BASE_URL}/admin/inquiries/list/user`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        inquiryList = await res.json();
    }else if(category == 'none' && word != null){
        const res = await fetch(`${API_BASE_URL}/admin/inquiries/list/user?word=${word}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        inquiryList = await res.json();
    }else if(category != null && word !=null){
        const res = await fetch(`${API_BASE_URL}/admin/inquiries/list/user?category=${category}&word=${word}`, {
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