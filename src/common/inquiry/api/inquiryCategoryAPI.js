import { API_BASE_URL } from '../../../config/api.config';

export async function inquiryCategory(){
    const res = await fetch(`${API_BASE_URL}/inquiries/categories`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
    const category = await res.json();

    return category
}