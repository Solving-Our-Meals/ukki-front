import { API_BASE_URL } from '../../../config/api.config';

export async function reportList() {
    const res = await fetch(`${API_BASE_URL}/reports/list`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
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