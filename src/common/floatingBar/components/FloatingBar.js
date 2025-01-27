import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/floatingbar.module.css';
import floating1 from '../images/floating_home.png';
import floating2 from '../images/floating_top.png';
import floating3 from '../images/floating_inquiry.png';
import floating4 from '../images/floatingBar-logo.png';
import DoInquiry from '../../inquiry/components/DoInquiry';

function FloatingBar({setDoInquiryModal}){

    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [doInquiry, setDoInquiry] = useState(false);

    const onClickEventHandler = () => {
        setIsVisible(!isVisible);
    };

    function handlerEnterUserInquiry(){
        setDoInquiryModal(true)
        setDoInquiry(true)
    }

    function handleHomeClick() {
        navigate('/');
    }

    function handleScrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return(
        <>
        <div className={styles.floatingBarStyle}>
            <div className={styles.floatingMenu} id={styles.first} style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 1s' }} onClick={handleHomeClick}>
                <img src={floating1} alt='홈으로 가기' id={styles.floating_home}/>
            </div>
            <div className={styles.floatingMenu} id={styles.second} style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 1s' }} onClick={handleScrollToTop}>            
                <img src={floating2} alt='맨위로 가기'  id={styles.floating_top}/>
            </div>
            <div className={styles.floatingMenu} id={styles.third} style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 1s' }} onClick={handlerEnterUserInquiry}>
                <img src={floating3} alt='문의하기'  id={styles.floating_inquiry}/>
            </div>
            <div className={styles.floatingMenu} id={styles.fourth} onClick={onClickEventHandler}>
                <img src={floating4} alt='플로팅바 우끼' id={styles.floatingBar_logo}/>
            </div>
        </div>
        {doInquiry && <DoInquiry closeModal={()=>{
            setDoInquiry(false)
            setDoInquiryModal(false)}}/>}
        </>
    );
}

export default FloatingBar;
