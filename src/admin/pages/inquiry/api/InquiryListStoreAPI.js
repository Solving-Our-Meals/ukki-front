export async function InquiryListStoreAPI(category, word){
    let inquiryList = {}
    if(category == null && word == null){
        const res = await fetch('/admin/inquiries/list/store')
        inquiryList = await res.json();
    }else if(category == 'none' && word != null){
        const res = await fetch(`/admin/inquiries/list/store?word=${word}`)
        inquiryList = await res.json();
    }else if(category != null && word !=null){
        const res = await fetch(`/admin/inquiries/list/store?category=${category}&word=${word}`)
        inquiryList = await res.json();
    }
    return inquiryList
} 