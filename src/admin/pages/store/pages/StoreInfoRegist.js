import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/reset.css';
import styles from '../css/StoreEdit.module.css';
import triangleBtn from '../css/images/inverted_triangle.png';
import xBtn from '../css/images/xBtn.png';
import plusBtn from '../css/images/plusBtn.png';
import { AddrToCoordinate } from '../api/AddrToCoordinate';
import AdminAgreementModal from '../../../components/AdminAgreementModal';
import AdminResultModal from '../../../components/AdminResultModal';

function StoreInfoRegist() {
    const { storeNo } = useParams();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
    const [storeInfo, setStoreInfo] = useState({
        storeNo: 0,
        storeName: "",
        storeDes: "",
        storeAddress: "",
        storeKeyword: {},
        latitude: 0,
        longitude: 0,
        operationTime: "",
        storeCategoryNo: 0,
        storeRegistDate : '',
        posNumber : 0
    });
    const [isAddressChanged, setIsAddressChanged] = useState(false);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [coordError, setCoordError] = useState('');
    const [isNone, setIsNone] = useState(true);
    const [menuImage, setMenuImage] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [bannerImages, setBannerImages] = useState(Array(5).fill(''));
    const [showAgreementModal, setShowAgreementModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessage , setResultMessage] = useState('');
    const [agreeMessage , setAgreeMessage] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const response = await fetch(`/admin/stores/regist/store`);
                const data = await response.json();
                console.log(data);
                setUserInfo({
                    userId : data.userDTO.userId,
                    userPassword : data.userDTO.userPassword,
                    userName : data.userDTO.userName,
                    email : data.userDTO.email
                });
                setCategories(data.categoryDTO);
            } catch (error) {
                setResultMessage('데이터 로딩 중 오류가 발생했습니다.');
                setShowResultModal(true);
            }finally{
                setLoading(false);
            }
        };

        fetchStoreData();
    }, [storeNo]);

    const handleInputChange = useCallback((e) => {
        const { id, value } = e.target;
        const fieldName = id.replace(styles.storeName, 'storeName')
            .replace(styles.storeDes, 'storeDes')
            .replace(styles.storeAddress, 'storeAddress')
            .replace(styles.posNumberInput, 'posNumber')
            .replace(styles.categorySelect, 'storeCategoryNo');

        console.log(fieldName);
        console.log(value);

        setStoreInfo(prev => ({
            ...prev,
            [fieldName]: value
        }));

        if (fieldName === 'storeAddress') {
            setIsAddressChanged(true);
            setCoordError(''); // 에러 메시지 초기화
        }
    }, []);

    const handleInputOperTime = useCallback((day, value) => {
        setStoreInfo(prev => ({
            ...prev,
            operationTime: {
                ...prev.operationTime,
                [day]: value
            }
        }));
    }, []);

    const handleInputKeyword = useCallback((keywordNumber, value) => {
        setStoreInfo(prev => ({
            ...prev,
            storeKeyword: {
                ...prev.storeKeyword,
                [`keyword${keywordNumber}`]: value
            }
        }));
    }, []);

    const handleBannerUpload = useCallback((e, index) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerImages(prev => {
                    const newBannerImages = [...prev];
                    newBannerImages[index] = reader.result;
                    return newBannerImages;
                });
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleDeleteBanner = useCallback((index) => {
        setBannerImages(prev => {
            const newBannerImages = [...prev];
            for (let i = index; i < newBannerImages.length - 1; i++) {
                newBannerImages[i] = newBannerImages[i + 1];
            }
            newBannerImages[newBannerImages.length - 1] = '';
            return newBannerImages;
        });
    }, []);

    const handleMenuUpload = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMenuImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleProfileUpload = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }, []);
    
    const onClickHandler = useCallback(() => setIsNone(prev => !prev), []);

    // 주소 변환 핸들러
    const handleAddressConvert = useCallback(async () => {
        try {
            const coordinates = await AddrToCoordinate(storeInfo.storeAddress);
            if (coordinates) {
                const [latitude, longitude] = coordinates;
                setStoreInfo(prev => ({
                    ...prev,
                    latitude,
                    longitude
                }));
                setCoordError('');
            } else {
                setCoordError('주소를 찾을 수 없습니다.');
            }
        } catch (error) {
            setCoordError('좌표 변환에 실패했습니다.');
        }
    }, [storeInfo.storeAddress]);


    // 수정 요청 처리 함수 수정
    const handleSubmit = async () => {
        console.log(userInfo);
        if(storeInfo.storeName ===''){
            setResultMessage('가게 이름은 필수입니다.');
            setShowResultModal(true);
            return;
        }
        if(storeInfo.storeDes === ''){
            setResultMessage('가게 소개글은 필수입니다.');
            setShowResultModal(true);
            return;
        }
        if(storeInfo.storeCategoryNo === ''){
            setResultMessage('카테고리는 필수입니다.');
            setShowResultModal(true);
            return;
        }
        if(bannerImages.every(image => image === '')){
            setResultMessage('배너 이미지는 최소 1개 이상 있어야합니다.');
            setShowResultModal(true);
            return;
        }
        if(menuImage === ''){
            setResultMessage('메뉴 이미지는 필수입니다.');
            setShowResultModal(true);
            return;
        }
        if(profileImage === ''){
            setResultMessage('프로필 이미지는 필수입니다.');
            setShowResultModal(true);
            return;
        }
        console.log(storeInfo.storeKeyword);
        console.log(Object.values(storeInfo.storeKeyword));
        if(Object.values(storeInfo.storeKeyword).every(keyword => keyword === '')){
            setResultMessage('키워드는 필수입니다.');
            setShowResultModal(true);
            return;
        }
        if(storeInfo.storeAddress === ''){
            setResultMessage('주소를 입력해주세요.');
            setShowResultModal(true);
            return;
        }else if(storeInfo.latitude === 0 || storeInfo.longitude === 0){
            setResultMessage('좌표를 변환해주세요.');
            setShowResultModal(true);
            return;
        }
        if(Object.values(storeInfo.operationTime).every(time => time === '')){
            setResultMessage('영업 시간은 필수입니다.');
            setShowResultModal(true);
            return;
        }
        if(storeInfo.posNumber === ''){
            setResultMessage('기본 예약 가능 인원은 필수입니다.');
            setShowResultModal(true);
            return;
        }
        
        setAgreeMessage('등록하시겠습니까?');
        setShowAgreementModal(true);
    };

    const registConfirm = async () => {
        try {
            const formData = new FormData();

            formData.append('storeData', JSON.stringify(storeInfo));
            formData.append('userData', JSON.stringify(userInfo));
            console.log(bannerImages);
            bannerImages.forEach(async (value, index) => {
                if (value) { // value가 유효한 경우에만 처리
                    const imageBlob = await fetch(value).then(r => {
                        if (!r.ok) {
                            throw new Error('이미지 로드 실패');
                        }
                        return r.blob();
                    });
                    formData.append(`banner${index}`, imageBlob); // 인덱스를 사용하여 키를 정의
                }
            });
                const menuBlob = await fetch(menuImage).then(r => r.blob());
                formData.append('menu', menuBlob);
            
            
            const profileBlob = await fetch(profileImage).then(r => r.blob());
            formData.append('profile', profileBlob);
            

            const response = await fetch(`/admin/stores/regist/store`, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                const errorMessage = await response.text(); // 오류 메시지 가져오기
                console.log(errorMessage);
                setResultMessage("등록 중 오류가 발생했습니다."); // 오류 메시지 상태 업데이트
                setShowResultModal(true);
                return; // 함수 종료
            }

            setResultMessage('성공적으로 등록되었습니다.');
            setShowResultModal(true);
            navigate(`/admin/stores/list`);

        } catch (error) {
            console.log(error);
            setResultMessage('등록 중 오류가 발생했습니다.');
            setShowResultModal(true);
        }
    };

    const handleCancel = async () => {
        try {
            const response = await fetch('/cancel/user-registration', {
                method: 'POST',
            });
            if (response.ok) {
                navigate(`/admin/stores/regist/user`);
            }
        } catch (error) {
            navigate(`/admin/stores/regist/user`);
        }
    };

    if(loading){
        return <div>로딩중...</div>;
    }
    return(
        <div className={styles.storeEdit}>
            <div id={styles.storeEditText}>가게 등록</div>
            
                <input 
                    type='text' 
                    id={styles.storeName} 
                    value={storeInfo.storeName} 
                    onChange={handleInputChange}
                    placeholder='가게 이름'
                    className={styles.inputField}
                />
                <select 
                    id={styles.categorySelect}
                    value={storeInfo.storeCategoryNo} 
                    onChange={handleInputChange}
                >
                    {categories.map(category => (
                        <option key={category.categoryNo} value={category.categoryNo}>
                            {category.categoryName}
                        </option>
                    ))}
                </select>
            
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
                        onChange={(e)=>handleMenuUpload(e)}
                        style={{display: 'none'}}
                        id="menu-Regist-upload"
                />
                <label htmlFor="menu-Regist-upload" className={styles.uploadLabel}>
                {menuImage ? (
                    <img src={menuImage} alt="메뉴" className={styles.uploadImage}/>
                ) : (
                    <img src={plusBtn} alt="업로드" className={styles.plusButton}/>
                )}
                </label>
            </div>

            <div className={styles.profileUploadBox}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e)=>handleProfileUpload(e)}
                    style={{display: 'none'}}
                    id="profile-Regist-upload"
                />
                <label htmlFor="profile-Regist-upload" className={styles.uploadLabel}>
                {profileImage ? (
                    <img src={profileImage} alt="프로필" className={styles.uploadImage}/>
                ) : (
                    <img src={plusBtn} alt="업로드" className={styles.plusButton}/>
                )}
                </label>
            </div>
            
            <input type='text' id={styles.storeDes} value={storeInfo.storeDes} onChange={handleInputChange} placeholder='가게 소개글'/>
            <input type='text' id={styles.storeAddress} value={storeInfo.storeAddress} onChange={handleInputChange} placeholder='가게 주소'/>
            <button 
                className={`${styles.addressConvertBtn} ${isAddressChanged ? styles.active : ''}`}
                onClick={handleAddressConvert}
            >
                좌표 변환
            </button>
            {coordError && (
                <div className={`${styles.coordinateError} ${coordError ? styles.visible : ''}`}>
                    {coordError}
                </div>
            )}
            <div className={styles.storeCoordinate}>
                <p>위도 : {storeInfo.latitude}</p>
                <p>경도 : {storeInfo.longitude}</p>
            </div>
            <p id={styles.operTime} onClick={onClickHandler}>
                영업 시간 설정
                <img src={triangleBtn} id={styles.triangle} alt ="영업시간 설정 버튼"/>
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
                        <p className={styles.week}>({day})</p>
                        <input 
                            type="text"
                            className={styles.weekOperTime}
                            value={storeInfo.operationTime[field] || ''}
                            onChange={(e) => handleInputOperTime(field, e.target.value)}
                            data-status={storeInfo.operationTime[field]}
                            placeholder='00:00~00:00'
                        />
                        <br/>
                    </div>
                ))}
                <p className={styles.breakTime}>*브레이크 타임*</p>
                <input 
                    type="text"
                    className={styles.weekOperTime}
                    value={storeInfo.operationTime.breakTime || ''}
                    onChange={(e) => handleInputOperTime('breakTime', e.target.value)}
                    placeholder='00:00~00:00'
                />
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
            <div id={styles.storeRegistDate}>등록 일자 : {today}</div>
            <div id={styles.posNumber}>기본 예약 가능 인원 :     
                <input 
                    type="number"
                    id={styles.posNumberInput}
                    value={storeInfo.posNumber || ''}
                    onChange={handleInputChange}
                    min="0"
                />
            </div>
            <button id={styles.storeEditCancleBtn} onClick={handleCancel}>
                    취소
                </button>
                <button 
                    id={styles.storeEditOkBtn} 
                    onClick={handleSubmit}
                >
                    확인
                </button>

                {showAgreementModal && (
                    <AdminAgreementModal
                        message={agreeMessage}
                        onConfirm={() => {
                            setShowAgreementModal(false);
                            registConfirm();
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
                        }}
                    />
                )}
        </div>
        
    );
}

export default StoreInfoRegist; 