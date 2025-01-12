
export async function TotalUserAPI(){
    
    const res = await fetch(`/admin/users/total`)
    const userInfo = await res.json();

    return userInfo
}