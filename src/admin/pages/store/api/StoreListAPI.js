import { API_BASE_URL } from '../../../../config/api.config';

export async function StoreListAPI(category, word){
    let storeList = {}
    if(category == null && word == null){
        const res = await fetch(`${API_BASE_URL}/admin/stores/list`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        storeList = await res.json();
    }else if(category == 'none' && word != null){
        const res = await fetch(`${API_BASE_URL}/admin/stores/list?word=${word}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        storeList = await res.json();
    }else if(category != null && word !=null){
        const res = await fetch(`${API_BASE_URL}/admin/stores/list?category=${category}&word=${word}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        storeList = await res.json();
    }
    return storeList
} 