import { useState, useEffect } from 'react';

export const getMenuAPI = async (storeNo) => {
    const [menu, setMenu] = useState("");
    useEffect(() => {
        fetch(`/store/storeMenu/${storeNo}`)
        .then(res => res.text())
        .then(data => {
            const menuUrl = `/store/api/menu?menuName=${data}`
            setMenu(menuUrl);
        })
    }, []);

    return menu;
}