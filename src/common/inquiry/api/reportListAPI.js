export async function reportList() {
    const res = await fetch("/reports/list")
    const data = await res.json();

    for (var i = 0; i < data.length; i++) {
        data[i].inquiryTitle = data[i].reportTitle
        data[i].inquiryDate = data[i].reportDate
        data[i].no = data[i].reportNo
        delete data[i].reportDate
        delete data[i].reportTitle
        delete data[i].reportNo
    }

    
    return data;
}