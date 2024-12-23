import { Outlet } from "react-router-dom";
import Header from "../../common/header/components/Header";
import FloatingBar from "../../common/floatingBar/components/FloatingBar";
import Footer from "../../common/footer/components/Footer";
import styles from './css/userlayout.module.css';
import { useEffect } from "react";

function UserLayout() {

    useEffect(() => {
        
    var parentElement = document.getElementById('parent');
    var childElement = document.getElementById('child');
    var childHeight = childElement.clientHeight;

    parentElement.style.height = childHeight + 'px';

    }, []);

    return (
        <div className={styles.wrapper}>
            <Header className={styles.header} />
            <main id="parent" className={styles.contentWrapper}>
                <div id="child">
                    <FloatingBar />
                    <Outlet />
                </div>
            </main>
            <Footer className={styles.footer} />
        </div>
        
    );
}

export default UserLayout;