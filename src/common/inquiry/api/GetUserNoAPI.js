import { API_BASE_URL } from '../../../config/api.config';

export async function getUserNo(){
    const res = await fetch(`${API_BASE_URL}/user/info`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
    const userNo = await res.json();

    console.log(userNo);
    console.log(userNo.userNo);
    return userNo.userNo
}