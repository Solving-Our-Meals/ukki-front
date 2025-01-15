export async function InquiryListUserAPI(category, word){
    let inquiryList = {}
    if(category == null && word == null){
        const res = await fetch('/admin/inquiries/list/user')
        inquiryList = await res.json();
    }else if(category == 'none' && word != null){
        const res = await fetch(`/admin/inquiries/list/user?word=${word}`)
        inquiryList = await res.json();
    }else if(category != null && word !=null){
        const res = await fetch(`/admin/inquiries/list/user?category=${category}&word=${word}`)
        inquiryList = await res.json();
    }
    return inquiryList
} 