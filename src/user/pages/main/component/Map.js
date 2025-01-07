import React, { useEffect, useState } from 'react';
import './Map.css';
import loMarker from '../image/marker.png';

const { kakao } = window;

const Map = ({ address, setAddress, defaultValue }) => {
    const [map, setMap] = useState(null);
    const [stores, setStores] = useState([]);
    const [currentMarker, setCurrentMarker] = useState({ marker: null, infowindow: null });

    useEffect(() => {
        fetch('/main/category')
            .then((response) => response.json())
            .then((data) => setStores(data));

        const mapContainer = document.getElementById('map');
        const mapOption = {
            center: new kakao.maps.LatLng(37.562997, 127.189575),
            level: 2
        };

        const kakaoMap = new kakao.maps.Map(mapContainer, mapOption);
        setMap(kakaoMap);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const locPosition = new kakao.maps.LatLng(lat, lon);
                const message = '<div style="padding:5px; padding-left:35px; height:1.5vw; font-weight:900; color:#FF8AA3;">현재 위치</div>';

                displayMarker(locPosition, message);

                const geocoder = new kakao.maps.services.Geocoder();

                geocoder.coord2Address(lat, lon, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        const address = result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name;
                        if (address !== defaultValue) {
                            setAddress(address);
                        }
                    }
                });
            });
        } else {
            const locPosition = new kakao.maps.LatLng(37.562997, 127.189575);
            const message = '현재위치 추적 불가능';

            displayMarker(locPosition, message);
        }
    }, [defaultValue,setAddress]); // 의존성 배열에 defaultValue만 추가

    useEffect(() => {
        if (map && stores.length > 0) {
            stores.forEach(store => {
                const imageSrc = loMarker;
                const imageSize = new kakao.maps.Size(55, 66);
                const imageOption = { offset: new kakao.maps.Point(27, 69) };

                const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

                const markerPosition = new kakao.maps.LatLng(store.latitude, store.longitude);

                const marker = new kakao.maps.Marker({
                    position: markerPosition,
                    image: markerImage
                });

                marker.setMap(map);
            });
        }
    }, [map, stores]);

    useEffect(() => {
        if (map && address && address !== defaultValue) {
            const places = new kakao.maps.services.Places();

            places.keywordSearch(address, function (result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    const locPosition = new kakao.maps.LatLng(result[0].y, result[0].x);
                    const message = '<div style="padding:5px; padding-left:35px; height:1.5vw; font-weight:900; color:#FF8AA3;">현재 위치</div>';
                    displayMarker(locPosition, message);
                } else {
                    alert('주소를 찾을 수 없습니다.');
                }
            });
        }
    }, [map, address, defaultValue]); // 의존성 배열에 defaultValue 추가

    function displayMarker(locPosition, message) {
        if (!map) return; // map 객체가 초기화되지 않았으면 아무것도 하지 않음

        if (currentMarker.marker) {
            currentMarker.marker.setMap(null);
            currentMarker.infowindow.close();
        }

        const marker = new kakao.maps.Marker({
            map: map,
            position: locPosition
        });

        const infowindow = new kakao.maps.InfoWindow({
            content: message, removable: true
        });

        infowindow.open(map, marker);

        map.setCenter(locPosition);
        setCurrentMarker({ marker, infowindow });
    }

    return (
        <div id="map"></div>
    );
};

export default Map;
