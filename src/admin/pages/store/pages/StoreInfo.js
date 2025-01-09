import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../css/StoreInfo.module.css';
import triangleBtn from '../images/inverted_triangle.png';
import Banner from '../components/Banner';
import Profile from '../components/Profile';
import Menu from '../components/Menu';

function StoreInfo() {
    const { storeNo } = useParams();
    const [colorMonday, setColorMonday] = useState("");
    const [colorTuesday, setColorTuesday] = useState("");
    const [colorWednesday, setColorWednesday] = useState("");
    const [colorThursday, setColorThursday] = useState("");
    const [colorFriday, setColorFriday] = useState("");
    const [colorSaturday, setColorSaturday] = useState("");
    const [colorSunday, setColorSunday] = useState("");

    const [isNone, setIsNone] = useState(true);
       
    const [storeInfo, setStoreInfo] = useState({
        storeNo: 0,
        storeName: "가게 이름",
        storeDes: "가게 소개글",
        storeAddress: "가게 주소",
        storeKeyword: [],
        operation: [],
        operationTime: ""
    });

    useEffect(() => {
        fetch(`/admin/stores/info/${storeNo}`)
        .then(res => res.json())
        .then(data => {
            setStoreInfo(data)
            console.log("가게 정보 :", data)
        })
        .catch(error => console.log(error));
    }, [storeNo]);

    // StoreDetail.js의 나머지 useEffect와 함수들 복사

    return (
        <div className={styles.storeInfo}>
            <div><Banner/>
                <div><Profile/></div>
            </div>
            <p id={styles.storeName}>{storeInfo.storeName}</p>
            <p id={styles.storeDes}>{storeInfo.storeDes}</p>
            <p id={styles.storeAddress}>{storeInfo.storeAddress}</p>
            <p id={styles.operTime} onClick={onClickHandler}>
                {`영업 시간(오늘) : ${storeInfo.currentOperationTime}`}
                <img src={triangleBtn} id={styles.triangle} alt="영업시간 더보기 버튼"/>
            </p>
            <div id={styles.tatolOperTime} style={{ display: isNone ? "none" : "block" }}>
                {/* StoreDetail.js의 영업시간 표시 부분 복사 */}
            </div>
            <Menu/>
            <div className={styles.keywordArea}>
                {/* StoreDetail.js의 키워드 영역 복사 */}
            </div>
            <hr id={styles.hr}></hr>
        </div>
    );
}

export default StoreInfo; 