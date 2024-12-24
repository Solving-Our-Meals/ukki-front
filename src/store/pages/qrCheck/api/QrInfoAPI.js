export async function getQrInfo(qrName) {
    try {
        const res = await fetch(`/qr/${qrName}`);

        if (!res.ok) {
            throw new Error('응답 실패');
        }

        const text = await res.text();
        const qrInfo = text ? JSON.parse(text) : {};

        if (qrInfo.message && qrInfo.message == "none") {
            
            return null;
        } else {
            console.log(qrInfo)
            return qrInfo;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;  // 에러 발생 시 null 반환
    }
}
