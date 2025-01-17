export async function NoticeListStoreAPI(word){
    let noticeList = {}
    if(word == null){
        const res = await fetch('/admin/notices/list/store')
        noticeList = await res.json();
    }else if(word != null){
        const res = await fetch(`/admin/notices/list/store?word=${word}`)
        noticeList = await res.json();
    }
    return noticeList
} 