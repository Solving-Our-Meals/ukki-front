import { API_BASE_URL } from '../../../../config/api.config';   

export async function ReservationTodayInfoAPI(no){
    
    const res = await fetch(`${API_BASE_URL}/admin/reservations/info/today/${no}`, {
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