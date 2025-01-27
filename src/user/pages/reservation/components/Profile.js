import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../css/profile.module.css';
import { API_BASE_URL } from '../../../../config/api.config';
import { useError } from '../../../../common/error/components/ErrorContext';
import loadingGif from '../../../../common/inquiry/img/loadingInquiryList.gif';

function Profile(){

    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();
    const { setGlobalError } = useError();
    const [isLoading, setIsLoading] = useState(true);

    const location = useLocation();
    const storeInfo = {...location.state};
    const storeNo = storeInfo.storeNo;


    useEffect(
        () => {
            fetch(`${API_BASE_URL}/reservation/profile?storeNo=${storeNo}`,{
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    const error = new Error(`HTTP error! status: ${response.status}`);
                    error.status = response.status;
                    throw error;
                }
                return response.text();
            })
            .then(data => {
                const profileUrl = `${API_BASE_URL}/reservation/api/profile?profileName=${data}`
                setProfile(profileUrl);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setGlobalError(error.message, error.status);

                // 네비게이션 처리: 에러 상태에 맞는 페이지로 리디렉션
                if (error.status === 404) {
                    navigate('/404');
                } else if (error.status === 403) {
                    navigate('/403');
                } else {
                    navigate('/500');
                }
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
        <img id={styles.profile} src={profile} alt='프로필 사진'/>
    );
}

export default Profile;