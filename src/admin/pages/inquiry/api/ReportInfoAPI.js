import { API_BASE_URL } from '../../../../config/api.config';

export async function ReportInfoAPI(reportNo){
    console.log(reportNo);
    const res = await fetch(`${API_BASE_URL}/admin/inquiries/info/report/${reportNo}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
    const reportInfo = await res.json();
    console.log(reportInfo);
    return reportInfo
} 