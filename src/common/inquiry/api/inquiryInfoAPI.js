import { API_BASE_URL } from '../../../config/api.config';

export async function getInquiryDTO(no){
    let url = `${API_BASE_URL}/inquiries/list/${no}`;
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
    const info = await res.json();

    return info;
}