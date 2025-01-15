export async function ReportInfoAPI(reportNo){
    const res = await fetch(`/admin/inquiries/info/report/${reportNo}`)
    const reportInfo = await res.json();
    return reportInfo
} 