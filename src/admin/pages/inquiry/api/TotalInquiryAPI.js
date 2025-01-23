import { API_BASE_URL } from '../../../../config/api.config';

export async function TotalInquiryAPI(){
    const res = await fetch(`${API_BASE_URL}/admin/inquiries/total`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
    const totalInquiry = await res.json();
    return totalInquiry
} 