import { useState, useEffect } from 'react';
import styles from '../css/menu.module.css';
import xButton from '../images/xBtn.png';

function Menu(){

    const [menu, setMenu] = useState("");
    const [none, setIsNone] = useState(true);

    useEffect(() => {
        fetch('/storeMenu/5')
        .then(res => res.text())
        .then(data => {
            const menuUrl = `/api/menu?menuName=${data}`
            setMenu(menuUrl);
        })
    }, [])

    const onClickHandler = () => {
        setIsNone(prevState => !prevState);
    }

    return(
        <>
            <p id={styles.menu} onClick={onClickHandler}><u>메뉴 보기</u></p>
            <div className={styles.menuStyle} style={{ display : none? "none" : "block" }}>
                <img src={xButton} id={styles.xBtn} onClick={onClickHandler} alt='X버튼'/>
                <img src={menu} id={styles.menuImg} alt='메뉴 사진'/>
            </div>
        </>
    );
}

export default Menu;

// 메뉴 이미지 화면 가운데로 오게 하기.