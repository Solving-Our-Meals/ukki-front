export async function NoticeListUserAPI(word){
    let noticeList = {}
    if(word == null){
        const res = await fetch('/admin/notices/list/user')
        noticeList = await res.json();
    }else if(word != null){
        const res = await fetch(`/admin/notices/list/user?word=${word}`)
        noticeList = await res.json();
    }
    return noticeList
} 