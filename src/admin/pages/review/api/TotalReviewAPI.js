import { API_BASE_URL } from '../../../../config/api.config';

export async function TotalReviewAPI(){
    const res = await fetch(`${API_BASE_URL}/admin/reviews/total`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
    const totalReview = await res.json();
    return totalReview
} 