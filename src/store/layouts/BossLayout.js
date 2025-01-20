import { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import Header from "../../common/header/components/Header";
import FloatingBar from "../../common/floatingBar/components/FloatingBar";
import styles from './css/bosslayout.module.css';

function BossLayout(){

    const [storeInfo, setStoreInfo] = useState({});

    useEffect(
        () => {
            fetch('/user/info')
            .then(res => res.json())
            .then(data => {
                fetch(`/boss/mypage/getStoreInfo?userNo=${data.userNo}`)
                .then(res => res.json())
                .then(data => {
                    setStoreInfo(data);
                })
                .catch(error => console.log('가게 정보 호출 에러',error));
            })
            .then(error => console.log(error));
        }, []
    );

    return(
        <>
        <div className={styles.layoutStyle}>
            <Header className={styles.header}/>
            {/* 
                Outlet 컴포넌트 자체는 props를 받지 않음.
                대신, Outlet에 렌더링되는 자식 컴포넌트가 storeNo를 받을 수 있도록 
                React Context를 사용하거나  useLocation을 이용해서 props를 전달해야 한다.
            */}
            <Outlet context={{storeNo : storeInfo.storeNo}}/>
        </div>
        <FloatingBar/>
        </>
    );
}
export default BossLayout;