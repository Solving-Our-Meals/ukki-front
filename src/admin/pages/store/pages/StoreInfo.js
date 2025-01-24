import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../css/StoreInfo.module.css';
import '../css/reset.css';
import triangleBtn from '../css/images/inverted_triangle.png';
import Banner from '../components/Banner';
import Profile from '../components/Profile';
import Menu from '../components/Menu';
import AdminAgreementModal from '../../../components/AdminAgreementModal';
import AdminResultModal from '../../../components/AdminResultModal';
import { API_BASE_URL } from '../../../../config/api.config';

function StoreInfo() {
    const { storeNo } = useParams();
    const navigate = useNavigate();
    const [isNone, setIsNone] = useState(true);
    const [currentDay, setCurrentDay] = useState('');
    const [categoryName, setCategoryName] = useState('');
       
    const [storeInfo, setStoreInfo] = useState({
        storeNo: 0,
        storeName: "가게 이름",
        storeDes: "가게 소개글",
        storeAddress: "가게 주소",
        storeCategoryNo: 0,
        storeCategory: {},
        storeKeyword: [],
        operationTime: ""
    });
    const [showAgreementModal, setShowAgreementModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessage , setResultMessage] = useState('');
    const [agreeMessage , setAgreeMessage] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(
        () => {
            fetch(`${API_BASE_URL}/admin/stores/info/${storeNo}`)
            .then(res => res.json())
            .then(data => {
                setStoreInfo(data)
                // 카테고리 이름 설정
                const matchingCategory = data.storeCategory.find(
                    category => category.categoryNo === data.storeCategoryNo
                );
                if (matchingCategory) {
                    setCategoryName(matchingCategory.categoryName);
                }
                console.log("가게 정보 :",data)
            })
            .catch(error => console.log(error))
            .finally(() => {
                setLoading(false);
            });
        }, [storeNo]
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

        if(storeInfo.operationTime.breakTime === null){
            storeInfo.operationTime.breakTime = '없음';
        }
    }, [storeInfo.operationTime]);

    useEffect(() => {
        const date = new Date();
        const day = date.getDay();
        const dayMap = {
            0: 'sunday',
            1: 'monday',
            2: 'tuesday',
            3: 'wednesday',
            4: 'thursday',
            5: 'friday',
            6: 'saturday'
        };
        setCurrentDay(dayMap[day]);
    }, []);

    const onClickHandler = (e) => {
        setIsNone(prevState => !prevState);
    } 

    function deleteHandler(){
        setShowAgreementModal(true);
        setAgreeMessage('정말로 삭제하시겠습니까?');
    }

    // 삭제 확인 모달 표시
    function deleteConfirm(){
        fetch(`/admin/stores/info/${storeNo}/delete`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
                setShowResultModal(true);
                setResultMessage('삭제에 성공했습니다.');
        })
        .catch(error => {
            console.log(error)
            setShowResultModal(true);
            setResultMessage('삭제에 실패했습니다.');
        });
        
    }

    if(loading){
        return <div>로딩중...</div>;
    }

    return(
        <div className={styles.storeDetail}>
            <div id={styles.storeInfoText}>가게 상세정보</div>
            <div><Banner storeNo={storeNo} />
                <div><Profile storeNo={storeNo} /></div>
            </div>
            <div className={styles.storeHeader}>
                <p id={styles.storeName}>{storeInfo.storeName}</p>
                <p id={styles.storeCategory}>{categoryName}</p>
            </div>
            <p id={styles.storeDes}>{storeInfo.storeDes}</p>
            <p id={styles.storeAddress}>{storeInfo.storeAddress}</p>
            <p id={styles.operTime} onClick={onClickHandler}>
                {`영업 시간(오늘) : ${storeInfo.currentOperationTime}`}
                <img src={triangleBtn} id={styles.triangle} alt ="영업시간 더보기 버튼"/>
            </p>
            <div id={styles.tatolOperTime} style={{ display: isNone ? "none" : "block" }}>
                {[
                    { day: '월', field: 'monday' },
                    { day: '화', field: 'tuesday' },
                    { day: '수', field: 'wednesday' },
                    { day: '목', field: 'thursday' },
                    { day: '금', field: 'friday' },
                    { day: '토', field: 'saturday' },
                    { day: '일', field: 'sunday' }
                ].map(({ day, field }) => (
                    <div key={day}>
                        <p 
                            className={styles.week}
                            data-current={currentDay === field}
                        >
                            ({day})
                        </p>
                        <p 
                            className={styles.weekOperTime}
                            data-status={storeInfo.operationTime[field]}
                            data-current={currentDay === field}
                        >
                            {storeInfo.operationTime[field]}
                        </p>
                        <br/>
                    </div>
                ))}
                <p id={styles.breakTime}>{`*브레이크 타임 : ${storeInfo.operationTime.breakTime}`}</p>
            </div>
            <Menu storeNo={storeNo} />
            {/* <div id={styles.mapArea}><KakaoMap/></div> */}
            <div className={styles.keywordArea}>
                <div>{storeInfo.storeKeyword.keyword1}</div>
                <div>{storeInfo.storeKeyword.keyword2}</div>
                <div>{storeInfo.storeKeyword.keyword3}</div>
                <div>{storeInfo.storeKeyword.keyword4}</div>
                <div>{storeInfo.storeKeyword.keyword5}</div>
                <div>{storeInfo.storeKeyword.keyword6}</div>
            </div>
            <hr className={styles.hr1}></hr>
            <hr className={styles.hr2}></hr>
            <div id={styles.storeRegistDate}>등록 일자 : {storeInfo.storeRegistDate}</div>
            <div id={styles.posNumber}>기본 예약 가능 인원 : {storeInfo.posNumber}</div>
            <button 
                id={styles.storeInfoEditBtn} 
                onClick={() => navigate(`/admin/stores/info/${storeNo}/edit`)}
            >
                수정
            </button>
            <button id={styles.storeInfoDeleteBtn} onClick={deleteHandler}>삭제</button>
            {showAgreementModal && (
                    <AdminAgreementModal
                        message={agreeMessage}
                        onConfirm={() => {
                            setShowAgreementModal(false);
                            deleteConfirm();
                        }}
                        onCancel={() => setShowAgreementModal(false)}
                    />
                )}
                {showResultModal && (
                    <AdminResultModal 
                        message={resultMessage} 
                        close={() => {
                            setShowResultModal(false);
                            setResultMessage('');
                            navigate(`/admin/stores/list`);
                        }}
                    />
                )}
        </div>
    );
}

export default StoreInfo; 