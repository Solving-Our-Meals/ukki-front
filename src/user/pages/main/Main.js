import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import banner1 from './image/main-banner1.png';
import banner2 from './image/main-banner2.png';
import banner3 from './image/main-banner3.png';
import banner4 from './image/main-banner4.png';
import banner5 from './image/main-banner5.png';
import storeBg from './image/name-bg.png';
import search from './image/Search.png';
import gkstlr from './image/image.png';
import didtlr from './image/image-1.png';
import dlftlr from './image/image-2.png';
import wndtlr from './image/image-3.png';
import rlxk from './image/image-4.png';
import qorqks from './image/store1.png';
import ukki from './image/ukiLemone.png';
import talk1 from './image/talk-bg1.png';
import talk2 from './image/talk-bg2.png';
import talk3 from './image/talk.png';
import arrow1 from './image/Arrow1.png';
import arrow2 from './image/Arrow2.png';
import pin from './image/pin.png';
import rBg from './image/roulette.png';
import '../../../common/header/css/reset.css';
import './css/main.css';
import Map from './component/Map.js';
import Footer from './component/Footer.js';
import { API_BASE_URL } from '../../../config/api.config.js';
import axios from 'axios';

import { useAuth } from '../../../common/authContext/AuthContext';
import Profile from '../storedetail/components/Profile.js';


const banners = [banner1, banner2, banner3, banner4, banner5];
const storeInfos = [
    { name: "어서오소 덮밥", time: "영업시간 16:00 - 03:00", desc: "다양한 소고기 부위를 덮밥으로 즐길수있는 식당" },
    { name: "샐러드의 반란", time: "영업시간 10:00 - 22:00 ",desc: "샐러드의 변신을 보여드립니다. 지금까지 샐러드가 다이어트나 가볍게 먹는다고 생각하셨다면 오산! 이제는 한끼 식사로 균형잡힌 영양을 제공합니다." },
    { name: "불나방 떡볶이", time: "영업시간 10:00 - 21:00", desc: "매운 떡볶이를 찾아 떠돌아 다니는 사람들을 위한 진짜 매운 떡볶이집" },
    { name: "여기다피자", time: "영업시간 07:00 - 21:00", desc: "마음에 드는 피자가 없으시다고요? 여기 여러분의 1번이 될 피자집이 있습니다!" },
    { name: "전설의 짬뽕", time: "영업시간 11:00 - 23:00", desc: "짬뽕 전문점으로 중식이지만 짬뽕위주로 판매하고 있습니다. 평소 짬뽕을 싫어하시는 분도 취향에 맞게 고를수있는 메뉴가 다양해 즐길 수 있습니다." }
];

const rolLength = 8; //룰렛 갯수
let setNum;
const hiddenInput = document.createElement("input");
hiddenInput.className = "hidden-input";


const rRandom = () => {
    const min = Math.ceil(0);
    const max = Math.floor(rolLength - 1);
    return Math.floor(Math.random() * (max - min)) + min;
};



const Main = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(1);
    const [currentPosition, setCurrentPosition] = useState(null);
    const slideInterval = useRef(null);
    const startX = useRef(0);
    const endX = useRef(0);
    const defaultValue = "눌러서 현재 위치 변경 가능";
    const [address, setAddress] = useState(defaultValue);
    const [stores, setStores] = useState([]);
    const [isFirstImgClicked, setIsFirstImgClicked] = useState(true); // 추가된 상태 정의
    const [isSecondImgClicked, setIsSecondImgClicked] = useState(false); // 추가된 상태 정의
    const [isThreeImgClicked, setIsThreeImgClicked] = useState(false); // 추가된 상태 정의
    const [isFourImgClicked, setIsFourImgClicked] = useState(false); // 추가된 상태 정의
    const [isLastImgClicked, setIsLastImgClicked] = useState(false); // 추가된 상태 정의
    const [isMarkerClicked, setIsMarkerClicked] = useState(false);
    const [clickedStoreId, setClickedStoreId] = useState(null); // 클릭된 가게의 ID 상태
    const [userNo, setUserNo] = useState(null); // 로그인된 사용자의 userNo를 저장할 상태
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const navigate = useNavigate();

    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        if (user?.userRole === 'STORE') {
            navigate('/boss');
            return;
        }

        if (user?.userRole === 'ADMIN') {
            navigate('/admin');
            return;
        }
    }, [isAuthenticated, user, navigate]);


    useEffect(() => {
        // 예시: 로컬 스토리지나 API에서 로그인 정보를 가져오는 방법
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            setUserNo(loggedInUser.userNo);
        }
    }, []);



    const locationRef = useRef(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                setCurrentPosition({
                    x: position.coords.longitude,
                    y: position.coords.latitude
                });
            }, error => {
                alert('위치 정보를 가져올 수 없습니다.');
            });
        } else {
            alert('Geolocation을 사용할 수 없습니다.');
        }
    }, []);

    const requestDirections = (store) => {
        if (currentPosition && store) {
            console.log('Requesting directions from:', currentPosition, 'to:', store);
        } else {
            alert('경로를 요청할 수 없습니다.');
        }
    };


    // 윈도우 크기 변경 시 상태 업데이트
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // 이벤트 리스너 등록
        window.addEventListener('resize', handleResize);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // 이미지를 클릭할 때마다 left, top 값 업데이트
    useEffect(() => {
        const updateImagePositions = () => {
            const fImg = document.querySelector('.category > div:nth-of-type(1)');
            const SImg = document.querySelector('.category > div:nth-of-type(2)');
            const TImg = document.querySelector('.category > div:nth-of-type(3)');
            const FImg = document.querySelector('.category > div:nth-of-type(4)');
            const LImg = document.querySelector('.category > div:nth-of-type(5)');

            const commonStyles = {
                left: '43vw',
                top: '110vw',
            };

            if (windowWidth >= 769 && windowWidth <= 1440) {
                // 중간 크기 화면 설정
                if (isFirstImgClicked) {
                    Object.assign(fImg.style, { ...commonStyles, left: '28vw', top: '110vw' });
                    Object.assign(SImg.style, { ...commonStyles, left: '49.9vw', top: '110vw' });
                    Object.assign(TImg.style, { ...commonStyles, left: '59.5vw', top: '110vw' });
                    Object.assign(FImg.style, { ...commonStyles, left: '68.9vw', top: '110vw' });
                    Object.assign(LImg.style, { ...commonStyles, left: '78.2vw', top: '110vw' });
                } else if (isSecondImgClicked) {
                    Object.assign(fImg.style, { ...commonStyles, left: '13.8vw', top: '110vw' });
                    Object.assign(SImg.style, { ...commonStyles, left: '37.5vw', top: '110vw' });
                    Object.assign(TImg.style, { ...commonStyles, left: '59.5vw', top: '110vw' });
                    Object.assign(FImg.style, { ...commonStyles, left: '68.9vw', top: '110vw' });
                    Object.assign(LImg.style, { ...commonStyles, left: '78.2vw', top: '110vw' });
                }
                else if (isThreeImgClicked) {
                    Object.assign(fImg.style, { ...commonStyles, left: '13.8vw', top: '110vw' });
                    Object.assign(SImg.style, { ...commonStyles, left: '23vw', top: '110vw' });
                    Object.assign(TImg.style, { ...commonStyles, left: '46.5vw', top: '110vw' });
                    Object.assign(FImg.style, { ...commonStyles, left: '68.9vw', top: '110vw' });
                    Object.assign(LImg.style, { ...commonStyles, left: '78.2vw', top: '110vw' });
                }
                else if (isFourImgClicked) {
                    Object.assign(fImg.style, { ...commonStyles, left: '13.8vw', top: '110vw' });
                    Object.assign(SImg.style, { ...commonStyles, left: '23vw', top: '110vw' });
                    Object.assign(TImg.style, { ...commonStyles, left: '32.5vw', top: '110vw' });
                    Object.assign(FImg.style, { ...commonStyles, left: '56.5vw', top: '110vw' });
                    Object.assign(LImg.style, { ...commonStyles, left: '78.2vw', top: '110vw' });
                }
                else {
                    Object.assign(fImg.style, { ...commonStyles, left: '13.8vw', top: '110vw' });
                    Object.assign(SImg.style, { ...commonStyles, left: '23vw', top: '110vw' });
                    Object.assign(TImg.style, { ...commonStyles, left: '32.5vw', top: '110vw' });
                    Object.assign(FImg.style, { ...commonStyles, left: '42vw', top: '110vw' });
                    Object.assign(LImg.style, { ...commonStyles, left: '65.5vw', top: '110vw' });
                }

            } else if (windowWidth <= 769) {
                // 작은 화면 설정
                if (isFirstImgClicked) {
                    Object.assign(fImg.style, { left: '43vw', top: '110vw' });
                    Object.assign(SImg.style, { left: '43vw', top: '137vw' });
                    Object.assign(TImg.style, { left: '43vw', top: '151vw' });
                    Object.assign(FImg.style, { left: '43vw', top: '164.5vw' });
                    Object.assign(LImg.style, { left: '43vw', top: '178.5vw' });
                }
                else if (isSecondImgClicked) {
                    Object.assign(fImg.style, { left: '43vw', top: '97vw' });
                    Object.assign(SImg.style, { left: '43vw', top: '125vw' });
                    Object.assign(TImg.style, { left: '43vw', top: '151vw' });
                    Object.assign(FImg.style, { left: '43vw', top: '164.5vw' });
                    Object.assign(LImg.style, { left: '43vw', top: '178.5vw' });
                }
                else if (isThreeImgClicked) {
                    Object.assign(fImg.style, { left: '43vw', top: '97vw' });
                    Object.assign(SImg.style, { left: '43vw', top: '112vw' });
                    Object.assign(TImg.style, { left: '43vw', top: '140vw' });
                    Object.assign(FImg.style, { left: '43vw', top: '164.5vw' });
                    Object.assign(LImg.style, { left: '43vw', top: '178.5vw' });
                }
                else if (isFourImgClicked) {
                    Object.assign(fImg.style, { left: '43vw', top: '97vw' });
                    Object.assign(SImg.style, { left: '43vw', top: '112vw' });
                    Object.assign(TImg.style, { left: '43vw', top: '125vw' });
                    Object.assign(FImg.style, { left: '43vw', top: '153vw' });
                    Object.assign(LImg.style, { left: '43vw', top: '178.5vw' });
                }
                else {
                    Object.assign(fImg.style, { left: '43vw', top: '97vw' });
                    Object.assign(SImg.style, { left: '43vw', top: '112vw' });
                    Object.assign(TImg.style, { left: '43vw', top: '125vw' });
                    Object.assign(FImg.style, { left: '43vw', top: '139vw' });
                    Object.assign(LImg.style, { left: '43vw', top: '168vw' });
                }

            } else {
                // 기본 상태 (크기가 769보다 클 때)
                if (isFirstImgClicked) {
                    Object.assign(fImg.style, { left: '28.5vw', top: '86.5vw' });
                    Object.assign(SImg.style, { left: '51.5vw', top: '86.5vw' });
                    Object.assign(TImg.style, { left: '60.5vw', top: '86.5vw' });
                    Object.assign(FImg.style, { left: '69.5vw', top: '86.5vw' });
                    Object.assign(LImg.style, { left: '78.5vw', top: '86.5vw' });
                }
                else if (isSecondImgClicked) {
                    Object.assign(fImg.style, { left: '15.5vw', top: '86.5vw' });
                    Object.assign(SImg.style, { left: '37.5vw', top: '86.5vw' });
                    Object.assign(TImg.style, { left: '60.5vw', top: '86.5vw' });
                    Object.assign(FImg.style, { left: '69.5vw', top: '86.5vw' });
                    Object.assign(LImg.style, { left: '78.5vw', top: '86.5vw' });
                }
                else if (isThreeImgClicked) {
                    Object.assign(fImg.style, { left: '15.5vw', top: '86.5vw' });
                    Object.assign(SImg.style, { left: '24.5vw', top: '86.5vw' });
                    Object.assign(TImg.style, { left: '47.5vw', top: '86.5vw' });
                    Object.assign(FImg.style, { left: '69.5vw', top: '86.5vw' });
                    Object.assign(LImg.style, { left: '78.5vw', top: '86.5vw' });
                }
                else if (isFourImgClicked) {
                    Object.assign(fImg.style, { left: '15.5vw', top: '86.5vw' });
                    Object.assign(SImg.style, { left: '24.5vw', top: '86.5vw' });
                    Object.assign(TImg.style, { left: '33.5vw', top: '86.5vw' });
                    Object.assign(FImg.style, { left: '56.5vw', top: '86.5vw' });
                    Object.assign(LImg.style, { left: '78.5vw', top: '86.5vw' });
                }
                else {
                    Object.assign(fImg.style, { left: '15.5vw', top: '86.5vw' });
                    Object.assign(SImg.style, { left: '24.5vw', top: '86.5vw' });
                    Object.assign(TImg.style, { left: '33.5vw', top: '86.5vw' });
                    Object.assign(FImg.style, { left: '43vw', top: '86.5vw' });
                    Object.assign(LImg.style, { left: '65.5vw', top: '86.5vw' });
                }

            }
        };

        updateImagePositions();
    }, [windowWidth, isFirstImgClicked, isSecondImgClicked, isThreeImgClicked, isFourImgClicked, isLastImgClicked]);

    const handleFirstImgClick = () => {
        setIsFirstImgClicked(true);
        setIsSecondImgClicked(false);
        setIsThreeImgClicked(false);
        setIsFourImgClicked(false);
        setIsLastImgClicked(false);
        scrollToLocation();
    };

    const handleSecondImgClick = () => {
        setIsFirstImgClicked(false);
        setIsSecondImgClicked(true);
        setIsThreeImgClicked(false);
        setIsFourImgClicked(false);
        setIsLastImgClicked(false);
        scrollToLocation();
    };


    const handleThreeImgClick = () => {
        setIsFirstImgClicked(false);
        setIsSecondImgClicked(false);
        setIsThreeImgClicked(true);
        setIsFourImgClicked(false);
        setIsLastImgClicked(false);
        scrollToLocation();
    };

    const handleFourImgClick = () => {
        setIsFirstImgClicked(false);
        setIsSecondImgClicked(false);
        setIsThreeImgClicked(false);
        setIsFourImgClicked(true);
        setIsLastImgClicked(false);
        scrollToLocation();
    };

    const handleLastImgClick = () => {
        setIsFirstImgClicked(false);
        setIsSecondImgClicked(false);
        setIsThreeImgClicked(false);
        setIsFourImgClicked(false);
        setIsLastImgClicked(true);
        scrollToLocation();
    };




    const scrollToLocation = () => {
        locationRef.current.scrollIntoView({
            behavior: 'smooth'
        });
    };


    const [storeInfo, setStoreInfo] = useState({
        storeName: '',
        storeDes: '',
        storeAddress: '',
        storeProfile: '',
        storeNo: '',
        storeMenu: ''

    });


    // const StoreSelection = () => {
    //     const [storeNo, setStoreNo] = useState(null);


    //     const handleStoreSelect = (storeNo) => {
    //         setStoreNo(storeNo);
    //     };

    // };



    const handleReservationClick = () => {
        if (storeInfo && storeInfo.storeName) {
            console.log("Selected StoreNo: ", storeInfo.storeName);  // For debugging
            setTimeout(() => {
                navigate(`store/${storeInfo.storeName}`);
                
            }, 5500); // Wait 5500ms before navigating
        } else {
            // alert("가게를 선택해주세요.");  // Notify user to select a store if not selected
        }
    };
    



    const handleMarkerClick = (storeName, storeDes, storeMenu, storeProfile, storeAddress, storeNo) => {
        let storeProfileUrl = `${API_BASE_URL}/image?fileId=${storeProfile}`
        console.log(storeProfileUrl)
        console.log("Selected Store No: ", storeNo);  // 디버깅용
        setStoreInfo({
            storeName, storeDes, storeMenu, storeProfile, storeAddress, storeNo
        });
        setIsMarkerClicked(true);
    };


    const handleKeyPress = async (event) => {
        if (event.key === 'Enter') {
            if (event.target.value !== defaultValue) {
                // 새로운 위치로 갱신
                setAddress(event.target.value);
    
                // Geocode API를 사용하여 주소에서 위도/경도를 가져옴
                try {
                    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${event.target.value}&key=YOUR_GOOGLE_API_KEY`);
                    const location = response.data.results[0].geometry.location;
    
                    const newLongitude = location.lng;
                    const newLatitude = location.lat;
    
                    // 위치 갱신
                    const newPosition = { x: newLongitude, y: newLatitude };
                    setCurrentPosition(newPosition);
    
                } catch (error) {
                    console.error('Failed to get location from address:', error);
                }
            }
        }
    };
    




    // const getUserLocation = () => {
    //     return new Promise((resolve, reject) => {
    //         if (navigator.geolocation) {
    //             navigator.geolocation.getCurrentPosition(resolve, reject);
    //         } else {
    //             reject(new Error("Geolocation not available"));
    //         }
    //     });
    // };

    // const getClosestStores = async (lat, lon) => {
    //     try {
    //         const response = await fetch(`${API_BASE_URL}/stores?lat=${lat}&lon=${lon}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Accept': 'application/json',  // 응답을 JSON 형식으로 받겠다는 의미
    //                 'Content-Type': 'application/json',  // 요청 내용이 JSON 형식임을 지정

    //             }
    //         });

    //         const data = await response.json();
    //         return data;  // List of stores
    //     } catch (error) {
    //         console.error("Error fetching closest stores:", error);
    //         return [];
    //     }
    // };


    // const populateRoulette = (stores) => {
    //     const panel = document.querySelector(".rouletter-wacu");
    //     // Clear existing slots
    //     panel.innerHTML = "";
    //     // Add new store slots to the roulette panel
    //     stores.forEach(store => {
    //         const storeElement = document.createElement('div');
    //         storeElement.className = "roulette-slot";
    //         storeElement.textContent = store.storeName;  // Or any other property of the store
    //         panel.appendChild(storeElement);
    //     });
    // };

    // async function initRoulette() {
    //     try {
    //         // 사용자의 위치를 가져오기
    //         const position = await getUserLocation();
    //         const userLat = position.coords.latitude;
    //         const userLon = position.coords.longitude;

    //         // 가장 가까운 8개 가게 가져오기
    //         const closestStores = await getClosestStores(userLat, userLon);

    //         // 룰렛에 가게 추가하기
    //         populateRoulette(closestStores);
    //     } catch (error) {
    //         console.error("위치 정보를 가져오는 중 오류 발생:", error);
    //     }
    // }

    useEffect(() => {
        const handleScroll = () => {
            const images = document.querySelectorAll('.talk img');
            images.forEach(img => {
                const rect = img.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    img.classList.add('show');
                } else {
                    img.classList.remove('show');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        startAutoSlide();
        return () => clearInterval(slideInterval.current);
    }, []);


    const startAutoSlide = () => {
        if (slideInterval.current) clearInterval(slideInterval.current);
        slideInterval.current = setInterval(() => {
            if (!isHovered) {
                setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
            }
        }, 2000);
    };

    const resetAutoSlide = () => {
        clearInterval(slideInterval.current);
        startAutoSlide();
    };

    const handlePrev = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + banners.length) % banners.length);
        resetAutoSlide();
    };

    const handleNext = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
        resetAutoSlide();
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        clearInterval(slideInterval.current);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        startAutoSlide();
    };

    const handlePaginationClick = (index) => {
        setCurrentSlide(index);
        resetAutoSlide();
    };

    const handleTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        endX.current = e.changedTouches[0].clientX;
        if (startX.current > endX.current + 50) {
            handleNext();
        } else if (startX.current < endX.current - 50) {
            handlePrev();
        }
        resetAutoSlide();
    };

    const handleMouseDown = (e) => {
        startX.current = e.clientX;
    };

    const handleMouseUp = (e) => {
        endX.current = e.clientX;
        if (startX.current > endX.current + 50) {
            handleNext();
        } else if (startX.current < endX.current - 50) {
            handlePrev();
        }
        resetAutoSlide();
    };


    const rRotate = () => {
        const panel = document.querySelector(".rouletter-wacu");
        const btn = document.querySelector(".rouletter-btn");
        const deg = [];
        for (let i = 1, len = rolLength; i <= len; i++) {
            deg.push((360 / len) * i);
        }

        let num = 0;
        document.body.append(hiddenInput);
        setNum = hiddenInput.value = rRandom();

        // 애니메이션 설정
        panel.style.transition = "transform 5s ease-in-out"; // 애니메이션 지속 시간 조정

        const totalRotation = 360 * 10 + deg[setNum]; // 10바퀴 돌고 최종 위치에 도달

        panel.style.transform = `rotate(${totalRotation}deg)`;
        btn.disabled = true;
        btn.style.pointerEvents = "none";
        hiddenInput.remove();
        // 애니메이션 종료 후 버튼 활성화
        setTimeout(() => {
            panel.style.transition = "";
            panel.style.transform = `rotate(${deg[setNum]}deg)`; //리셋
            btn.disabled = false;
            btn.style.pointerEvents = "auto";

        }, 5000); // 애니메이션 시간과 맞춤
    };


    const rLayerPopup = (num) => {
        switch (num) {
            default:
            // alert("예약이 완료 되었습니다");
        }
    };

    const rReset = (ele) => {
        setTimeout(() => {
            ele.disabled = false;
            ele.style.pointerEvents = "auto";
            rLayerPopup(setNum);
            hiddenInput.remove();
        }, 5000);
    };

    const handleRouletteClick = async (e) => {
        const target = e.target;

        // 룰렛 애니메이션 실행
        if (target.className === "rouletter-btn") {
            rRotate(); // 룰렛 애니메이션

            setTimeout(async () => {
                try {
                    // 8개의 가게 가져오기 (선택된 카테고리 및 위치 기반)
                    const selectedStores = await fetchStoresLocation(selectedCategory, currentPosition);
                    if (selectedStores.length === 0) {
                        // alert("가게 정보를 불러오지 못했습니다.");
                        return;
                    }
                    const winningStore = selectedStores[Math.floor(Math.random() * selectedStores.length)];

                    const userConfirmed = window.confirm(`당첨된 가게: ${winningStore.storeName}입니다! 확인을 클릭하면 가게 상세페이지로 이동합니다.`);

                if (userConfirmed) {
                    // Redirect to the store's detail page
                    navigate(`/store/${winningStore.storeNo}`);
                }

                } catch (error) {
                    console.error(error);
                    // alert(error.message || "예약 처리 중 오류가 발생했습니다.");
                }

                rReset(target); // 룰렛 초기화
            }, 5500); // 2초 후 예약 처리
        }
    };




    const makeReservation = async (userNo, storeNo, resTime) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservations`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userNo,
                    storeNo,
                    resTime,
                    isRandom: true,  // 랜덤 예약 여부
                })
            });

            if (!response.ok) {
                throw new Error("예약에 실패했습니다.");
            }

            const data = await response.json();
            alert("예약이 완료되었습니다. QR 코드: " + data.qr); // 예약 완료 후 QR 코드 반환
        } catch (error) {
            // console.error("예약 실패", error);
            // alert("예약을 완료할 수 없습니다.");
        }
    };

    // 예약 가능한 가장 가까운 시간 반환
    const getNextAvailableTime = async (storeNo, resDate) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservations/next-available-time`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ storeNo, resDate })
            });

            if (!response.ok) {
                throw new Error("예약 가능한 시간이 없습니다.");
            }

            const data = await response.json();
            return data.resTime; // 가장 가까운 예약 시간 반환
        } catch (error) {

            // console.error("예약 시간 가져오기 실패", error);
            // throw new Error("예약 시간을 가져오는 중 문제가 발생했습니다.");

        }
    };


    // 거리 계산을 위한 함수 (Haversine 공식)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // 지구의 반지름 (단위: km)
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // 반환 값: km
    };

    // 주변 가게를 가져오는 API 함수
    const fetchStoresLocation = async (category, currentPosition) => {
        try {
            const response = await fetch(`${API_BASE_URL}/main/category?category=${category}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            // if (!response.ok) {
            //     throw new Error('가게 정보를 불러오는 데 실패했습니다.');
            // }

            const data = await response.json();

            // 주변 가게들의 거리 계산
            const storesWithDistance = data.map(store => {
                const distance = calculateDistance(currentPosition.y, currentPosition.x, store.lat, store.lon);
                return { ...store, distance };
            });

            // 거리가 가까운 순으로 정렬
            const sortedStores = storesWithDistance.sort((a, b) => a.distance - b.distance);

            // 가장 가까운 8개의 가게를 룰렛에 추가
            const selectedStores = sortedStores.slice(0, 8);

            return selectedStores;
        } catch (error) {
            console.error('Error fetching store locations:', error);
        }
    };




    // 카테고리 클릭 핸들러
    const handleCategoryClick = (index) => {
        setSelectedCategory(index + 1);
        fetchStoresLocation(index + 1); // 카테고리 코드를 +1 해서 전달
    };





    return (
        <>
            <div onClick={handleRouletteClick}>
                <div className="slidewrap" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <div
                        className="slides"
                        style={{ transform: `translateX(-${currentSlide * 100}%)`, transition: 'transform 0.5s ease' }}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                    >
                        {banners.map((banner, index) => (
                            <div className={`section${index + 1} slide`} key={index}>
                                <img src={banner} alt={`banner${index + 1}`} />
                                {currentSlide === index && (
                                    <div>
                                        <h3>{storeInfos[index].name}</h3>
                                        <img src={storeBg} alt="store background" />
                                        <p>{storeInfos[index].time}</p>
                                        <span>{storeInfos[index].desc}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="leftbtn btn" onClick={handlePrev}>&lt;</div>
                    <div className="rightbtn btn" onClick={handleNext}>&gt;</div>
                </div>
                <div className='category'>
                    <h3>지금 끌리는 메뉴는?</h3>
                    <p>카테고리 별로 근처 식당을 추천해드려요!</p>
                    <div onClick={() => { handleFirstImgClick(); handleCategoryClick(0) }}>
                        <p>한식</p>
                    </div>
                    <img src={gkstlr} onClick={() => { handleFirstImgClick(); handleCategoryClick(0); }} className={selectedCategory === 1 ? 'selected-img' : ''} />
                    <div onClick={() => { handleSecondImgClick(); handleCategoryClick(1) }}>
                        <p>중식</p>
                    </div>
                    <img src={dlftlr} onClick={() => { handleSecondImgClick(); handleCategoryClick(1) }} className={selectedCategory === 2 ? 'selected-img' : ''} />
                    <div onClick={() => { handleThreeImgClick(); handleCategoryClick(2) }}>
                        <p>일식</p>
                    </div>
                    <img src={wndtlr} onClick={() => { handleThreeImgClick(); handleCategoryClick(2) }} className={selectedCategory === 3 ? 'selected-img' : ''} />
                    <div onClick={() => { handleFourImgClick(); handleCategoryClick(3) }}>
                        <p>양식</p>
                    </div>
                    <img src={didtlr} onClick={() => { handleFourImgClick(); handleCategoryClick(3) }} className={selectedCategory === 4 ? 'selected-img' : ''} />
                    <div onClick={() => { handleLastImgClick(); handleCategoryClick(4) }}>
                        <p>기타</p>
                    </div>
                    <img src={rlxk} onClick={() => { handleLastImgClick(); handleCategoryClick(4) }} className={selectedCategory === 5 ? 'selected-img' : ''} />
                </div>
                <div className='location' ref={locationRef}>
                    <Map
                        address={address}
                        setAddress={setAddress}
                        defaultValue={defaultValue}
                        selectedCategory={selectedCategory}
                        onMarkerClick={(storeName, storeDes, storeMenu, storeProfile, storeAddress, storeNo) => handleMarkerClick(storeName, storeDes, storeMenu, storeProfile, storeAddress, storeNo)}
                        requestDirections={requestDirections}
                        currentPosition={currentPosition}
                        toggleIsMarkerClicked={setIsMarkerClicked}
                    />



                    <h3>
                        {selectedCategory === 1 ? '내 주변 한식 혼밥 리스트' :
                            selectedCategory === 2 ? '내 주변 중식 혼밥 리스트' :
                                selectedCategory === 3 ? '내 주변 일식 혼밥 리스트' :
                                    selectedCategory === 4 ? '내 주변 양식 혼밥 리스트' :
                                        selectedCategory === 5 ? '내 주변 기타 혼밥 리스트' :
                                            '내 주변 한식 혼밥 리스트'}
                    </h3>
                    {isMarkerClicked && (
                        <>
                            <p>가게 이름 : <span>{storeInfo.storeName}</span></p>
                            <p>가게 설명 : <span>{storeInfo.storeDes}</span></p>

                            <img src={`${API_BASE_URL}/image?fileId=${storeInfo.storeProfile}`} alt="store" />

                            <img src={ukki} alt="ukki" />
                            <input onKeyPress={handleKeyPress}
                                defaultValue={defaultValue}  ></input>
                            <label>현재 위치 : </label>
                            <input value={storeInfo.storeAddress}></input>
                            <label>가게 위치 : </label>
                            <button onClick={() => handleRouletteClick()}>예약하기</button>

                            <div>
                                <div>
                                    <p onClick={() => handleRouletteClick(false)}>x</p>
                                </div>
                            </div>
                        </>
                    )}

                </div>

                <div className='talk'>
                    <img src={talk1} />
                    <img src={talk2} />
                    <img src={talk3} />
                </div>

                <div className='random'>
                    <h3><span>도파민 중독자</span>인<br />
                        당신을 위한<span> 랜덤 예약</span>!</h3>
                    <p>랜덤 예약시 경고문을 잘 읽어 주세요</p>
                    <p>  * 랜덤 예약은 당일/현재 시간을 기준으로 예약됩니다 *<br />
                        * 랜덤 예약 취소 시 노쇼와 같은 패널티를 받게 됩니다 *<br />
                        * 랜덤 예약의 가격대는 설정할 수 없습니다 *</p>
                    <span>
                        1. 우끼가 내 위치 주변에 있는 식당을 찾는다.<br />
                        2. 찾은 식당들을 우끼링이 랜덤으로 돌린다.<br />
                        3. 마이페이지에서 어느가게에 예약되었는지 확인한다.<br />
                        4. 이메일로 받은 예약 QR코드를 확인한뒤 방문한다
                    </span>
                    <img src={arrow1} />
                    <button className="rouletter-btn" onClick={handleReservationClick}>랜덤 예약 돌리기</button>
                    <img src={arrow2} />
                </div>

                <div className='roulette'>
                    <div className="rouletter-bg">
                        <div className="rouletter-wacu">
                            <img src={rBg} />
                        </div>
                    </div>
                    <div className="rouletter-arrow">
                        <img src={pin} />
                    </div>
                    <button className="rouletter-btn" onClick={handleReservationClick}>start</button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Main;
