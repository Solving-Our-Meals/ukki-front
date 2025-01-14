export async function TotalReviewAPI(){
    const res = await fetch('/admin/reviews/total')
    const totalReview = await res.json();
    return totalReview
} 