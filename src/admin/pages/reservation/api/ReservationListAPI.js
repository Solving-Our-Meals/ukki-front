import { API_BASE_URL } from '../../../../config/api.config';

export async function ReservationListAPI(category, word){
    let resList = {}
    if(category == null && word == null){
        const res = await fetch(`${API_BASE_URL}/admin/reservations/list`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        resList = await res.json();
    }else if(category == 'none' && word != null){
        const res = await fetch(`${API_BASE_URL}/admin/reservations/list?word=${word}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        resList = await res.json();
    }else if(category != null && word !=null){
        const res = await fetch(`${API_BASE_URL}/admin/reservations/list?category=${category}&word=${word}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        resList = await res.json();
    }
    return resList
} 