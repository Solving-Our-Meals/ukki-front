
export async function UserInfoAPI(no){
    
    const res = await fetch(`/admin/users/info/${no}`)
    const userInfo = await res.json();

    return userInfo
}