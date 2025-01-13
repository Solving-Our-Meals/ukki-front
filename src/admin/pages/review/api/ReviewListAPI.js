export async function ReviewListAPI(category, word){
    let reviewList = {}
    if(category == null && word == null){
        const res = await fetch('/admin/reviews/list')
        reviewList = await res.json();
    }else if(category == 'none' && word != null){
        const res = await fetch(`/admin/reviews/list?word=${word}`)
        reviewList = await res.json();
    }else if(category != null && word !=null){
        const res = await fetch(`/admin/reviews/list?category=${category}&word=${word}`)
        reviewList = await res.json();
    }
    return reviewList
} 