
export async function UserListAPI(category, word){
    console.log(category)
    console.log(word)
    let userList = {}
    if(category == null && word == null){
        console.log("요기")
    const res = await fetch('/admin/users/list/')
    userList = await res.json();
    }else if(category == 'none' && word != null){
        console.log("저기")
        const res = await fetch(`/admin/users/list?word=${word}`)
        userList = await res.json();
    }else if(category != null && word !=null){
        console.log("거기")
        const res = await fetch(`/admin/users/list?category=${category}&word=${word}`)
        userList = await res.json();
    }
    console.log(userList)

    return userList
}