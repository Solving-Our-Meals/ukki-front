
export async function inquiryCategory(){
    const res = await fetch('/inquiries/categories')
    const category = await res.json();

    return category
}