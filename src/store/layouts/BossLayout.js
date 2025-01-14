import { Outlet } from "react-router-dom";
import Header from "../../common/header/components/Header";
import FloatingBar from "../../common/floatingBar/components/FloatingBar";
// import Footer from "../../common/footer/components/Footer";
import styles from './css/bosslayout.module.css';

function BossLayout(){

    return(
        <>
        <div className={styles.layoutStyle}>
            <Header className={styles.header} />
            <Outlet />
            {/* <Footer className={styles.footer} /> */}
        </div>
        <FloatingBar/>
        </>
    );
}
export default BossLayout;