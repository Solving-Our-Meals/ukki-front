import { useState, useEffect, useRef } from 'react';
import styles from '../css/banner.module.css';
import { API_BASE_URL } from '../../../../config/api.config';

function Banner({ storeNo }) {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const sliderRef = useRef(null);
    const intervalRef = useRef(null);  // interval을 저장할 ref

    useEffect(() => {
        setIsLoading(true);
        fetch(`${API_BASE_URL}/store/${storeNo}/storebanner`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    fetchImageFromGoogleDrive(data.filter(id => id));
                }
            })
            .catch(error => {
                console.error('배너 데이터 로드 실패:', error);
                setIsLoading(false);
            });

        // 컴포넌트 언마운트 시 interval 정리
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [storeNo]);

    const fetchImageFromGoogleDrive = async (fileIds) => {
        try {
            const imagePromises = fileIds.map(async fileId => {
                const response = await fetch(`${API_BASE_URL}/image?fileId=${fileId}`);
                if (!response.ok) {
                    console.error(`이미지 다운로드 실패 (fileId: ${fileId}):`, response.status);
                    return null;
                }
                const blob = await response.blob();
                return URL.createObjectURL(blob);
            });

            const loadedImages = (await Promise.all(imagePromises)).filter(img => img);
            setImages(loadedImages);
            setIsLoading(false);

            // 이미지 로드 완료 후 슬라이더 시작
            if (loadedImages.length > 1) {
                startSlideShow();
            }
        } catch (error) {
            console.error('이미지 다운로드 실패:', error);
            setIsLoading(false);
        }
    };

    const startSlideShow = () => {
        // 기존 interval 제거
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // 새로운 interval 설정
        intervalRef.current = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 2500);
    };

    useEffect(() => {
        if (sliderRef.current && !isLoading) {
            sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    }, [currentIndex, isLoading]);

    if (isLoading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.bannerStyle}>
            <div className={styles.slider} ref={sliderRef}>
                {images.map((imgSrc, index) => (
                    <div key={index} className={styles.slide}>
                        <img 
                            src={imgSrc} 
                            alt={`배너 이미지 ${index + 1}`}
                            onLoad={() => {
                                if (index === images.length - 1) {
                                    startSlideShow();
                                }
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Banner;
