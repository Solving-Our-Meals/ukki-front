import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../css/StoreEdit.module.css';
import '../css/reset.css';
import { GetProfileAPI } from '../api/GetProfileAPI';
import { GetMenuAPI } from '../api/GetMenuAPI';
import { GetBannerAPI } from '../api/GetBannerAPI';
import triangleBtn from '../css/images/inverted_triangle.png';
import xBtn from '../css/images/xBtn.png';
import plusBtn from '../css/images/plusBtn.png';
import { AddrToCoordinate } from '../api/AddrToCoordinate';

function StoreEdit() {
    const { storeNo } = useParams();
    const navigate = useNavigate();
    const [colorMonday, setColorMonday] = useState("");
    const [colorTuesday, setColorTuesday] = useState("");
    const [colorWednesday, setColorWednesday] = useState("");
    const [colorThursday, setColorThursday] = useState("");
    const [colorFriday, setColorFriday] = useState("");
    const [colorSaturday, setColorSaturday] = useState("");
    const [colorSunday, setColorSunday] = useState("");
    const [isNone, setIsNone] = useState(true);
    const [menuImage, setMenuImage] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [bannerImages, setBannerImages] = useState(Array(5).fill(''));

    console.log(AddrToCoordinate("경기도 안산시 상록구 중앙대로 1634 안산시청"));

    useEffect(() => {
    const loadImages = async () => {
        const menuUrl = await GetMenuAPI(storeNo);
        const profileUrl = await GetProfileAPI(storeNo);
        const images = await GetBannerAPI(storeNo);

        setBannerImages(images);
        setMenuImage(menuUrl);
        setProfileImage(profileUrl);

        // loadImages();
    };
    
    loadImages();
}, [storeNo]);
       
    const [storeInfo, setStoreInfo] = useState({
        storeNo: 0,
        storeName: "가게 이름",
        storeDes: "가게 소개글",
        storeAddress: "가게 주소",
        storeKeyword: [],
        operation: [],
        operationTime: ""
    });

    useEffect(
        () => {
            fetch(`/admin/stores/info/${storeNo}`)
            .then(res => res.json())
            .then(data => {
                setStoreInfo(data)
                console.log("가게 정보 :",data)
            })
            .catch(error => console.log(error));
        }, []
    );

    useEffect(() => {
        GetProfileAPI(storeNo);
        GetMenuAPI(storeNo);
        GetBannerAPI(storeNo);
    }, []);

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
    console.log("브레이크 타임 : ", storeInfo.operationTime.breakTime);


    const handleInputChange = (e) => {
        const { id, value } = e.target;
        const fieldName = id.replace(styles.storeName, 'storeName')
        .replace(styles.storeDes, 'storeDes')
        .replace(styles.storeAddress, 'storeAddress')
        .replace(styles.posNumberInput, 'posNumber');

        setStoreInfo(prev => ({
        ...prev,
        [fieldName]: value
        }));
    };

    const handleInputOperTime = (day, value) => {
        setStoreInfo(prev => ({
            ...prev,
            operationTime: {
                ...prev.operationTime,
                [day]: value
            }
        }));
    };

    const handleInputKeyword = (keywordNumber, value) => {
        setStoreInfo(prev => ({
            ...prev,
            storeKeyword: {
                ...prev.storeKeyword,
                [`keyword${keywordNumber}`]: value
            }
        }));
    };

    const handleBannerUpload = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newBannerImages = [...bannerImages];
                newBannerImages[index] = reader.result;
                setBannerImages(newBannerImages);
            };
            reader.readAsDataURL(file);
        }
    };

    // handleDeleteBanner 함수 추가
    const handleDeleteBanner = (index) => {
        const newBannerImages = [...bannerImages];
        newBannerImages[index] = '';
        setBannerImages(newBannerImages);
    };

    const handleMenuUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMenuImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 프로필 이미지 핸들러
    const handleProfileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 삭제 핸들러
    const handleMenuDelete = () => setMenuImage('');
    const handleProfileDelete = () => setProfileImage('');
    
    return(
        <div className={styles.storeEdit}>
            <div id={styles.storeEditText}>가게 수정</div>
            
            <div className={styles.bannerArea}>
                {[0, 1, 2, 3, 4].map((index) => (
                    <div key={index} className={styles.bannerUploadBox}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleBannerUpload(e, index)}
                            style={{display: 'none'}}
                            id={`banner-upload-${index}`}
                        />
                        <label htmlFor={`banner-upload-${index}`}>
                        {bannerImages[index] ? (
                    <>
                        <img src={bannerImages[index]} alt={`배너 ${index + 1}`}/>
                        <button 
                            className={styles.deleteButton}
                            onClick={(e) => {
                                e.preventDefault(); // label 클릭 이벤트 방지
                                handleDeleteBanner(index);
                            }}
                        >
                            <img src={xBtn} alt="삭제"/>
                        </button>
                    </>
                ) : (
                    <img src={plusBtn} alt="업로드" className={styles.plusButton}/>
                )}
                        </label>
                    </div>
                ))}
            </div>
            
            <div className={styles.menuUploadBox}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleMenuUpload}
                    style={{display: 'none'}}
                    id="menu-upload"
                />
                <label htmlFor="menu-upload" className={styles.uploadLabel}>
                    {menuImage ? (
                        <>
                            <img src={menuImage} alt="메뉴" className={styles.uploadImage}/>
                            <button 
                                className={styles.deleteButton}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleMenuDelete();
                                }}
                            >
                                <img src={xBtn} alt="삭제"/>
                            </button>
                        </>
                    ) : (
                        <>
                        <p>메뉴 업로드</p>
                        <img src={plusBtn} alt="메뉴 업로드" className={styles.plusButton}/>
                        </>
                    )}
                </label>
            </div>

            <div className={styles.profileUploadBox}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileUpload}
                    style={{display: 'none'}}
                    id="profile-upload"
                />
                <label htmlFor="profile-upload" className={styles.uploadLabel}>
                    {profileImage ? (
                        <>
                            <img src={profileImage} alt="프로필" className={styles.uploadImage}/>
                            <button 
                                className={styles.deleteButton}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleProfileDelete();
                                }}
                            >
                                <img src={xBtn} alt="삭제"/>
                            </button>
                        </>
                    ) : (
                        <>
                        <p>프로필 업로드</p>
                        <img src={plusBtn} alt="프로필 업로드" className={styles.plusButton}/>
                        </>
                    )}
                </label>
            </div>
            
            <input type='text' id={styles.storeName} value={storeInfo.storeName} onChange={handleInputChange}/>
            <input type='text' id={styles.storeDes} value={storeInfo.storeDes} onChange={handleInputChange}/>
            <input type='text' id={styles.storeAddress} value={storeInfo.storeAddress} onChange={handleInputChange}/>
            <p id={styles.operTime} onClick={onClickHandler}>
                영업 시간 설정
                <img src={triangleBtn} id={styles.triangle} alt ="영업시간 설정 버튼"/>
            </p>
            <div id={styles.tatolOperTime} style={{ display : isNone ? "none" : "block" }}>
                <p className={styles.week}>(월)</p>&ensp;
                <input type="text" 
                    className={styles.weekOperTime} 
                    style={{ color: colorMonday }} 
                    value={storeInfo.operationTime.monday || ''}
                    onChange={(e) => handleInputOperTime('monday', e.target.value)} placeholder='00:00~00:00'/>
                <br/>
                <p className={styles.week}>(화)</p>&ensp;
                <input type="text" 
                    className={styles.weekOperTime} 
                    style={{ color: colorTuesday }} 
                    value={storeInfo.operationTime.tuesday || ''}
                    onChange={(e) => handleInputOperTime('tuesday', e.target.value)} placeholder='00:00~00:00'/>
                <br/>
                <p className={styles.week}>(수)</p>&ensp;
                <input type="text" 
                    className={styles.weekOperTime} 
                    style={{ color: colorWednesday }} 
                    value={storeInfo.operationTime.wednesday || ''}
                    onChange={(e) => handleInputOperTime('wednesday', e.target.value)} placeholder='00:00~00:00'/>
                <br/>
                <p className={styles.week}>(목)</p>&ensp;
                <input type="text" 
                    className={styles.weekOperTime} 
                    style={{ color: colorThursday }} 
                    value={storeInfo.operationTime.thursday || ''}
                    onChange={(e) => handleInputOperTime('thursday', e.target.value)} placeholder='00:00~00:00'/>
                <br/>
                <p className={styles.week}>(금)</p>&ensp;
                <input type="text" 
                    className={styles.weekOperTime} 
                    style={{ color: colorFriday }} 
                    value={storeInfo.operationTime.friday || ''}
                    onChange={(e) => handleInputOperTime('friday', e.target.value)} placeholder='00:00~00:00'/>
                <br/>
                <p className={styles.week}>(토)</p>&ensp;
                <input type="text" 
                    className={styles.weekOperTime} 
                    style={{ color: colorSaturday }} 
                    value={storeInfo.operationTime.saturday || ''}
                    onChange={(e) => handleInputOperTime('saturday', e.target.value)} placeholder='00:00~00:00'/>
                <br/>
                <p className={styles.week}>(일)</p>&ensp;
                <input type="text" 
                    className={styles.weekOperTime} 
                    style={{ color: colorSunday }} 
                    value={storeInfo.operationTime.sunday || ''}
                    onChange={(e) => handleInputOperTime('sunday', e.target.value)} placeholder='00:00~00:00'/>
                <br/>
                <p id={styles.breakTime}>브레이크 타임 </p> &ensp;
                <input type="text" 
                    className={styles.weekOperTime} 
                    style={{ color: colorMonday }} 
                    value={storeInfo.operationTime.breakTime || ''}
                    onChange={(e) => handleInputOperTime('breakTime', e.target.value)} placeholder='00:00~00:00'/>
                <br/>
            </div>
            <div className={styles.keywordArea}>
    <div>
        <input 
            type="text"
            className={styles.keywordInput}
            value={storeInfo.storeKeyword.keyword1 || ''}
            onChange={(e) => handleInputKeyword(1, e.target.value)}
            placeholder="키워드 1"
        />
    </div>
    <div>
        <input 
            type="text"
            className={styles.keywordInput}
            value={storeInfo.storeKeyword.keyword2 || ''}
            onChange={(e) => handleInputKeyword(2, e.target.value)}
            placeholder="키워드 2"
        />
    </div>
    <div>
        <input 
            type="text"
            className={styles.keywordInput}
            value={storeInfo.storeKeyword.keyword3 || ''}
            onChange={(e) => handleInputKeyword(3, e.target.value)}
            placeholder="키워드 3"
        />
    </div>
    <div>
        <input 
            type="text"
            className={styles.keywordInput}
            value={storeInfo.storeKeyword.keyword4 || ''}
            onChange={(e) => handleInputKeyword(4, e.target.value)}
            placeholder="키워드 4"
        />
    </div>
    <div>
        <input 
            type="text"
            className={styles.keywordInput}
            value={storeInfo.storeKeyword.keyword5 || ''}
            onChange={(e) => handleInputKeyword(5, e.target.value)}
            placeholder="키워드 5"
        />
    </div>
    <div>
        <input 
            type="text"
            className={styles.keywordInput}
            value={storeInfo.storeKeyword.keyword6 || ''}
            onChange={(e) => handleInputKeyword(6, e.target.value)}
            placeholder="키워드 6"
        />
    </div>
</div>
            <hr className={styles.hr1}></hr>
            <hr className={styles.hr2}></hr>
            <div id={styles.storeRegistDate}>등록 일자 : {storeInfo.storeRegistDate}</div>
            <div id={styles.posNumber}>기본 예약 가능 인원 :     
                <input 
                    type="number"
                    id={styles.posNumberInput}
                    value={storeInfo.posNumber || ''}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="예약 가능 인원"
                />
            </div>
            <button id={styles.storeEditCancleBtn} onClick={() => navigate(`/admin/stores/info/${storeNo}`)}>
                    취소
                </button>
                <button id={styles.storeEditOkBtn}>
                    확인
                </button>
        </div>
    );
}

export default StoreEdit; 