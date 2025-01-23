import { API_BASE_URL } from '../../../../config/api.config';

export async function NoticeInfoAPI(noticeNo){
    const res = await fetch(`${API_BASE_URL}/admin/notices/info/${noticeNo}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
    const noticeInfo = await res.json();
    return noticeInfo
} 