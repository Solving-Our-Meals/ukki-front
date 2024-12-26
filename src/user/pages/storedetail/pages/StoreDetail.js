import { useState, useEffect } from 'react';
import styles from '../css/storedetail.module.css';
import mapIcon from '../images/mapMarker-logo.png';
import triangleBtn from '../images/inverted_triangle.png';
import Banner from '../components/Banner';
import Profile from '../components/Profile';
import KakaoMap from '../components/KakaoMap';
import Menu from '../components/Menu';


function StoreDetail(){

    const [colorMonday, setColorMonday] = useState("");
    const [colorTuesday, setColorTuesday] = useState("");
    const [colorWednesday, setColorWednesday] = useState("");
    const [colorThursday, setColorThursday] = useState("");
    const [colorFriday, setColorFriday] = useState("");
    const [colorSaturday, setColorSaturday] = useState("");
    const [colorSunday, setColorSunday] = useState("");

    const [isNone, setIsNone] = useState(true);
       
    const [storeInfo, setStoreInfo] = useState({
        storeNo : 0,
        storeName : "가게 이름",
        storeDes : "가게 소개글",
        storeAddress : "가게 주소",
        storeKeyword : [],
        operation : [],
        operationTime : ""
    });

    useEffect(
        () => {
            fetch('/store/test')  //검색 페이지 만들어지면 pathvariable로 변경하기
            .then(res => res.json())
            .then(data => {
                setStoreInfo(data)
                console.log(data)
            })
            .catch(error => console.log(error));
        }, []
    );

    useEffect(() => {
        const date = new Date();
        const day = date.getDay();

        const dayOfWeekMap = {
            0 : "sunday",
            1 : "monday",
            2 : "tuesday", 
            3 : "wednesday", 
            4 : "thursday",
            5 : "friday",
            6 : "saturday"
        };

        const dayOfWeek = dayOfWeekMap[day];

        if(storeInfo.operationTime){
            const currentOperationTime = storeInfo.operationTime[dayOfWeek];
            setStoreInfo(prevState => ({
                ...prevState,
                currentOperationTime : currentOperationTime
            }));
        }

        console.log("dayOfWeek : " , dayOfWeek);
    }, [storeInfo.operationTime]);
    
    useEffect(() => {
        if (storeInfo.operationTime.monday === "휴무") {
            setColorMonday("#FF5D18");
        } else {
            setColorMonday("#323232");
        }
        if (storeInfo.operationTime.tuesday === "휴무") {
            setColorTuesday("#FF5D18");
        } else {
            setColorTuesday("#323232");
        }
        if (storeInfo.operationTime.wednesday === "휴무") {
            setColorWednesday("#FF5D18");
        } else {
            setColorWednesday("#323232");
        }
        if (storeInfo.operationTime.thursday === "휴무") {
            setColorThursday("#FF5D18");
        } else {
            setColorThursday("#323232");
        }
        if (storeInfo.operationTime.friday === "휴무") {
            setColorFriday("#FF5D18");
        } else {
            setColorFriday("#323232");
        }
        if (storeInfo.operationTime.saturday === "휴무") {
            setColorSaturday("#FF5D18");
        } else {
            setColorSaturday("#323232");
        }
        if (storeInfo.operationTime.sunday === "휴무") {
            setColorSunday("#FF5D18");
        } else {
            setColorSunday("#323232");
        }
    }, [storeInfo]);  

    const onClickHandler = (e) => {
        setIsNone(prevState => !prevState);
    } 
    
    console.log("요일 별 운영시간 : " , storeInfo.operationTime);
    console.log("오늘 운영 시간 : ", storeInfo.currentOperationTime);

    return(
        <div className={styles.storeDetail}>
            <div><Banner/>
                <div><Profile/></div>
            </div>
            <p id={styles.storeName}>{storeInfo.storeName}</p>
            <p id={styles.storeDes}>{`식당 소개 : ${storeInfo.storeDes}`}</p>
            <img src={mapIcon} id={styles.mapIcon} alt = '지도 아이콘'/>
            <p id={styles.storeAddress}>{storeInfo.storeAddress}</p>
            <p id={styles.operTime} onClick={onClickHandler}>{`영업 시간(오늘) : ${storeInfo.currentOperationTime}`}</p>
            <div id={styles.tatolOperTime} style={{ display : isNone ? "none" : "block" }}>
                <p className={styles.week}>(월)</p>&ensp;<p className={styles.weekOperTime} style={{ color : colorMonday }}>{storeInfo.operationTime.monday}</p> <br/>
                <p className={styles.week}>(화)</p>&ensp;<p className={styles.weekOperTime} style={{ color : colorTuesday }}>{storeInfo.operationTime.tuesday}</p> <br/>
                <p className={styles.week}>(수)</p>&ensp;<p className={styles.weekOperTime} style={{ color : colorWednesday }}>{storeInfo.operationTime.wednesday}</p> <br/>
                <p className={styles.week}>(목)</p>&ensp;<p className={styles.weekOperTime} style={{ color : colorThursday }}>{storeInfo.operationTime.thursday}</p> <br/>
                <p className={styles.week}>(금)</p>&ensp;<p className={styles.weekOperTime} style={{ color : colorFriday }}>{storeInfo.operationTime.friday}</p> <br/>
                <p className={styles.week}>(토)</p>&ensp;<p className={styles.weekOperTime} style={{ color : colorSaturday }}>{storeInfo.operationTime.saturday}</p> <br/>
                <p className={styles.week}>(일)</p>&ensp;<p className={styles.weekOperTime} style={{ color : colorSunday }}>{storeInfo.operationTime.sunday}</p> <br/>
                <p id={styles.breakTime}>{`*브레이크 타임 : ${storeInfo.operationTime.breakTime}`}</p> <br/>
            </div>
            <img src={triangleBtn} id={styles.triangle} onClick={onClickHandler} alt ="영업시간 더보기 버튼"/>
            <Menu/>
            <div id={styles.mapArea}><KakaoMap/></div>
            <div className={styles.keywordArea}>
                <div>{storeInfo.storeKeyword.keyword1}</div>
                <div>{storeInfo.storeKeyword.keyword2}</div>
                <div>{storeInfo.storeKeyword.keyword3}</div>
                <div>{storeInfo.storeKeyword.keyword4}</div>
                <div>{storeInfo.storeKeyword.keyword5}</div>
                <div>{storeInfo.storeKeyword.keyword6}</div>
            </div>
            <hr id={styles.hr}></hr>
        </div>
    );
}

export default StoreDetail;