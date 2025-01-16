import { Link } from 'react-router-dom';
import styles from '../css/error404.module.css';
import error404Logo from '../images/errorLogo.png';
import notFoundIcon from '../images/NotFoundIcon.png';

function Error404(){

    return(
        <>
            <div className={styles.background}>
                <div className={styles.errorContainer}>
                    <div id={styles.leftArea}>
                        <p>404 Error</p> <br/>
                        <img src={error404Logo}/>
                    </div>
                    <div id={styles.line}></div>
                    <div id={styles.rightArea}>
                        <img src={notFoundIcon}/>
                        <p>웹 페이지를 찾을 수 없습니다.</p>
                        <p>서비스 이용에 불편을 드려 죄송합니다.</p>
                        <p>
                            페이지를 찾을 수 없습니다. <br/>
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

export default Error404;