
export async function TotalReservationAPI(){
    
    const res = await fetch(`/admin/reservations/total`)
    const userInfo = await res.json();

    return userInfo
}