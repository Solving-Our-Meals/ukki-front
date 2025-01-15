export async function TotalInquiryAPI(){
    const res = await fetch('/admin/inquiries/total')
    const totalInquiry = await res.json();
    return totalInquiry
} 