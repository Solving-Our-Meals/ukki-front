export async function ReviewInfoAPI(no){    
    
    const res = await fetch(`/admin/reviews/info/${no}`)
    const reviewInfo = await res.json();

    return reviewInfo
}