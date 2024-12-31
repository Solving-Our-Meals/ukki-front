import { useState, useEffect } from 'react';
import styles from '../css/createReview.module.css';
import writeArea from '../images/writeReviewArea.png';
import addPhoto from '../images/addPhoto.png';

function CreateReview(){
    const [cancle, setCancle] = useState(false);

    const cancleHandler = () => {
        setCancle(prevState => !prevState);
    }

    return(
        <div className={styles.createReview} style={{display : cancle ? "none" : ""}} >
            <div id={styles.strReview}>리뷰하기</div>
            <img src={writeArea} id={styles.writeReviewArea} alt='리뷰 작성란'/>
            <textarea id={styles.inputReview} placeholder='리뷰를 작성하세요.'/>
            <img src={addPhoto} id={styles.addPhoto} alt='사진 추가하기 버튼' />
            <div id={styles.cancle} onClick={() => cancleHandler()}>취소</div>
            <div id={styles.confirm}>확인</div>
        </div>
    );
}

export default CreateReview;