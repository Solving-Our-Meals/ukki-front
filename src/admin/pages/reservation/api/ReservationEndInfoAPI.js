import { API_BASE_URL } from '../../../../config/api.config';

export async function ReservationEndInfoAPI(no){
    
    const res = await fetch(`${API_BASE_URL}/admin/reservations/info/end/${no}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
    const resInfo = await res.json();

    return resInfo
}