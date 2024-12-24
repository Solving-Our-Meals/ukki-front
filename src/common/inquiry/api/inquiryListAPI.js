export async function inquiryList(){
    const res = await fetch('/inquiries/list')
    const inquiries = await res.json();

    for (var i = 0; i < inquiries.length; i++) {
        inquiries[i].no = inquiries[i].inquiryNo

        delete inquiries[i].inquiryNo
    }

    return inquiries
}