import { API_BASE_URL } from '../../../../config/api.config';

export async function ReviewListAPI(category, word){
    let reviewList = {}
    if(category == null && word == null){
        const res = await fetch(`${API_BASE_URL}/admin/reviews/list`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        reviewList = await res.json();
    }else if(category == 'none' && word != null){
        const res = await fetch(`${API_BASE_URL}/admin/reviews/list?word=${word}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        reviewList = await res.json();
    }else if(category != null && word !=null){
        const res = await fetch(`${API_BASE_URL}/admin/reviews/list?category=${category}&word=${word}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        reviewList = await res.json();
    }
    return reviewList
} 