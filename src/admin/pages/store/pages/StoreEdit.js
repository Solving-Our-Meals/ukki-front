import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/reset.css';
import styles from '../css/StoreEdit.module.css';
import { GetProfileAPI } from '../api/GetProfileAPI';
import { GetMenuAPI } from '../api/GetMenuAPI';
import { GetBannerAPI } from '../api/GetBannerAPI';
import triangleBtn from '../css/images/inverted_triangle.png';
import xBtn from '../css/images/xBtn.png';
import plusBtn from '../css/images/plusBtn.png';
import { AddrToCoordinate } from '../api/AddrToCoordinate';
import AdminAgreementModal from '../../../components/AdminAgreementModal';
import AdminResultModal from '../../../components/AdminResultModal';

function StoreEdit() {
    const { storeNo } = useParams();
    const navigate = useNavigate();
    const [storeInfo, setStoreInfo] = useState({
        storeNo: 0,
        storeName: "가게 이름",
        storeDes: "가게 소개글",
        storeAddress: "가게 주소",
        storeKeyword: [],
        storeCoordinate: {
            latitude: 0,
            longitude: 0
        },
        operationTime: "",
        storeCategoryNo: 0,
        storeCategory: []
    });
    const [isAddressChanged, setIsAddressChanged] = useState(false);
    const [coordError, setCoordError] = useState('');
    const [isNone, setIsNone] = useState(true);
    const [menuImage, setMenuImage] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [bannerImages, setBannerImages] = useState(Array(5).fill(''));
    const [initialData, setInitialData] = useState(null);
    const [showAgreementModal, setShowAgreementModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessage , setResultMessage] = useState('');
    const [agreeMessage , setAgreeMessage] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const storeResponse = await fetch(`/admin/stores/info/${storeNo}`);
                const storeData = await storeResponse.json();
                
                const [menuUrl, profileUrl, bannerImages] = await Promise.all([
                    GetMenuAPI(storeNo),
                    GetProfileAPI(storeNo),
                    GetBannerAPI(storeNo)
                ]);

                const initialStoreData = {
                    ...storeData,
                    storeCoordinate: {
                        latitude: storeData.latitude,
                        longitude: storeData.longitude
                    },
                    operationTime: {
                        ...storeData.operationTime,
                        breakTime: storeData.operationTime?.breakTime ?? '없음'
                    }
                };

                setInitialData(initialStoreData);
                setStoreInfo(initialStoreData);
                setCategories(storeData.storeCategory);
                setMenuImage(menuUrl);
                setProfileImage(profileUrl);
                setBannerImages(bannerImages);

            } catch (error) {
                console.error('데이터 로딩 중 오류 발생:', error);
            }
        };

        fetchStoreData();
    }, [storeNo]);

    useEffect(() => {
        if (!storeInfo.operationTime) return;

        const date = new Date();
        const day = date.getDay();
        const dayOfWeekMap = {
            0: "sunday",
            1: "monday",
            2: "tuesday",
            3: "wednesday",
            4: "thursday",
            5: "friday",
            6: "saturday"
        };

        const dayOfWeek = dayOfWeekMap[day];
        const currentOperationTime = storeInfo.operationTime[dayOfWeek];

        // 색상 업데이트
        const updateColors = {
            monday: storeInfo.operationTime.monday === "휴무" ? "#FF5D18" : "#323232",
            tuesday: storeInfo.operationTime.tuesday === "휴무" ? "#FF5D18" : "#323232",
            wednesday: storeInfo.operationTime.wednesday === "휴무" ? "#FF5D18" : "#323232",
            thursday: storeInfo.operationTime.thursday === "휴무" ? "#FF5D18" : "#323232",
            friday: storeInfo.operationTime.friday === "휴무" ? "#FF5D18" : "#323232",
            saturday: storeInfo.operationTime.saturday === "휴무" ? "#FF5D18" : "#323232",
            sunday: storeInfo.operationTime.sunday === "휴무" ? "#FF5D18" : "#323232"
        };

        setStoreInfo(prev => ({
            ...prev,
            currentOperationTime
        }));

    }, [storeInfo.operationTime]);

    const handleInputChange = useCallback((e) => {
        const { id, value } = e.target;
        const fieldName = id.replace(styles.storeName, 'storeName')
            .replace(styles.storeDes, 'storeDes')
            .replace(styles.storeAddress, 'storeAddress')
            .replace(styles.posNumberInput, 'posNumber')
            .replace(styles.categorySelect, 'storeCategoryNo');

        setStoreInfo(prev => ({
            ...prev,
            [fieldName]: value
        }));

        // storeAddress가 변경되었을 때 플래그 설정
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
                    storeCoordinate: {
                        latitude,
                        longitude
                    }
                }));
                setIsAddressChanged(false); // 변환 완료 후 버튼 비활성화
                setCoordError('');
            } else {
                setCoordError('주소를 찾을 수 없습니다.');
            }
        } catch (error) {
            setCoordError('좌표 변환에 실패했습니다.');
        }
    }, [storeInfo.storeAddress]);

    useEffect(() => {
        if (storeInfo.operationTime) {
            console.log("요일 별 운영시간 : ", storeInfo.operationTime);
            console.log("오늘 운영 시간 : ", storeInfo.currentOperationTime);
            console.log("브레이크 타임 : ", storeInfo.operationTime.breakTime);
        }
    }, [storeInfo.operationTime, storeInfo.currentOperationTime]);

    // 변경된 데이터만 추출하는 함수
    const getChangedData = useCallback(() => {
        if (!initialData) return null;

        const changes = {};
        
        // 기본 필드 비교
        ['storeName', 'storeDes', 'storeAddress', 'posNumber', 'storeCategoryNo'].forEach(field => {
            if (storeInfo[field] !== initialData[field]) {
                changes[field] = storeInfo[field];
            }
        });

        // 좌표 비교
        if (storeInfo.storeCoordinate.latitude !== initialData.storeCoordinate.latitude ||
            storeInfo.storeCoordinate.longitude !== initialData.storeCoordinate.longitude) {
            changes.storeCoordinate = storeInfo.storeCoordinate;
        }

        // 영업시간 비교
        const operationTimeChanged = JSON.stringify(storeInfo.operationTime) !== JSON.stringify(initialData.operationTime);
        if (operationTimeChanged) {
            changes.operationTime = storeInfo.operationTime;
        }

        // 키워드 비교
        const keywordsChanged = JSON.stringify(storeInfo.storeKeyword) !== JSON.stringify(initialData.storeKeyword);
        if (keywordsChanged) {
            changes.storeKeyword = storeInfo.storeKeyword;
        }

        // 카테고리 번호 비교
        // if (selectedCategory !== initialData.storeCategoryNo) {
        //     changes.storeCategoryNo = selectedCategory;
        // }

        return Object.keys(changes).length > 0 ? changes : null;
    }, [initialData, storeInfo]);

    // 이미지 변경 여부를 확인하는 함수 수정
    const getChangedImages = useCallback(() => {
        const changes = {};
        
        // 현재 배너 이미지들을 모두 전송
        console.log("bannerImages : ", bannerImages);
        const currentBanners = bannerImages.reduce((acc, img, index) => {
            if (img) {
                acc[`banner${index + 1}`] = img.startsWith('data:') ? img : null; // base64는 그대로, 기존 URL은 null로
            }
            return acc;
        }, {});

        changes.bannerStatus = bannerImages;

        changes.bannerImages = currentBanners;

        if (menuImage && menuImage.startsWith('data:')) {
            changes.menuImage = menuImage;
        }

        if (profileImage && profileImage.startsWith('data:')) {
            changes.profileImage = profileImage;
        }

        return changes;  // 항상 changes 객체 반환
    }, [bannerImages, menuImage, profileImage]);

    // 수정 요청 처리 함수 수정
    const handleSubmit = async () => {

        const changedData = getChangedData();
        const changedImages = getChangedImages();

        if (!changedData && !changedImages) {
            setResultMessage('변경된 내용이 없습니다.');
            setShowResultModal(true);
            return;
        }

        setAgreeMessage('수정하시겠습니까?');
        setShowAgreementModal(true);
    };

    // 수정 확인 함수 추가
    const editConfirm = async () => {
        try {
            const changedData = getChangedData();
            const imageData = getChangedImages();
            const formData = new FormData();

            if (changedData) {
                changedData.storeNo = storeNo;
                formData.append('storeData', JSON.stringify(changedData));
            }

            // 배너 이미지 처리
            if (imageData.bannerImages) {
                // 현재 배너 상태 전송
                console.log("imageData.bannerStatus : ", imageData.bannerStatus);
                formData.append('bannerStatus', JSON.stringify(
                    imageData.bannerStatus
                ));

                // 새로운 이미지만 전송
                for (const [key, value] of Object.entries(imageData.bannerImages)) {
                    if (value?.startsWith('data:')) {
                        const imageBlob = await fetch(value).then(r => r.blob());
                        formData.append(key, imageBlob);
                    }
                }
            }
            
            // 메뉴, 프로필 이미지 처리
            if (imageData.menuImage) {
                const menuBlob = await fetch(imageData.menuImage).then(r => r.blob());
                formData.append('menu', menuBlob);
            }
            
            if (imageData.profileImage) {
                const profileBlob = await fetch(imageData.profileImage).then(r => r.blob());
                formData.append('profile', profileBlob);
            }

            const response = await fetch(`/admin/stores/info/${storeNo}/edit`, {
                method: 'PUT',
                body: formData
            });

            if (!response.ok) throw new Error('수정 요청이 실패했습니다.');

            setResultMessage('성공적으로 수정되었습니다.');
            setShowResultModal(true);
        } catch (error) {
            console.error('수정 중 오류 발생:', error);
            setResultMessage('수정 중 오류가 발생했습니다.');
            setShowResultModal(true);
        }
    };

    return(
        <div className={styles.storeEdit}>
            <div id={styles.storeEditText}>가게 수정</div>
            
                <input 
                    type='text' 
                    id={styles.storeName} 
                    value={storeInfo.storeName} 
                    onChange={handleInputChange}
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
                    onChange={handleMenuUpload}
                    style={{display: 'none'}}
                    id="menu-upload"
                />
                <label htmlFor="menu-upload" className={styles.uploadLabel}>
                            <img src={menuImage} alt="메뉴" className={styles.uploadImage}/>
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
                            <img src={profileImage} alt="프로필" className={styles.uploadImage}/>
                </label>
            </div>
            
            <input type='text' id={styles.storeDes} value={storeInfo.storeDes} onChange={handleInputChange}/>
            <input type='text' id={styles.storeAddress} value={storeInfo.storeAddress} onChange={handleInputChange}/>
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
                <p>위도 : {storeInfo.storeCoordinate.latitude}</p>
                <p>경도 : {storeInfo.storeCoordinate.longitude}</p>
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
                            editConfirm();
                        }}
                        onCancel={() => setShowAgreementModal(false)}
                    />
                )}
                {showResultModal && (
                    <AdminResultModal 
                        message={resultMessage} 
                        close={() => {
                            setShowResultModal(false);
                            if (resultMessage === '성공적으로 수정되었습니다.') {
                                navigate(`/admin/stores/info/${storeNo}`);
                            }
                        }}
                    />
                )}
        </div>
        
    );
}

export default StoreEdit; 