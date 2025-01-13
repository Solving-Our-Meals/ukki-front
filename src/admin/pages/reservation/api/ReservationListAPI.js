export async function ReservationListAPI(category, word){
    let resList = {}
    if(category == null && word == null){
        const res = await fetch('/admin/reservations/list')
        resList = await res.json();
    }else if(category == 'none' && word != null){
        const res = await fetch(`/admin/reservations/list?word=${word}`)
        resList = await res.json();
    }else if(category != null && word !=null){
        const res = await fetch(`/admin/reservations/list?category=${category}&word=${word}`)
        resList = await res.json();
    }
    return resList
} 