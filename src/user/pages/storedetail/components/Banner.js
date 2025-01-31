import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // useNavigate 추가
import styles from '../css/banner.module.css';
import { API_BASE_URL } from '../../../../config/api.config';
import { fetchWithErrorHandling } from '../../../../common/error/components/FetchWithErrorHandling';
import { useError } from '../../../../common/error/components/ErrorContext'; // useError 훅 사용

// Store Info를 받아오는 함수
async function fetchStoreInfo(storeNo) {
    return await fetchWithErrorHandling(`${API_BASE_URL}/store/${storeNo}/getInfo`);
}

// Store Banner를 받아오는 함수
async function fetchStoreBanner(storeNo) {
    return await fetchWithErrorHandling(`${API_BASE_URL}/store/${storeNo}/storebanner`);
}

function Banner() {
    const { storeNo } = useParams();
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef(null);
    const { setGlobalError } = useError(); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Store 정보 받아오기
                const storeInfo = await fetchStoreInfo(storeNo);
                const newStoreNo = storeInfo.storeNo;
                
                // Store 배너 받아오기
                const storeBanner = await fetchStoreBanner(newStoreNo);
                const imageUrls = storeBanner.map(filename => `${API_BASE_URL}/store/${newStoreNo}/api/files?filename=${filename}`);
                
                // 이미지 상태 업데이트
                setImages(imageUrls);
            } catch (error) {
                // 에러 발생시 ErrorContext에 에러 메시지 설정
                setGlobalError(error.message, 'fetch_error');
                console.error('데이터를 가져오지 못했습니다:', error);

                // 네비게이션 처리: 에러 상태에 맞는 페이지로 리디렉션
                // if (error.message.includes('404')) {
                //     navigate('/404');
                // } else if (error.message.includes('403')) {
                //     navigate('/403');
                // } else {
                //     navigate('/500');
                // }
            }
        };

        fetchData();
    }, [storeNo, setGlobalError, navigate]); // setGlobalError와 navigate도 의존성에 추가

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 2500); // 2.5초 간격으로 슬라이드 전환

        return () => clearInterval(interval);
    }, [images]);

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    }, [currentIndex]);

    return (
        <div className={styles.bannerStyle}>
            <div className={styles.slider} ref={sliderRef}>
                {images.map((imgSrc, index) => (
                    <div key={index} className={styles.slide}>
                        <img src={imgSrc} alt={`배너 이미지 ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Banner;
