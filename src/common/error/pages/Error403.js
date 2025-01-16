import { Link } from 'react-router-dom';
import styles from '../css/error403.module.css';
import error403Logo from '../images/errorLogo.png';
import noAccessIcon from '../images/NoAccessIcon.png';

function Error403(){

    return(
        <>
            <div className={styles.background}>
                <div className={styles.errorContainer}>
                    <div id={styles.leftArea}>
                        <p>403 Error</p> <br/>
                        <img src={error403Logo}/>
                    </div>
                    <div id={styles.line}></div>
                    <div id={styles.rightArea}>
                        <img src={noAccessIcon}/>
                        <p>웹 페이지에 대한 권한이 없습니다.</p>
                        <p>서비스 이용에 불편을 드려 죄송합니다.</p>
                        <p>
                            페이지에 대한 접근이 거부되었습니다. <br/>
                            입력하신 페이지의 주소를 다시 한 번 확인해주세요.
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

export default Error403;