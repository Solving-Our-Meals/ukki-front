import React, { useEffect, useState } from 'react';
import './Map.css';

const { kakao } = window;

const Map = () => {
    const [map, setMap] = useState(null);

    useEffect(() => {
        const mapContainer = document.getElementById('map'); // 지도를 표시할 div
        const mapOption = { 
            center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
            level: 2 // 지도의 확대 레벨 숫자 높을수록 확재범위 늘어남
        }; 

        const kakaoMap = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
        setMap(kakaoMap);

        if (navigator.geolocation) {
            // GeoLocation을 이용해서 접속 위치를 얻어옵니다
            navigator.geolocation.getCurrentPosition(function(position) {
                const lat = position.coords.latitude; // 위도
                const lon = position.coords.longitude; // 경도

                const locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
                const message = '<div style="padding:5px; height:1.5vw;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;현재 위치</div>'; // 인포윈도우에 표시될 내용입니다

                // 마커와 인포윈도우를 표시합니다
                displayMarker(locPosition, message);
            });
        } else { 
            // HTML5의 GeoLocation을 사용할 수 없을 때 마커 표시 위치와 인포윈도우 내용을 설정합니다
            const locPosition = new kakao.maps.LatLng(33.450701, 126.570667); 
            const message = 'geolocation을 사용할 수 없어요..';

            displayMarker(locPosition, message);
        }

        // 지도에 마커와 인포윈도우를 표시하는 함수입니다
        function displayMarker(locPosition, message) {
            // 마커를 생성합니다
            const marker = new kakao.maps.Marker({  
                map: kakaoMap, 
                position: locPosition
            }); 

            const iwContent = message; // 인포윈도우에 표시할 내용
            const iwRemoveable = true;

            // 인포윈도우를 생성합니다
            const infowindow = new kakao.maps.InfoWindow({
                content: iwContent,
                removable: iwRemoveable
            });

            // 인포윈도우를 마커위에 표시합니다 
            infowindow.open(kakaoMap, marker);

            // 지도 중심좌표를 접속위치로 변경합니다
            kakaoMap.setCenter(locPosition);      
        }

    }, []);

    return (
        <div id="map"></div>
    );
};

export default Map;
