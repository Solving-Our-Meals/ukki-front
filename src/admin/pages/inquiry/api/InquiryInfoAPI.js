import { API_BASE_URL } from '../../../../config/api.config';   

export async function InquiryInfoAPI(inquiryNo){
    const res = await fetch(`${API_BASE_URL}/admin/inquiries/info/${inquiryNo}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
    const inquiryInfo = await res.json();
    return inquiryInfo
} 