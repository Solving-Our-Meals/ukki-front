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
        reviewImage : null,
        storeNo : 5,
        userNo : 1
    });

    const onChangeHandler = (e) => {
        setReview({
            ...review,
            [e.target.name] : e.target.value
        });
    }

    useEffect(() => {
        if(uploadedInfo && uploadedInfo.name){
            setReview((prevReview) => ({
                ...prevReview,
                reviewImage : uploadedInfo.name
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
        const {type} = file;
        const isImage = type.includes('image');
        const size = (file.size / (1024 * 1024)).toFixed(2) + 'mb';
        const fileName = `REVIEW${new Date().getFullYear().toString().slice(2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2,'0')}`;

        const updatedInfo = {name : fileName, size, type}
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
                console.log("updated review with file : " , updatedReview);
                return updatedReview;
            });
        };
        reader.readAsDataURL(file);
    }

    // const submitHandler = () => {
    //     fetch(`/store/5/review`, {
    //         method : "POST",
    //         body : JSON.stringify(review),
    //     })
    //     .then((res) => {
    //         if(res.ok){
    //             setIsDisplay(false);
    //             setDoWriteReview(false);
    //             setIsCompletedReview(true);
    //         }
    //     })
    // }
    

    // const submitHandler = () => {
    //     const formData = new FormData();
    //     formData.append('params', JSON.stringify({
    //         reviewDate: review.reviewDate,
    //         reviewContent: review.reviewContent,
    //         reviewImage : review.reviewImage,
    //         storeNo: review.storeNo,
    //         userNo: review.userNo
    //     }));
    
    //     fetch(`/store/5/review`, {
    //         method: "POST",
    //         body: formData,
    //     })
    //     .then((res) => {
    //         if (res.ok) {
    //             setIsDisplay(false);
    //             setDoWriteReview(false);
    //             setIsCompletedReview(true);
    //             console.log("Review submitted successfully");
    //         } else {
    //             console.error("Failed to submit review", res.statusText);
    //         }
    //     })
    //     .catch(error => console.error("Error:", error));
    // };

    // const submitHandler = () => {
    //     const formData = new FormData();
    //     formData.append('params', JSON.stringify({
    //         reviewDate: review.reviewDate,
    //         reviewContent: review.reviewContent,
    //         storeNo: review.storeNo,
    //         userNo: review.userNo
    //     }));
    //     formData.append('reviewImage', review.reviewImage); // 파일 객체 추가

    //     //formData 내용 확인
    //     for(let pair of formData.entries()){
    //         console.log('SSSSSSSSS',pair[0] + ', ' + pair[1]);
    //     }
    //     // console.log("FormData content : ", formData.get('params'));
    //     // console.log("FormData file : ", formData.get('reviewImage'));
    
    //     fetch(`/store/5/review`, {
    //         method: "POST",
    //         body: formData,
    //     })
    //     .then((res) => {
    //         if (res.ok) {
    //             setIsDisplay(false);
    //             setDoWriteReview(false);
    //             setIsCompletedReview(true);
    //             console.log("Review submitted successfully");
    //         } else {
    //             console.error("Failed to submit review", res.statusText);
    //         }
    //     })
    //     .catch(error => console.error("Error:", error));
    // };
    

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

    return(
        <>
            <button type='button' id={styles.btnWriteReview} onClick={() => createReviewHandler()}>리뷰 작성하기</button>
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
                    {/* uploadedInfo 값 유무에 따른 분기 */}
                    {/* &emsp; */}
                    {/* {uploadedInfo && <FileInfo uploadedInfo={uploadedInfo}/>} */}
                </div>
                <button type='button' id={styles.cancle} onClick={(e) => cancleHandler(e)}>취소</button>
                <button type='button' id={styles.submit} onClick={() => setDoWriteReview(true)}>확인</button>
            </div>
            <div id={styles.finalConfirmReview} style={{display : doWriteReview ? "" : "none"}}>
                <p id={styles.reallyWriteReview}>리뷰를 작성하시겠습니까?</p>
                <p id={styles.noticeReview}>작성하신 내용으로 리뷰가 게시됩니다.</p>
                <button type='button' id={styles.cancleWriteReview} onClick={() => setDoWriteReview(false)}>취소</button>
                {/* <button type='submit' id={styles.confirmWriteReview} onClick={() => submitHandler()}>확인</button> */}
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