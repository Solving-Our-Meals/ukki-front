import { useState, useEffect, useRef } from 'react';
import styles from '../css/bossBanner.module.css';
function BossBanner({storeNo}) {

    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef(null);

    useEffect(() => {
        fetch(`/store/${storeNo}/getInfo`)
        .then(res => res.json())
        .then(data => {
            const newStoreNo = data.storeNo;

            fetch(`/store/${newStoreNo}/storebanner`)
            .then(res => res.json())
            .then(data => {
                const imageUrls = data.map(filename => `/store/${newStoreNo}/api/files?filename=${filename}`);
                setImages(imageUrls);
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
       
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 2500);  
        return () => clearInterval(interval);
    }, [images]);

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    }, [currentIndex]);
    
    return (
        <>
            <div className={styles.bannerStyle}>
                <div className={styles.slider} ref={sliderRef}>
                    {images.map((imgSrc, index) => (
                        <div key={index} className={styles.slide}>
                            <img src={imgSrc} alt={`배너 이미지 ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default BossBanner;
