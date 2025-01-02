import { useState, useRef, useEffect } from 'react';
import styles from '../css/createReview.module.css';
import writeArea from '../images/writeReviewArea.png';
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
    const year = new Date().getFullYear();
    const month = new Date().getMonth()+1
    const date = new Date().getDate()
    const today = `${year.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
    
    const fileUploadRef = useRef(null); 

    const [uploadedInfo, setUploadedInfo] = useState(null);
    const previewRef = useRef(null);
    const [imageUrl, setImageUrl] = useState(null);

    const [isDisplay, setIsDisplay] = useState(false);

    const [doWriteReview, setDoWriteReview] = useState(false);
    const [isCompletedReview, setIsCompletedReview] = useState(false);

    const [review, setReview] = useState({
        reviewDate : today,
        reviewContent : "",
        reviewImage : {},
        storeNo : "5",
        userNo : "1"
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
        const size = (file.size / (1024 * 1024)).toFixed(2) + 'mb';
        const updatedInfo = {name, size, type, file, isImage}

        console.log('updatedInfo : ' , updatedInfo);

        if(!isImage){
           setUploadedInfo(updatedInfo); // name, size, type 정보를 uploadedInfo에 저장
            return;
        }
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

    // 파일 업로드 족같네
    const submitHandler = () => {
        const formData = new FormData();
        formData.append('params', JSON.stringify({
            reviewDate: review.reviewDate,
            reviewContent: review.reviewContent,
            storeNo: review.storeNo,
            userNo: review.userNo
        }));
        formData.append('reviewImage', review.reviewImage); // 파일 객체 추가

        fetch('/store/5/review', {
            method: 'POST',
            body: formData,

        })
        .then((res) => {
            if (res.ok) {
                setIsDisplay(false);
                setDoWriteReview(false);
                setIsCompletedReview(true);
                console.log("Review submitted successfully");
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
        setFileInfo(file);
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

    // const getOverlayClass = () => {
    //     if(doWriteReview) return `${styles.overlay} ${styles.zIndex11} ${styles.show}`;
    //     if(isDisplay || isCompletedReview) return `${styles.overlay} ${styles.zIndex10} ${styles.show}`
    //     return styles.overlay;
    // }

    const getOverlayClass = () => { 
        if (doWriteReview) return `${styles.overlay} ${styles.zIndex11} ${styles.show}`; 
        if (isDisplay || isCompletedReview) return `${styles.overlay} ${styles.zIndex10} ${styles.show}`; 
        return styles.overlay; 
    }

    return(
        <>
            <button type='button' id={styles.btnWriteReview} onClick={() => createReviewHandler()}>리뷰 작성하기</button>
            <div className={getOverlayClass()}></div>
            <div className={styles.createReview} style={{display : isDisplay ? "" : "none"}} >
                <div id={styles.strReview}>리뷰하기</div>
                <img src={writeArea} id={styles.writeReviewArea} alt='리뷰 작성란'/>
                <textarea id={styles.inputReview} name='reviewContent' onChange={(e) => onChangeHandler(e)} placeholder='리뷰를 작성하세요.'/>
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
                    {imageUrl ? ( 
                        <img ref={previewRef} src={imageUrl} id={styles.preview} name='addphoto' alt='업로드된 이미지 미리보기'/> 
                    ) : ( 
                    <img ref={previewRef} src={addPhoto} id={styles.addPhoto} name='addphoto' alt='사진 추가하기 버튼'/> )} 
                </div>
                <button type='button' id={styles.cancle} onClick={(e) => cancleHandler(e)}>취소</button>
                <button type='button' id={styles.submit} onClick={() => setDoWriteReview(true)}>확인</button>
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