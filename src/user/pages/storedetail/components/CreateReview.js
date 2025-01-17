import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import styles from '../css/createReview.module.css';
import addPhoto from '../images/addPhoto.png';

const FileInfo = ({uploadedInfo}) => (
    <ul className={styles.previewInfo}>
        {Object.entries(uploadedInfo).map(([key, value]) => (
            <li key={key}>
                <span className={styles.info_key}>{key}</span>
                <span className={styles.info_value}>{value}</span>
            </li>
        ))}
    </ul>
);

function CreateReview(){
    const { storeNo } = useParams();
    const year = new Date().getFullYear();
    const month = new Date().getMonth()+1
    const date = new Date().getDate()
    const today = `${year.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
    
    const fileUploadRef = useRef(null); 

    const [fileInformation, setFileInformation] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadedInfo, setUploadedInfo] = useState(null);  // 업로드된 파일 정보 상태
    const previewRef = useRef(null);  // 이미지 미리보기 참조
    const [imageUrl, setImageUrl] = useState(null);  // 이미지 URL

    const [isDisplay, setIsDisplay] = useState(false);

    const [doWriteReview, setDoWriteReview] = useState(false);
    const [isCompletedReview, setIsCompletedReview] = useState(false);

    const [review, setReview] = useState({
        reviewDate : today,
        reviewContent : "",
        reviewImage : {},
        reviewScope : "",
        storeNo : "",
        userNo : "",
        resNo : ""
    });

    const onChangeHandler = (e) => {
        setReview({
            ...review,
            [e.target.name] : e.target.value
        });
    }

    useEffect(() => {
        if(uploadedInfo && uploadedInfo.file){
            setReview((prevReview) => ({
                ...prevReview,
                reviewImage : uploadedInfo.file
            }));
        }
    }, [uploadedInfo])

    const createReviewHandler = () => {
        setIsDisplay(prevState => !prevState);
    }

    const cancleHandler = () => {
        setIsDisplay(prevState => !prevState);
        setReview((prevState) => ({
            ...prevState,
            reviewContent : "",
            reviewScope : "",
        }));
        setUploadedInfo(null);
        setImageUrl(null);
        if(previewRef.current){
            previewRef.current.src = addPhoto;
        }
    }

     // 파일 미리보기 기능
     const setFileInfo = (file) => {
        const {type, name} = file;
        const isImage = type.includes('image');
        const isJpgOrPng = type === 'image/jpeg' || type === 'image/png';
        const size = (file.size / (1024 * 1024)).toFixed(2) + 'mb';
        const updatedInfo = {name, size, type, file, isImage}

        if(!isJpgOrPng){
           alert("이미지 파일만 업로드 가능합니다.") // name, size, type 정보를 uploadedInfo에 저장
            return;
        }

        setUploadedInfo(file);
        setUploadedFile(file);
        setImageUrl(URL.createObjectURL(file));
        // FileReader 객체의 readAsDataURL 메소드를 이용하여 인자로 전달받은 file 객체를 base64 형태의 문자열로 변환
        // 변환된 문자열은 img 태그의 src 혹은 다른 html 태그의 background-image url 값으로 사용할 수 있다.
        const reader = new FileReader();
        reader.onload = ({target}) => {
            setImageUrl(target.result);
            setUploadedInfo(updatedInfo);
            setReview((prevReview) => {
                const updatedReview = {
                    ...prevReview,
                    reviewImage : file
                };
                return updatedReview;
            });
        };

        reader.readAsDataURL(file);
    }

    const submitHandler = () => {
        const formData = new FormData();
        formData.append('params', JSON.stringify({
            reviewDate: review.reviewDate || "",
            reviewContent: review.reviewContent || "",
            reviewScope: review.reviewScope || "",
            storeNo: review.storeNo || "",
            userNo: review.userNo || "",
            resNo: review.resNo || "",
        }));

        // 이미지가 있을 때만 formData에 추가
        // if (review.reviewImage && Object.keys(review.reviewImage).length > 0) {
        //     formData.append('reviewImage', review.reviewImage);
        // }

        if(uploadedFile){
            formData.append("reviewImage", uploadedFile);
        }

        fetch(`/store/${storeNo}/review`, {
            method: 'POST',
            body: formData,
        })
        .then((res) => {
            if (res.ok) {
                setIsDisplay(false);
                setDoWriteReview(false);
                setIsCompletedReview(true);
            } else {
                console.error("Failed to submit review", res.statusText);
            }
        })
        .catch(error => console.error("Error:", error));
    };
    

    const completeHandler = () => {
        setIsCompletedReview(false);
        window.location.reload();
    }

    const addFileBtnClickHandler = () => {
        if(!fileUploadRef.current) return;
        fileUploadRef.current.click(); // 숨겨진 file input의 클릭 이벤트를 실행행
    };

    const uploadHandler = ({target}) => {
        const file = target.files[0];
        if(!file) return; // 파일이 없으면 함수 종료
        setFileInfo(file);
        setImageUrl(URL.createObjectURL(file));

        setReview(prevReview => ({
            ...prevReview,
            reviewImage : file.name
        }));
    }

    // 파일 드래그 앤 드롭 
    const [isActive, setIsActive] = useState(false);

    const dragStartHandler = () => {
        setIsActive(true);
    }

    const dragEndHandler = () => {
        setIsActive(false);
    }

    const dropHandler = (e) => {
        e.preventDefault();
        setIsActive(false);

        // 드롭된 파일 핸들링링
        const file = e.dataTransfer.files[0];
       setFileInfo(file);
    }

    const dragOverHandler = (e) => {
        e.preventDefault();
    }

    const getOverlayClass = () => { 
        if (doWriteReview) return `${styles.overlay} ${styles.zIndex11} ${styles.show}`; 
        if (isDisplay || isCompletedReview) return `${styles.overlay} ${styles.zIndex10} ${styles.show}`; 
        return styles.overlay; 
    }

    // 리뷰 작성하기 버튼 활성화 여부
    const [writeReview, setWriteReview] = useState(false);

    // DB에 유저 넘버와 가게 번호 넘기기
    // 예약은 되어 있지만 리뷰를 달지 않은 값들 가져오기
    // 가져온 값에 예약 시간이 적혀야하며 예약 날짜와 시간이 지났지만 1주일 이내일 경우 writeReview를 true로 변경
    const [userInfo, setUserInfo] = useState({});
    const [storeInfo, setStoreInfo] = useState({
        storeNo : 0,
        storeName : "",
    });
    const location = useLocation();

    useEffect(() => {
        if(location.state){
            setStoreInfo(location.state);
            setReview(prevReview => ({
                ...prevReview,
                storeNo : location.state.storeNo.toString()
            }))
        }
    }, [location.state])

    useEffect(
        () => {
            fetch('/user/info')
            .then(res => res.json())
            .then(data => {
                setUserInfo(data);
                //console.log('유저정보', data);
                setReview(prevReview => ({
                    ...prevReview,
                    userNo : data.userNo.toString()
                }))
            })
            .then(error => console.log(error));
        }, []
    );

    //  리뷰 작성하기 버튼 권한 주기
    // useEffect(() => {
    //     if (userInfo.userId && storeInfo.storeNo) {  
    //         fetch(`/store/getreviewlist?userId=${userInfo.userId}&storeNo=${storeInfo.storeNo}`)
    //             .then(res => res.json())
    //             .then(data => {

    //                 function isWithinThreeDays(resDate){
    //                     const reservedDate = new Date(resDate);
    //                     const currentDate = new Date();
    //                     const timeDifference = currentDate - reservedDate;
    //                     const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
    //                     return dayDifference <= 3;
    //                 }
    //                 console.log('예약 리스트 : ', data)
    //                 for(let i = 0; i < data.length; i++){
    //                     // const result = isWithinThreeDays(data[i].resDate);
    //                     const result = isWithinThreeDays('2025-01-10');
    //                     console.log('result : ', result);
    //                     if(result){
    //                         console.log('성공?')
    //                     } else {
    //                         console.log('실패')
    //                     }

    //                 }
    //             })
    //             .catch(error => console.error('error', error));
    //     }
    // }, [userInfo, storeInfo.storeNo]);

    useEffect(() => {
        if (userInfo.userId && storeInfo.storeNo) {  
            fetch(`/store/${storeNo}/getreviewlist?userId=${userInfo.userId}&storeNo=${storeInfo.storeNo}`)
                .then(res => res.json())
                .then(data => {
                    function isWithinThreeDays(resDate) {
                        const reservedDate = new Date(resDate);
                        const currentDate = new Date();
    
                        // 현재 날짜의 시간을 제거하여 비교하기 쉽게 함
                        currentDate.setHours(0, 0, 0, 0);
                        reservedDate.setHours(0, 0, 0, 0);
    
                        const timeDifference = currentDate - reservedDate;
                        const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
    
                        // reservedDate가 현재 날짜와 같거나 3일 이전인지 확인
                        return dayDifference >= 0 && dayDifference <= 3;
                    }
    
                    for (let i = 0; i < data.length; i++) {
                        const result = isWithinThreeDays(data[i].resDate);
                        if (result) {
                            console.log('날짜 성공');
    
                            // 날짜가 오늘인 경우 시간 비교
                            const reservDate = new Date(data[i].resDate);
                            const currentDate = new Date();
                            if(reservDate.toDateString() === currentDate.toDateString()){
    
                                // 현재 시간이 예약 시간보다 지나간 경우 true, 그렇지 않으면 false
                                const [hours, minutes, seconds] = data[i].resDate.split(':').map(Number);
                                const targetDate = new Date();
                                targetDate.setHours(hours, minutes, seconds, 0);
    
                                if(currentDate > targetDate){
                                    console.log('오늘 시간 성공')
                                    // 예약이 노쇼인지의 여부 확인
                                    if(data[i].qrConfirm === 1){
                                        console.log('예약 확인 성공 -> 예약 번호 확인')
                                        setReview(prevReview => ({
                                            ...prevReview,
                                            resNo : data[i].resNo.toString()
                                        }))
                                        fetch(`/store/${storeNo}/checkReviewList?resNo=${data[i].resNo}`)
                                            .then(res => res.json())
                                            .then(data => {
                                                console.log('예약 번호 성공');
                                                console.log('data1', data);
                                                if(data === true ){
                                                    setWriteReview(true);
                                                } 
                                            })
                                            .catch(error => console.log(error));
                                    } 
                                } 
                            } else {
                                console.log('이미 오늘 이전 날짜 : 성공 -> 예약 번호 확인')
                                console.log('reservDate', reservDate.toDateString());
                                // 예약이 노쇼인지의 여부 확인
                                if(data[i].qrConfirm === 1){
                                    console.log('예약 확인 성공 -> 예약 번호 확인')
                                    setReview(prevReview => ({
                                        ...prevReview,
                                        resNo : data[i].resNo.toString()
                                    }))
                                    fetch(`/store/${storeNo}/checkReviewList?resNo=${data[i].resNo}`)
                                        .then(res => res.json())
                                        .then(data => {
                                            console.log('예약 번호 성공');
                                            console.log('data2', data);
                                            if(data === true){
                                                setWriteReview(true);
                                            } 
                                        })
                                        .catch(error => console.log(error));
                                } 
                            }
                        } 
                    }
                })
                .catch(error => console.error('error', error));
        }
    }, [userInfo, storeInfo.storeNo]);

    // useEffect(() => {
    //     if (userInfo.userId && storeInfo.storeNo) {  
    //         fetch(`/store/getreviewlist?userId=${userInfo.userId}&storeNo=${storeInfo.storeNo}`)
    //             .then(res => res.json())
    //             .then(data => {
    //                 function isWithinThreeDays(resDate) {
    //                     const reservedDate = new Date(resDate);
    //                     const currentDate = new Date();
    
    //                     // 현재 날짜의 시간을 제거하여 비교하기 쉽게 함
    //                     currentDate.setHours(0, 0, 0, 0);
    //                     reservedDate.setHours(0, 0, 0, 0);
    
    //                     const timeDifference = currentDate - reservedDate;
    //                     const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
    
    //                     // reservedDate가 현재 날짜와 같거나 3일 이전인지 확인
    //                     return dayDifference >= 0 && dayDifference <= 3;
    //                 }
    
    //                 let shouldWriteReview = false;

    //                 for (let i = 0; i < data.length; i++) {
    //                     const result = isWithinThreeDays(data[i].resDate);
    //                     if (result) {
    //                         console.log('날짜 성공');
    
    //                         // 날짜가 오늘인 경우 시간 비교
    //                         const reservDate = new Date(data[i].resDate);
    //                         const currentDate = new Date();
    //                         if(reservDate.toDateString() === currentDate.toDateString()){
    
    //                             // 현재 시간이 예약 시간보다 지나간 경우 true, 그렇지 않으면 false
    //                             const [hours, minutes, seconds] = data[i].resDate.split(':').map(Number);
    //                             const targetDate = new Date();
    //                             targetDate.setHours(hours, minutes, seconds, 0);
    
    //                             if(currentDate > targetDate){
    //                                 console.log('오늘 시간 성공')
    //                                 // 예약이 노쇼인지의 여부 확인
    //                                 if(data[i].qrConfirm === 1){
    //                                     console.log('예약 확인 성공 -> 예약 번호 확인')
    //                                     fetch(`/store/checkReviewList?resNo=${data[i].resNo}`)
    //                                         .then(res => res.json())
    //                                         .then(data => {
    //                                             console.log('예약 번호 성공');
    //                                             console.log('data1', data);
    //                                             if(data){
    //                                                 shouldWriteReview = true;
    //                                             } else {
    //                                                 setWriteReview(false);
    //                                             }
    //                                         })
    //                                         .catch(error => console.log(error));
    //                                 } else {
    //                                     console.log('예약 확인 실패 -> 노쇼')
    //                                     setWriteReview(false);
    //                                 }
    //                             } else {
    //                                 console.log('오늘 시간 실패')
    //                                 setWriteReview(false);
    //                             }
    //                         } else {
    //                             console.log('이미 오늘 이전 날짜 : 성공 -> 예약 번호 확인')
    //                             console.log('reservDate', reservDate.toDateString());
    //                             // 예약이 노쇼인지의 여부 확인
    //                             if(data[i].qrConfirm === 1){
    //                                 console.log('예약 확인 성공 -> 예약 번호 확인')
    //                                 fetch(`/store/checkReviewList?resNo=${data[i].resNo}`)
    //                                     .then(res => res.json())
    //                                     .then(data => {
    //                                         console.log('예약 번호 성공');
    //                                         console.log('data2', data);
    //                                         if(data){
    //                                             shouldWriteReview = true;
    //                                         } else {
    //                                             setWriteReview(false);
    //                                         }
    //                                     })
    //                                     .catch(error => console.log(error));
    //                             } else {
    //                                 console.log('예약 확인 실패 -> 노쇼')
    //                                 setWriteReview(false);
    //                             }
    //                         }
    //                     } else {
    //                         console.log('날짜 실패');
    //                         setWriteReview(false);
    //                     }
    //                 }
    //                  // 모든 검사가 끝난 후 최종 결과 설정
    //                  if (shouldWriteReview) {
    //                     setWriteReview(true);
    //                 }
    //             })
    //             .catch(error => console.error('error', error));
    //     }
    // }, [userInfo, storeInfo.storeNo]);

//     useEffect(() => {
//     if (userInfo.userId && storeInfo.storeNo) {  
//         fetch(`/store/getreviewlist?userId=${userInfo.userId}&storeNo=${storeInfo.storeNo}`)
//             .then(res => res.json())
//             .then(data => {
//                 function isWithinThreeDays(resDate) {
//                     const reservedDate = new Date(resDate);
//                     const currentDate = new Date();

//                     // 현재 날짜의 시간을 제거하여 비교하기 쉽게 함
//                     currentDate.setHours(0, 0, 0, 0);
//                     reservedDate.setHours(0, 0, 0, 0);

//                     const timeDifference = currentDate - reservedDate;
//                     const dayDifference = timeDifference / (1000 * 60 * 60 * 24);

//                     // reservedDate가 현재 날짜와 같거나 3일 이전인지 확인
//                     return dayDifference >= 0 && dayDifference <= 3;
//                 }

//                 let shouldWriteReview = false; // 추가 변수

//                 for (let i = 0; i < data.length; i++) {
//                     const result = isWithinThreeDays(data[i].resDate);
//                     if (result) {
//                         console.log('날짜 성공');

//                         // 날짜가 오늘인 경우 시간 비교
//                         const reservDate = new Date(data[i].resDate);
//                         const currentDate = new Date();
//                         if(reservDate.toDateString() === currentDate.toDateString()){

//                             // 현재 시간이 예약 시간보다 지나간 경우 true, 그렇지 않으면 false
//                             const [hours, minutes, seconds] = data[i].resDate.split(':').map(Number);
//                             const targetDate = new Date();
//                             targetDate.setHours(hours, minutes, seconds, 0);

//                             if(currentDate > targetDate){
//                                 console.log('오늘 시간 성공')
//                                 // 예약이 노쇼인지의 여부 확인
//                                 if(data[i].qrConfirm === 1){
//                                     console.log('예약 확인 성공 -> 예약 번호 확인')
//                                     fetch(`/store/checkReviewList?resNo=${data[i].resNo}`)
//                                         .then(res => res.json())
//                                         .then(data => {
//                                             console.log('예약 번호 성공');
//                                             console.log('data1', data);
//                                             if(data === true){
//                                                 shouldWriteReview = true;
//                                             }
//                                         })
//                                         .catch(error => console.log(error));
//                                 } else {
//                                     console.log('예약 확인 실패 -> 노쇼')
//                                     setWriteReview(false);
//                                 }
//                             } else {
//                                 console.log('오늘 시간 실패')
//                                 setWriteReview(false);
//                             }
//                         } else {
//                             console.log('이미 오늘 이전 날짜 : 성공 -> 예약 번호 확인')
//                             console.log('reservDate', reservDate.toDateString());
//                             // 예약이 노쇼인지의 여부 확인
//                             if(data[i].qrConfirm === 1){
//                                 console.log('예약 확인 성공 -> 예약 번호 확인')
//                                 fetch(`/store/checkReviewList?resNo=${data[i].resNo}`)
//                                     .then(res => res.json())
//                                     .then(data => {
//                                         console.log('예약 번호 성공');
//                                         console.log('data2', data);
//                                         if(data === true){
//                                             shouldWriteReview = true;
//                                         }
//                                     })
//                                     .catch(error => console.log(error));
//                             } else {
//                                 console.log('예약 확인 실패 -> 노쇼')
//                                 setWriteReview(false);
//                             }
//                         }
//                     } else {
//                         console.log('날짜 실패');
//                         setWriteReview(false);
//                     }
//                 }

//                 // 모든 검사가 끝난 후 최종 결과 설정
//                 if (shouldWriteReview) {
//                     setWriteReview(true);
//                 }
//             })
//             .catch(error => console.error('error', error));
//     }
// }, [userInfo, storeInfo.storeNo]);

    
    console.log('writeReview', writeReview);

    // 버튼 활성화 여부를 확인하는 함수 추가
    const isSubmitDisabled = !review.reviewContent.trim() || !review.reviewScope;

    const removeImageHandler = (e) => {
        e.stopPropagation(); // 이벤트 전달 중단단
        setUploadedFile(null);
        setImageUrl(null);
        if(previewRef.current){
            previewRef.current.src = addPhoto;
        }
    };

    return(
        <>
            <button 
                type='button' 
                id={styles.btnWriteReview} 
                style={{
                    backgroundColor: writeReview ? "" : "#FFC9D4",
                    color: writeReview ? "" : "#999999",
                    cursor: writeReview ? '' : 'not-allowed',
                }} 
                disabled={!writeReview}
                onClick={() => createReviewHandler()}
            >
                리뷰 작성하기
            </button>
            <div className={getOverlayClass()}></div>
            <div className={styles.createReview} style={{display : isDisplay ? "" : "none"}} >
                <div id={styles.strReview}>리뷰하기</div>
                <div className={styles.reviewScope}>
                    <div className={styles.starRatingContainer}>
                        <label className={styles.starLabel}>
                            <input 
                                type="radio" 
                                name="reviewScope" 
                                value="1"
                                onChange={(e) => onChangeHandler(e)}
                                checked={review.reviewScope === "1"}
                                className={styles.starRadio}
                            />
                            <span>1점</span>
                        </label>
                        <label className={styles.starLabel}>
                            <input 
                                type="radio" 
                                name="reviewScope" 
                                value="2"
                                onChange={(e) => onChangeHandler(e)}
                                checked={review.reviewScope === "2"}
                                className={styles.starRadio}
                            />
                            <span>2점</span>
                        </label>
                        <label className={styles.starLabel}>
                            <input 
                                type="radio" 
                                name="reviewScope" 
                                value="3"
                                onChange={(e) => onChangeHandler(e)}
                                checked={review.reviewScope === "3"}
                                className={styles.starRadio}
                            />
                            <span>3점</span>
                        </label>
                        <label className={styles.starLabel}>
                            <input 
                                type="radio" 
                                name="reviewScope" 
                                value="4"
                                onChange={(e) => onChangeHandler(e)}
                                checked={review.reviewScope === "4"}
                                className={styles.starRadio}
                            />
                            <span>4점</span>
                        </label>
                        <label className={styles.starLabel}>
                            <input 
                                type="radio" 
                                name="reviewScope" 
                                value="5"
                                onChange={(e) => onChangeHandler(e)}
                                checked={review.reviewScope === "5"}
                                className={styles.starRadio}
                            />
                            <span>5점</span>
                        </label>
                    </div>
                </div>
                {/* <img src={writeArea} id={styles.writeReviewArea} alt='리뷰 작성란'/> */}
                <div className={styles.writeReviewArea}>
                    <textarea 
                        id={styles.inputReview} 
                        name='reviewContent' 
                        value={review.reviewContent}
                        onChange={(e) => onChangeHandler(e)} 
                        placeholder='리뷰를 작성하세요.'
                    />
                    <div 
                        id={styles.addFile} 
                        onClick={() => addFileBtnClickHandler()}
                        className={`preview${isActive ? ' active ' : ''}`} // isActive 값에 따라 className 제어
                        style={{backgroundColor : isActive ? '#EFEEF3' : ""}}
                        onDragEnter={() => dragStartHandler()} // dragStart 핸들러 추가
                        onDragLeave={() => dragEndHandler()}  // dragEnd 핸들러 추가
                        onDrop={(e) => dropHandler(e)} // drop 핸들러 추가
                        onDragOver={(e) => dragOverHandler(e)}
                    >
                        <input 
                            ref={fileUploadRef}
                            type='file' 
                            accept='.jpg, .png'
                            name='reviewImage' 
                            id={styles.reviewImage}
                            onChange={(e) => uploadHandler(e)}
                        />
                        {imageUrl && (
                            <button 
                                type="button" 
                                className={styles.removeImageBtn} 
                                onClick={(e) => removeImageHandler(e)}
                            >
                                ×
                            </button>
                        )}
                        {imageUrl ? ( 
                            <img ref={previewRef} src={imageUrl} id={styles.preview} name='addphoto' alt='업로드된 이미지 미리보기'/> 
                        ) : ( 
                            <img ref={previewRef} src={addPhoto} id={styles.addPhoto} name='addphoto' alt='사진 추가하기 버튼'/> 
                        )}
                    </div>
                </div>
                <button type='button' id={styles.cancle} onClick={(e) => cancleHandler(e)}>취소</button>
                <button 
                    type='button' 
                    id={styles.submit} 
                    onClick={() => setDoWriteReview(true)}
                    disabled={isSubmitDisabled}
                    style={{
                        backgroundColor: isSubmitDisabled ? '#FFC9D4' : '',
                        color : isSubmitDisabled ? "#999999" : "",
                        cursor: isSubmitDisabled ? 'not-allowed' : 'pointer'
                    }}
                >
                    확인
                </button>
            </div>
            <div id={styles.finalConfirmReview} style={{display : doWriteReview ? "" : "none"}}>
                <p id={styles.reallyWriteReview}>리뷰를 작성하시겠습니까?</p>
                <p id={styles.noticeReview}>작성하신 내용으로 리뷰가 게시됩니다.</p>
                <button type='button' id={styles.cancleWriteReview} onClick={() => setDoWriteReview(false)}>취소</button>
                <button type='submit' id={styles.confirmWriteReview} onClick={() => submitHandler()}>확인</button>
            </div>
            <div id={styles.completeReview} style={{display : isCompletedReview ? "" : "none"}}>
                <p id={styles.completedReviewMessage}>리뷰가 업로드되었습니다.</p>
                <p id={styles.completedReviewNotice}>입력하신 내용으로 리뷰가 작성되었습니다.</p>
                <button type='button' id={styles.completeBtn} onClick={() => completeHandler()}>확인</button>        
            </div>
        </>
        
    );
}

export default CreateReview;