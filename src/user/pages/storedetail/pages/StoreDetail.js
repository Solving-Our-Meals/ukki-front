import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../css/storedetail.module.css';
import mapIcon from '../images/mapMarker-logo.png';
import triangleBtn from '../images/inverted_triangle.png';
import Banner from '../components/Banner';
import Profile from '../components/Profile';
import Menu from '../components/Menu';
import { API_BASE_URL } from '../../../../config/api.config';
import { useError } from '../../../../common/error/components/ErrorContext';
import loadingGif from '../../../../common/inquiry/img/loadingInquiryList.gif';


function StoreDetail({reservationHandler}){

    const { storeNo } = useParams();
    const { setGlobalError } = useError(); 
    const [isLoading, setIsLoading] = useState(true);

    const [colorMonday, setColorMonday] = useState("");
    const [colorTuesday, setColorTuesday] = useState("");
    const [colorWednesday, setColorWednesday] = useState("");
    const [colorThursday, setColorThursday] = useState("");
    const [colorFriday, setColorFriday] = useState("");
    const [colorSaturday, setColorSaturday] = useState("");
    const [colorSunday, setColorSunday] = useState("");

    const [isNone, setIsNone] = useState(true);

    const navigate = useNavigate();
       
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
            console.log('sshshshshshshshshsh');
            fetch(`${API_BASE_URL}/store/${storeNo}/getInfo`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials : "include",
            })  //검색 페이지 만들어지면 pathvariable로 변경하기
            .then(response => {
                // if (!response.ok) {
                //     const error = new Error(`HTTP error! status: ${response.status}`);
                //     error.status = response.status;
                //     throw error;
                // }
                // // 비어 있는 응답 대비
                // if(response.status === 204) {
                //     return [];
                // }
                return response.json();
            })
            .then(data => {
                setStoreInfo(data);
                setIsLoading(false);
                navigate(`/store/${storeNo}`,{
                    state:{
                        source : 'storedetail',
                        storeName : data.storeName,
                        storeNo : data.storeNo,
                    },
                //console.log("가게 정보111 :",data)
                });
            })
            .catch(error => {
                console.error(error);
                setGlobalError(error.message, error.status);

                // 네비게이션 처리: 에러 상태에 맞는 페이지로 리디렉션
                // if (error.status === 404) {
                //     navigate('/404');
                // } else if (error.status === 403) {
                //     navigate('/403');
                // } else {
                //     navigate('/500');
                // }
                setIsLoading(false); // 에러 발생 시에도 로딩 상태를 false로 설정정
            });
        }, [setGlobalError]
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

        //console.log("dayOfWeek : " , dayOfWeek);

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

    if(isLoading){
        // 로딩 상태일 때 로딩 화면을 표시
        return(
            <div className={styles.loadingContainer}>
                <img src={loadingGif} alt='로딩 중' className={styles.loadingImg} />
                <p>Loading...</p>
            </div>
        )
    }
    
    //console.log("요일 별 운영시간 : " , storeInfo.operationTime);
    //console.log("오늘 운영 시간 : ", storeInfo.currentOperationTime);
    //console.log("브레이크 타임 : ", storeInfo.operationTime.breakTime);

    return(
        <div className={styles.storeDetail}>
            <div><Banner/>
                <div><Profile storeNo={storeNo}/></div>
            </div>
            <div className={styles.nameAndReserve}>
                <p id={styles.storeName}>{storeInfo.storeName}</p>
                <div id={styles.reserve} onClick={reservationHandler}>예약하기</div>
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
            <Menu/>
            {/* <div id={styles.mapArea}><KakaoMap/></div> */}
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