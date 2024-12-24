export async function getReoprtDTO(no){
    let url = '/reports/list/'+no;
    const res = await fetch(url)
    const info = await res.json();

    return info;
}