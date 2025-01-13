
export async function ReservationTodayInfoAPI(no){
    
    const res = await fetch(`/admin/reservations/info/today/${no}`)
    const resInfo = await res.json();

    return resInfo
}