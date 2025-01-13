
export async function UserListAPI(category, word){
    let userList = {}
    if(category == null && word == null){
    const res = await fetch('/admin/users/list')
    userList = await res.json();
    }else if(category == 'none' && word != null){
        const res = await fetch(`/admin/users/list?word=${word}`)
        userList = await res.json();
    }else if(category != null && word !=null){
        const res = await fetch(`/admin/users/list?category=${category}&word=${word}`)
        userList = await res.json();
    }

    return userList
}