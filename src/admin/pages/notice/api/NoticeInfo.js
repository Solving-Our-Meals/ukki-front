export async function NoticeInfoAPI(noticeNo){
    const res = await fetch(`/admin/notices/info/${noticeNo}`)
    const noticeInfo = await res.json();
    return noticeInfo
} 