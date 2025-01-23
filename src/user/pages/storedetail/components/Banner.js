// import { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import styles from '../css/banner.module.css';
// import { API_BASE_URL } from '../../../../config/api.config';

// function Banner() {

//     const { storeNo } = useParams();
//     const [images, setImages] = useState([]);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const sliderRef = useRef(null);

//     // useEffect(() => {
//     //     fetch(`/store/${storeNo}/getInfo`)
//     //     .then(res => res.json())
//     //     .then(data => {
//     //         const newStoreNo = data.storeNo;

//     //         fetch(`/store/${newStoreNo}/storebanner`)
//     //         .then(res => res.json())
//     //         .then(data => {
//     //             const imageUrls = data.map(filename => `/store/${newStoreNo}/api/files?filename=${filename}`);
//     //             setImages(imageUrls);
//     //         })
//     //         .catch(error => console.log(error));
//     //     })
//     //     .catch(error => console.log(error));
//     //     // fetch(`/store/${storeNo}/storebanner`)
//     //     //     .then(res => res.json())
//     //     //     .then(data => {
//     //     //         const imageUrls = data.map(filename => `/store/${storeNo}/api/files?filename=${filename}`);
//     //     //         setImages(imageUrls);
//     //     //     });
//     // }, []);

//     useEffect(() => {
//         try{
//             const response = await fetch(`${API_BASE_URL}/store/${storeNo}/getInfo`, {
//                 method : "GET",
//                 headers : {
//                     'Accept' : "application/json",
//                     'Content-Type' : 'application/json'
//                 },
//                 credentials : 'include'
//             });
//             if(!response.ok){
//                 throw new Error(`Http error! status: ${response.status}`);
//             }
//             return await response.json();
//         } catch
//     })

//     useEffect(() => {
//         const interval = setInterval(() => {
//             // 나머지 연산자를 이용하여 currentIndex가 마지막 인덱스일 때 0번째 인덱스로 이동하게 한다.
//             setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
//         }, 2500);  // 2.5초 간격으로 슬라이드 전환

//         return () => clearInterval(interval);
//     }, [images]);

//     useEffect(() => {
//         if (sliderRef.current) {
//             // sliderRef.current가 유효할 때 transform을 이용해 요소의 위치, 크키 등을 변경
//             // translateX 함수는 요소를 x축을 따라 이동시킨다.
//             // -${currentIndex * 100}% 는 슬리이더를 왼쪽으로 currentIndex에 따라 100% 단위로 이동시킨다.
//             // 예를 들면 currentIndex가 1이면 슬라이더틑 0%로, 1이면 -100%, 2이면 -200%로 이동
//             // 이는 각 슬라이드가 너비의 100&를 차지한다는 가정하에 실행.
//             sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
//         }
//     }, [currentIndex]);
    
//     return (
//         <>
//             <div className={styles.bannerStyle}>
//                 <div className={styles.slider} ref={sliderRef}>
//                     {images.map((imgSrc, index) => (
//                         <div key={index} className={styles.slide}>
//                             <img src={imgSrc} alt={`배너 이미지 ${index + 1}`} />
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </>
//     );
// }

// export default Banner;

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../css/banner.module.css';
import { API_BASE_URL } from '../../../../config/api.config';

async function fetchStoreInfo(storeNo) {
    const response = await fetch(`${API_BASE_URL}/store/${storeNo}/getInfo`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

async function fetchStoreBanner(storeNo) {
    const response = await fetch(`${API_BASE_URL}/store/${storeNo}/storebanner`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

function Banner() {
    const { storeNo } = useParams();
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storeInfo = await fetchStoreInfo(storeNo);
                const newStoreNo = storeInfo.storeNo;
                
                const storeBanner = await fetchStoreBanner(newStoreNo);
                const imageUrls = storeBanner.map(filename => `${API_BASE_URL}/store/${newStoreNo}/api/files?filename=${filename}`);

                setImages(imageUrls);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [storeNo]);

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

export default Banner;
