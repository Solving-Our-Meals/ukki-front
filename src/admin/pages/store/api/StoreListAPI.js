export async function StoreListAPI(category, word){
    let storeList = {}
    if(category == null && word == null){
        const res = await fetch('/admin/stores/list')
        storeList = await res.json();
    }else if(category == 'none' && word != null){
        const res = await fetch(`/admin/stores/list?word=${word}`)
        storeList = await res.json();
    }else if(category != null && word !=null){
        const res = await fetch(`/admin/stores/list?category=${category}&word=${word}`)
        storeList = await res.json();
    }
    return storeList
} 