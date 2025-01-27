import styles from './css/LoadingPage.module.css';
import loadingImg from './css/images/loadingImg.gif';

function LodingPage(){
    return(
        <>
        <div className={styles.background}></div>
            <div className={styles.loadingPage}>
                <img src={loadingImg} alt="로딩중" className={styles.loadingImg} />
            </div>
        </>
    )
}

export default LodingPage;