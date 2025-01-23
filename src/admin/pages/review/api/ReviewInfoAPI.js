import { API_BASE_URL } from '../../../../config/api.config';

export async function ReviewInfoAPI(no){    
    
    const res = await fetch(`${API_BASE_URL}/admin/reviews/info/${no}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
    const reviewInfo = await res.json();

    return reviewInfo
}