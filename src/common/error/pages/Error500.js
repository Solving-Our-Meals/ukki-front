import { Link } from 'react-router-dom';
import styles from '../css/error500.module.css';
import error500Logo from '../images/errorLogo.png';
import InternalServerErrorIcon from '../images/InternalServerErrorIcon.png';

function Error500(){
return(
        <>
            <div className={styles.background}>
                <div className={styles.errorContainer}>
                    <div id={styles.leftArea}>
                        <p>500 Error</p> <br/>
                        <img src={error500Logo}/>
                    </div>
                    <div id={styles.line}></div>
                    <div id={styles.rightArea}>
                        <img src={InternalServerErrorIcon}/>
                        <p>서버 에러가 발생했습니다.</p>
                        <p>서비스 이용에 불편을 드려 죄송합니다.</p>
                        <p>
                            시스팀 에러로 인해 페이지를 표시할 수 없습니다. <br/>
                            잠시 후 다시 시도해주세요.
                        </p>
                    </div>
                    <div id={styles.btnArea}>
                        <Link to='/'>
                            <button id={styles.toMain}>메인으로</button>
                        </Link>
                        <button onClick={() => window.history.back()}>뒤로가기</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Error500;