import { API_BASE_URL } from '../../../../config/api.config';   

export async function StoreNoAPI(userNo){
    const res = await fetch(`${API_BASE_URL}/admin/inquiries/store/${userNo}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
    const storeNo = await res.json();
    return storeNo
} 