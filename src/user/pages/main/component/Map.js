import React, { useEffect, useState } from 'react';
import './Map.css';

const { kakao } = window;

const Map = () => {
    const [map, setMap] = useState(null);

    useEffect(() => {
        const mapContainer = document.getElementById('map'); 
        const mapOption = { 
            center: new kakao.maps.LatLng(33.450701, 126.570667),
            level: 3 
        }; 

        const kakaoMap = new kakao.maps.Map(mapContainer, mapOption); 
        setMap(kakaoMap);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const locPosition = new kakao.maps.LatLng(lat, lon);
                const message = '<div style="padding:5px; height:1.5vw; font-weight:900; color:#FF8AA3;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;현재 위치</div>'; 

                displayMarker(locPosition, message);

                const geocoder = new kakao.maps.services.Geocoder();

                geocoder.coord2Address(lon, lat, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        const address = result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name;
                        const addressInput = document.querySelector('.location>input');
                        addressInput.value = address;
                    }
                });
            });
        } else { 
            const locPosition = new kakao.maps.LatLng(33.450701, 126.570667);
            const message = '현재위치 추적 불가능능';

            displayMarker(locPosition, message);
        }

        function displayMarker(locPosition, message) {
            const marker = new kakao.maps.Marker({  
                map: kakaoMap, 
                position: locPosition
            }); 

            const iwContent = message; 
            const iwRemoveable = true;

            const infowindow = new kakao.maps.InfoWindow({
                content: iwContent,
                removable: iwRemoveable
            });

            infowindow.open(kakaoMap, marker);

            kakaoMap.setCenter(locPosition);      
        }

    }, []);

    return (
        <div id="map"></div>
    );
};

export default Map;
