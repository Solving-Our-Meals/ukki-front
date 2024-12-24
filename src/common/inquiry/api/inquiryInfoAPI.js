
export async function getInquiryDTO(no){
    let url = '/inquiries/list/'+no;
    const res = await fetch(url)
    const info = await res.json();

    return info;
}