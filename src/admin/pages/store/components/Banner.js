import { useState, useEffect, useRef } from 'react';
import styles from '../css/banner.module.css';

// function Banner(){

//     const [images, setImages] = useState([]);

//     // const [banner, setBanner] = useState({
//     //     banner1 : "",
//     //     banner2 : "",
//     //     banner3 : "",
//     //     banner4 : "",
//     //     banner5 : ""
//     // })

//     useEffect(() => {
//         fetch("http://localhost:8080/storebanner/5")
//         .then(res => res.json())
//         .then(data => {
//             setBanner(data);
//         });
//     }, []);

//     console.log("banner Images", images);

//     // const filenames = Object.values(banner).filter(Boolean);


//     return (
//         <>
//             {/* <img src="//I7E-74/ukki_nas/store/5banner1.jpg"/> */}
//             {/* {banner.banner1 && <img src={`http://localhost:8080/api/files?filename=${banner.banner1}`} alt='배너 이미지 1' />} */}
//             <div>
//             {images.map((imgSrc, index) => (
//                 <img key={index} src={imgSrc} alt={`배너 이미지 ${index + 1}`}/>
//             ))}
//             </div>
//         </>
//     );
// }

// export default Banner;

function Banner() {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef(null);

    useEffect(() => {
        fetch("/store/storebanner/5")
            .then(res => res.json())
            .then(data => {
                const imageUrls = data.map(filename => `/store/api/files?filename=${filename}`);
                setImages(imageUrls);
            });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            // 나머지 연산자를 이용하여 currentIndex가 마지막 인덱스일 때 0번째 인덱스로 이동하게 한다.
            setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 2500);  // 2.5초 간격으로 슬라이드 전환

        return () => clearInterval(interval);
    }, [images]);

    useEffect(() => {
        if (sliderRef.current) {
            // sliderRef.current가 유효할 때 transform을 이용해 요소의 위치, 크키 등을 변경
            // translateX 함수는 요소를 x축을 따라 이동시킨다.
            // -${currentIndex * 100}% 는 슬리이더를 왼쪽으로 currentIndex에 따라 100% 단위로 이동시킨다.
            // 예를 들면 currentIndex가 1이면 슬라이더틑 0%로, 1이면 -100%, 2이면 -200%로 이동
            // 이는 각 슬라이드가 너비의 100&를 차지한다는 가정하에 실행.
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
