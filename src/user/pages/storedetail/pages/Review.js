import styles from '../css/review.module.css';

function Review(){

    return(
        <div className={styles.reviewStyle}>
            <div id={styles.strReview}>리뷰</div>
            <div id={styles.strCountReview}>{`총 {...}개의 리뷰가 있습니다.`}</div>
            <button type='button' id={styles.btnWriteReview}>리뷰 작성하기기</button>
        </div>
    );
}

export default Review;