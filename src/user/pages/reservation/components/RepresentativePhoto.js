import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../css/representativePhoto.module.css';
import { API_BASE_URL } from '../../../../config/api.config';

function RepresentativePhoto(){

    const [photo, setPhoto] = useState(null);

    const location = useLocation();
    const storeInfo = {...location.state};
    const storeNo = storeInfo.storeNo;

    useEffect(
        () => {
            fetch(`${API_BASE_URL}/reservation/repPhoto?storeNo=${storeNo}`,{
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials : "include",
            })
            .then(res => res.text())
            .then(data => {
                const bannerUrl = `${API_BASE_URL}/reservation/api/repPhoto?repPhotoName=${data}`
                setPhoto(bannerUrl);
            })
            .then(error => console.log(error));
        }, []);

    return(
        <img id={styles.representativePhoto} src={photo} alt='대표 배너 사진'/>
    );
}

export default RepresentativePhoto;