import { API_BASE_URL } from '../../../config/api.config';  

export async function inquiryList(){
    const res = await fetch(`${API_BASE_URL}/inquiries/list`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
    const inquiries = await res.json();

    for (var i = 0; i < inquiries.length; i++) {
        inquiries[i].no = inquiries[i].inquiryNo

        delete inquiries[i].inquiryNo
    }

    return inquiries
}