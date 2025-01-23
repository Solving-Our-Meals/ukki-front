import { API_BASE_URL } from '../../../config/api.config';

export async function getReoprtDTO(no){
    let url = `${API_BASE_URL}/reports/list/${no}`;
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
    const info = await res.json();

    return info;
}