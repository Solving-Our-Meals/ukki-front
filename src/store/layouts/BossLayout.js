import { Outlet } from "react-router-dom";
import Header from "../../common/header/components/Header";
import FloatingBar from "../../common/floatingBar/components/FloatingBar";
import styles from './css/bosslayout.module.css';

function BossLayout(){

    return(
        <>
        <div className={styles.layoutStyle}>
            <Header className={styles.header} />
            <Outlet />
        </div>
        <FloatingBar/>
        </>
    );
}
export default BossLayout;