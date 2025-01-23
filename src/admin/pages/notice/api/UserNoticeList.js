import { API_BASE_URL } from '../../../../config/api.config';

export async function NoticeListUserAPI(word){
    let noticeList = {}
    if(word == null){
        const res = await fetch(`${API_BASE_URL}/admin/notices/list/user`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        noticeList = await res.json();
    }else if(word != null){
        const res = await fetch(`${API_BASE_URL}/admin/notices/list/user?word=${word}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        noticeList = await res.json();
    }
    return noticeList
} 