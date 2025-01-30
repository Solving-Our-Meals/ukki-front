import { useState, useEffect } from 'react';
import styles from '../css/bossMenu.module.css';
import { API_BASE_URL } from '../../../../config/api.config';

function BossMenu({storeNo}){
    const [menu, setMenu] = useState("");

    useEffect(() => {
        fetch(`${API_BASE_URL}/store/${storeNo}/storeMenu`,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials:"include",
        })
        .then(res => res.text())
        .then(data => {
            const menuUrl = `${API_BASE_URL}/store/${storeNo}/api/menu?menuName=${data}`
            setMenu(menuUrl);
        })
    }, [])


    return(
        <>
            <div id={styles.menuStyle}>
                <img src={menu} id={styles.menuImg} alt='메뉴판'/>
            </div>
        </>
    );
}

export default BossMenu;

// 메뉴 이미지 화면 가운데로 오게 하기.