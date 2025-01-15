export async function InquiryInfoAPI(inquiryNo){
    const res = await fetch(`/admin/inquiries/info/${inquiryNo}`)
    const inquiryInfo = await res.json();
    return inquiryInfo
} 