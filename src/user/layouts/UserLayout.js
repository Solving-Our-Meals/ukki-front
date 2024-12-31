
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../common/header/components/Header";
import FloatingBar from "../../common/floatingBar/components/FloatingBar";
import Footer from "../../common/footer/components/Footer";
import styles from './css/userlayout.module.css';
import { useEffect } from "react";

function UserLayout() {
    const [doInquiryModal, setDoInquiryModal] = useState(false);

 useEffect(() => { 
    if (doInquiryModal) {
        document.querySelector('html').style.overflowY = 'hidden';
  } else { 
    document.querySelector('html').style.overflowY = 'auto';
 } },[doInquiryModal]);

    return (
        <>
        <div className={!doInquiryModal? styles.layoutStyle : styles.layoutModalStyle}>
            <Header className={styles.header} />
                <Outlet />
            <Footer className={styles.footer} />
        </div>
        {doInquiryModal && <div className={styles.overlay}></div>}
        <FloatingBar setDoInquiryModal={setDoInquiryModal} />
        </>
    );
}

export default UserLayout;
