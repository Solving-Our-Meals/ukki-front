export async function ReservationListAPI(category, word){
    let storeList = {}
    if(category == null && word == null){
        const res = await fetch('/admin/reservations/list')
        storeList = await res.json();
    }else if(category == 'none' && word != null){
        const res = await fetch(`/admin/reservations/list?word=${word}`)
        storeList = await res.json();
    }else if(category != null && word !=null){
        const res = await fetch(`/admin/reservations/list?category=${category}&word=${word}`)
        storeList = await res.json();
    }
    return storeList
} 