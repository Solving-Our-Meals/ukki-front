import { useState } from 'react';
import styles from '../css/createReview.module.css';
import writeArea from '../images/writeReviewArea.png';
import addPhoto from '../images/addPhoto.png';

function CreateReview(){
    const year = new Date().getFullYear();
    const month = new Date().getMonth()+1
    const date = new Date().getDate()
    const today = `${year.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;

    const [isDisplay, setIsDisplay] = useState(false);

    const [review, setReview] = useState({
        reviewDate : today,
        reviewContent : "",
        reviewImage : "",
        storeNo : "",
        userNo : ""
    });

    const onChangeHandler = (e) => {
        setReview({
            ...review,
            [e.target.name] : e.target.value
        });
    }

    const createReviewHandler = () => {
        setIsDisplay(prevState => !prevState);
    }

    const cancleHandler = () => {
        setIsDisplay(prevState => !prevState);
    }

    const submitHandler = () => {
        fetch(`/store/5/review`, {
            method : "POST",
            headers : {
                "Content-Type":"application/json; charset=UTF-8"
            },
            body : JSON.stringify(review),
        })
        .then((res) => {
            if(res.ok){
                alert("생성 완료")
            }
        });
    }


    return(
        <>
            <button type='button' id={styles.btnWriteReview} onClick={() => createReviewHandler()}>리뷰 작성하기</button>
            <div className={styles.createReview} style={{display : isDisplay ? "" : "none"}} >
                <div id={styles.strReview}>리뷰하기</div>
                <img src={writeArea} id={styles.writeReviewArea} alt='리뷰 작성란'/>
                <textarea id={styles.inputReview} name='reviewContent' onChange={(e) => onChangeHandler(e)} placeholder='리뷰를 작성하세요.'/>
                <img src={addPhoto} id={styles.addPhoto} name='reviewImage' onChange={(e) => onChangeHandler(e)} alt='사진 추가하기 버튼' />
                <button type='button' id={styles.cancle} onClick={() => cancleHandler()}>취소</button>
                <button type='submit' id={styles.submit} onClick={() => submitHandler()}>확인</button>
            </div>
        </>
        
    );
}

export default CreateReview;