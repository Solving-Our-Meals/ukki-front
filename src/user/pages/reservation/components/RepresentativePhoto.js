import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../css/representativePhoto.module.css';

function RepresentativePhoto(){

    const [photo, setPhoto] = useState(null);

    const location = useLocation();
    const storeInfo = {...location.state};
    const storeNo = storeInfo.storeNo;

    useEffect(
        () => {
            fetch(`/reservation/${storeNo}/repPhoto`)
            .then(res => res.text())
            .then(data => {
                const bannerUrl = `/reservation/api/repPhoto?repPhotoName=${data}`
                setPhoto(bannerUrl);
            })
            .then(error => console.log(error));
        }, []);

    return(
        <img id={styles.representativePhoto} src={photo} alt='대표 배너 사진'/>
    );
}

export default RepresentativePhoto;