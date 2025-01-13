export async function ReservationEndInfoAPI(no){
    
    const res = await fetch(`/admin/reservations/info/end/${no}`)
    const resInfo = await res.json();

    return resInfo
}