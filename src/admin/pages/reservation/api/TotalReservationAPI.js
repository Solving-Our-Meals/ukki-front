import { API_BASE_URL } from '../../../../config/api.config';

export async function TotalReservationAPI(){
    
    const res = await fetch(`${API_BASE_URL}/admin/reservations/total`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
    const userInfo = await res.json();

    return userInfo
}