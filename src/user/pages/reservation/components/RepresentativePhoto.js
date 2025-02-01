import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../css/representativePhoto.module.css';
import { API_BASE_URL } from '../../../../config/api.config';
import { useError } from '../../../../common/error/components/ErrorContext';
import loadingGif from '../../../../common/inquiry/img/loadingInquiryList.gif';
import basicRepPhoto from '../images/basicRepPhoto.png';

function RepresentativePhoto(){

    const navigate = useNavigate();
    const { setGlobalError } = useError()
    const [photo, setPhoto] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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
            .then(response => {
                // if (!response.ok) {
                //     const error = new Error(`HTTP error! status: ${response.status}`);
                //     error.status = response.status;
                //     throw error;
                // }
                return response.text();
            })
            .then(data => {
                const bannerUrl = `${API_BASE_URL}/reservation/api/repPhoto?repPhotoName=${data}`
                setPhoto(bannerUrl);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                // setGlobalError(error.message, error.status);

                // // 네비게이션 처리: 에러 상태에 맞는 페이지로 리디렉션
                // if (error.status === 404) {
                //     navigate('/404');
                // } else if (error.status === 403) {
                //     navigate('/403');
                // } else {
                //     navigate('/500');
                // }
                setIsLoading(false);
            });
        }, [setGlobalError]);

    if(isLoading){
            // 로딩 상태일 때 로딩 화면을 표시
            return(
                <div className={styles.loadingContainer}>
                    <img src={loadingGif} alt='로딩 중' className={styles.loadingImg} />
                    <p>Loading...</p>
                </div>
            )
        }

    return(
        <img
            id={styles.representativePhoto}
            src={photo ? photo : basicRepPhoto}
            alt="대표 배너 사진"
            onError={(e) => e.target.src = basicRepPhoto}  // 이미지 로드 실패 시 기본 이미지로 대체
        />
    );
}

export default RepresentativePhoto;