import React, { useEffect, useState, useRef } from 'react';
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
import '../../../common/header/css/reset.css';
import './css/main.css';

const banners = [banner1, banner2, banner3, banner4, banner5];
const storeInfos = [
    { name: "해당 가게 이름1", time: "영업시간 10:00 - 22:00", desc: "가게 설명 가게 설명 가게 설명 가게 설명 가게 설명 가게 설명1" },
    { name: "해당 가게 이름2", time: "가게의 영업 시간 및 날짜2", desc: "가게 설명 가게 설명 가게 설명 가게 설명 가게 설명 가게 설명2" },
    { name: "해당 가게 이름3", time: "가게의 영업 시간 및 날짜3", desc: "가게 설명 가게 설명 가게 설명 가게 설명 가게 설명 가게 설명3" },
    { name: "해당 가게 이름4", time: "가게의 영업 시간 및 날짜4", desc: "가게 설명 가게 설명 가게 설명 가게 설명 가게 설명 가게 설명4" },
    { name: "해당 가게 이름5", time: "가게의 영업 시간 및 날짜5", desc: "가게 설명 가게 설명 가게 설명 가게 설명 가게 설명 가게 설명5" }
];

const Main = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const slideInterval = useRef(null);
    const startX = useRef(0);
    const endX = useRef(0);

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

    return (
        <>
            <div>
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
                    <div className="pagination">
                        <ul>
                            {banners.map((_, index) => (
                                <li
                                    key={index}
                                    className={currentSlide === index ? 'act' : ''}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePaginationClick(index);
                                    }}
                                >
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='search'>
                    <input type='search' value="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;검색창으로 이동" readOnly />
                    <img src={search} alt="search" />
                </div>
                <div className='category'>
                    <h3>지금 끌리는 메뉴는?</h3>
                    <p>카테고리 별로 근처 식당을 추천해드려요!</p>
                    <div className='gkstlr'>
                        <div>
                            <p>한식</p>
                        </div>
                        <img src={gkstlr} />
                        <span>흠..별로?</span>
                    </div>
                    <div className='didtlr'>
                        <div>
                            <p>양식</p>
                        </div>
                        <img src={didtlr} />
                        <span>흠..별로?</span>
                    </div>
                    <div className='dlftlr'>
                        <div>
                            <p>일식</p>
                        </div>
                        <img src={didtlr} />
                        <span>흠..별로?</span>
                    </div>
                    <div className='wndtlr'>
                        <div>
                            <p>중식</p>
                        </div>
                        <img src={wndtlr} />
                        <span>흠..별로?</span>
                    </div>
                    <div className='rlxk'>
                        <div>
                            <p>기타</p>
                        </div>
                        <img src={rlxk} />
                        <span>흠..별로?</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Main;
