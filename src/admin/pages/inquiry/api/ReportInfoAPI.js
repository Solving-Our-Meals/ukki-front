export async function ReportInfoAPI(reportNo){
    console.log(reportNo);
    const res = await fetch(`/admin/inquiries/info/report/${reportNo}`)
    const reportInfo = await res.json();
    console.log(reportInfo);
    return reportInfo
} 