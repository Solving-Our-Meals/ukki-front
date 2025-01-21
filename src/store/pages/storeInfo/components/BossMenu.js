import { useState, useEffect } from 'react';
import styles from '../css/bossMenu.module.css';

function BossMenu({storeNo}){
    const [menu, setMenu] = useState("");

    useEffect(() => {
        fetch(`/store/${storeNo}/storeMenu`)
        .then(res => res.text())
        .then(data => {
            const menuUrl = `/store/${storeNo}/api/menu?menuName=${data}`
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