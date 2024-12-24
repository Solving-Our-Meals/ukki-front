import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../common/header/components/Header";
import FloatingBar from "../../common/floatingBar/components/FloatingBar";
import Footer from "../../common/footer/components/Footer";
import styles from '../layouts/css/userlayout.module.css';

function UserLayout() {
    const [doInquiryModal, setDoInquiryModal] = useState(false);

    return (
        <>
        <div className={!doInquiryModal? styles.layoutStyle : styles.layoutModalStyle}>
            <Header className={styles.header} />
            <main className={styles.main}>
                <Outlet />
            </main>
            <Footer className={styles.footer} />
        </div>
        {doInquiryModal && <div className={styles.overlay}></div>}
        <FloatingBar setDoInquiryModal={setDoInquiryModal} />
        </>
    );
}

export default UserLayout;
