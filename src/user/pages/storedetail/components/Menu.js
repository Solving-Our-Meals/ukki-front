// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import styles from '../css/menu.module.css';

// function Menu(){
//     const { storeNo } = useParams();
//     const [menu, setMenu] = useState("");
//     const [none, setIsNone] = useState(true);

//     useEffect(() => {
//         fetch(`/store/${storeNo}/storeMenu`)
//         .then(res => res.text())
//         .then(data => {
//             const menuUrl = `/store/${storeNo}/api/menu?menuName=${data}`
//             setMenu(menuUrl);
//         })
//     }, [])

//     // const onClickHandler = () => {
//     //     setIsNone(prevState => !prevState);
//     // }

//     return(
//         <>
//             <div id={styles.menuStyle}>
//                 <img src={menu} id={styles.menuImg} alt='메뉴판'/>
//             </div>
//             {/* <p id={styles.menu} onClick={onClickHandler}><u>메뉴 보기</u></p>
//             <div className={styles.menuStyle} style={{ display : none? "none" : "block" }}>
//                 <img src={xButton} id={styles.xBtn} onClick={onClickHandler} alt='X버튼'/>
//                 <img src={menu} id={styles.menuImg} alt='메뉴판'/>
//             </div> */}
//         </>
//     );
// }

// export default Menu;

// // 메뉴 이미지 화면 가운데로 오게 하기.

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../css/menu.module.css';
import { API_BASE_URL } from '../../../../config/api.config';

async function fetchStoreMenu(storeNo) {
    const response = await fetch(`${API_BASE_URL}/store/${storeNo}/storeMenu`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.text();
}

function Menu(){
    const { storeNo } = useParams();
    const [menu, setMenu] = useState("");
    const [none, setIsNone] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const menuData = await fetchStoreMenu(storeNo);
                const menuUrl = `${API_BASE_URL}/store/${storeNo}/api/menu?menuName=${menuData}`;
                setMenu(menuUrl);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [storeNo]);

    // const onClickHandler = () => {
    //     setIsNone(prevState => !prevState);
    // }

    return (
        <>
            <div id={styles.menuStyle}>
                <img src={menu} id={styles.menuImg} alt='메뉴판' />
            </div>
            {/* <p id={styles.menu} onClick={onClickHandler}><u>메뉴 보기</u></p>
            <div className={styles.menuStyle} style={{ display: none ? "none" : "block" }}>
                <img src={xButton} id={styles.xBtn} onClick={onClickHandler} alt='X버튼' />
                <img src={menu} id={styles.menuImg} alt='메뉴판' />
            </div> */}
        </>
    );
}

export default Menu;
