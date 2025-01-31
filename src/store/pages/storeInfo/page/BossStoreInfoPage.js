import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import styles from '../css/bossStoreInfoPage.module.css';
import triangleBtn from '../../../../user/pages/storedetail/images/inverted_triangle.png';
import mapIcon from '../../../../user/pages/storedetail/images/mapMarker-logo.png';
import BossBanner from '../components/BossBanner';
import Menu from '../../../../user/pages/storedetail/components/Menu';
import BossProfile from '../components/BossProfile';
import BossMenu from '../components/BossMenu';
import { API_BASE_URL } from '../../../../config/api.config';
import loadingGif from '../../../../common/inquiry/img/loadingInquiryList.gif';

function BossStoreInfoPage(){

    const {storeNo} = useOutletContext();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
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
            fetch(`${API_BASE_URL}/store/${storeNo}/getInfo`,{
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials:"include",
            })
            .then(res => res.json())
            .then(data => {
                setStoreInfo(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.log(error);
                setIsLoading(false);
            });
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

        if(storeInfo.operationTime.breakTime === null){
            storeInfo.operationTime.breakTime = '없음';
        }
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
    }, [storeInfo.operationTime]);  

    const onClickHandler = (e) => {
        setIsNone(prevState => !prevState);
    } 

    const navigateToMyStore = () => {
        navigate(`/store/${storeNo}`);
    }

    if(isLoading){
        // 로딩 상태일 때 로딩 화면을 표시
        return(
            <div className={styles.loadingContainer}>
                <img src={loadingGif} alt='로딩 중' className={styles.loadingImg} />
                <p>Loading...</p>
            </div>
        )
    }

        
    return(
        <div id={styles.background}>
            <div><BossBanner storeNo={storeNo}/>
                <div><BossProfile storeNo={storeNo}/></div>
            </div>
            <div className={styles.nameAndReserve}>
                <p id={styles.storeName}>{storeInfo.storeName}</p>
                <div id={styles.goMyStore} onClick={() => navigateToMyStore()}>가게 상세페이지</div>
            </div>
            <p id={styles.storeDes}>{storeInfo.storeDes}</p>
            <img src={mapIcon} id={styles.mapIcon} alt = '지도 아이콘'/>
            <p id={styles.storeAddress}>{storeInfo.storeAddress}</p>
            <p id={styles.operTime} onClick={onClickHandler}>
                {`영업 시간(오늘) : ${storeInfo.currentOperationTime}`}
                <img src={triangleBtn} id={styles.triangle} alt ="영업시간 더보기 버튼"/>
            </p>
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
            <BossMenu storeNo={storeNo}/>
            {/* <div id={styles.mapArea}><KakaoMap/></div> */}
            <div className={styles.keywordArea}>
                <div>{storeInfo.storeKeyword.keyword1}</div>
                <div>{storeInfo.storeKeyword.keyword2}</div>
                <div>{storeInfo.storeKeyword.keyword3}</div>
                <div>{storeInfo.storeKeyword.keyword4}</div>
                <div>{storeInfo.storeKeyword.keyword5}</div>
                <div>{storeInfo.storeKeyword.keyword6}</div>
            </div>
        </div>
    );
}

export default BossStoreInfoPage;