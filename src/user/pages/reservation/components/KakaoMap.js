import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from '../css/kakaoMap.module.css'
import mapMarker from '../images/smallMapMarker-logo.png';

function KakaoMap(){
    const [ storeLatitude, setStoreLatitude ] = useState("")
    const [ storeLongitude, setStoreLongitude ] = useState("")
    const [ storeName, setStoreName ] = useState("")
  
    const location = useLocation();
    const storeInfo = {...location.state};

    // 지도에서 길찾기/큰지도 보기 할 때 해당 가게의 위도/경도를 링크로 넘겨 카카오맵에서 보여지게 하기.
    const mapLink  = `https://map.kakao.com/link/map/${storeName},${storeLatitude},${storeLongitude}`

    // useEffect(() => {
    //     fetch('/store/getInfo')
    //     .then(res => res.json())
    //     .then(data => {
    //         setStoreLatitude(data.latitude);
    //         setStoreLongitude(data.longitude);
    //         setStoreName(data.storeName);
    //     });
    // }, [])

    useEffect(() => {
        setStoreLatitude(storeInfo.latitude);
        setStoreLongitude(storeInfo.longitude);
        setStoreName(storeInfo.storeName);
    }, [])

    // 반응형
    const [markerStyle, setMarkerStyle] = useState({
        width : 64,
        height : 85,
        offsetX : 32,
        offsetY : 85
    });

    useEffect(() => {
        const handleResize = () => {
            const width = Window.innerWidth;

            if(width <= 768){
                setMarkerStyle({
                    width : 32,
                    height : 42.5,
                    offsetX : 16,
                    offsetY : 42.5,
                });
            } else if (width <= 1024 && width > 768){
                setMarkerStyle({
                    width : 48,
                    height : 63.75,
                    offsetX : 24,
                    offsetY : 63.75,
                });
            } else {
                setMarkerStyle({
                    width : 64,
                    height : 85,
                    offsetX : 32,
                    offsetY : 85,
                });
            }
        }
        window.addEventListener('resize', handleResize);
        handleResize(); // 초기 로드 시에도 한 번 실행

        return () => window.removeEventListener('resize', handleResize)
    }, [])
    
    return(
        <>
            <Map
                // 지도로 보여줄 위치 지정(위도, 경도)
                center={{ lat : storeLatitude + 0.0004, lng : storeLongitude}}
                // 지도 스타일 적용
                id={styles.mapContainer}
                level={3}
            >
                <MapMarker 
                    //  핀 찍힐 위치 지정
                    style={{ border : 'transparent' }}
                    className={styles.mapmarker}
                    position={{ lat : storeLatitude, lng : storeLongitude }}
                    // 마커 커시텀할 이미지 주소 및 스타일 적용
                    image={{ 
                        src : mapMarker,
                        size : {
                            width : markerStyle.width,
                            height : markerStyle.height,
                        },
                        // 마커의 포인터가 놓일 위치
                        // 마커의 크기가 width : 64, height : 85일 경우 
                        // 포인터의 위치는 width의 중간, height의 끝에 와야하기에 다음과 같이 적용
                        options : {
                            offset : {
                                x : markerStyle.offsetX,
                                y : markerStyle.offsetY,
                            },
                        },
                    }}
                >
                    <CustomOverlayMap
                        position={{ lat : storeLatitude, lng : storeLongitude}}
                        yAnchor={2.35}
                    >
                        <div className={styles.customoverlay}>
                            <span>{storeName}</span>
                            <br/>
                            <span>{storeInfo.storeAddress}</span>
                            {/* <div id={styles.storeName}>
                                {storeName} 
                                <br/>
                                {storeInfo.storeAddress}
                            </div>
                            <div id={styles.storeAddress}>
                                {storeName} <br/>
                                {storeInfo.storeAddress}
                            </div> */}
                            {/* <div>
                                <a
                                    href= {mapLink}
                                    className={styles.mapLink}
                                    // <a> 속성 
                                    target="_blank"  // 링크를 새 탭 또는 새 창에서 열리게 함.
                                    // rel = "noreferrer"
                                    // 링크를 열 때 링크된 페이지에 참조 정보 제공하지 않는다. 
                                    // 이는 보안과 개인정보 보호를 위해 링크된 페이지에 HTTP Referrer 헤더를 보내지 않는다. 
                                    // 즉 링크된 페이지가 사용자가 어떤 페이지에서 왔는지 알지 못하게 한다.
                                    rel="noreferrer" 
                                    // 위 두 속성을 사용하면 보안을 강화하고 개인정보를 보호하는데 도움이 된다.
                                >
                                    &emsp; 큰지도보기 &nbsp;
                                </a>{" "}
                                <a
                                    href={mapLink}
                                    className={styles.mapLink}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                   &nbsp; 길찾기 &emsp;
                                </a>
                            </div> */}
                        </div>
                    </CustomOverlayMap>
                </MapMarker>
            </Map>
        </>
    );
}

export default KakaoMap;