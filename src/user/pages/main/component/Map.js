import React, { useEffect, useState } from 'react';
import './Map.css';
import loMarker from '../image/marker.png';

const { kakao } = window;
const Map = ({ address, setAddress, defaultValue, selectedCategory, onMarkerClick }) => {
    const [map, setMap] = useState(null);
    const [stores, setStores] = useState([]);
    const [currentMarker, setCurrentMarker] = useState({ marker: null, infowindow: null });
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        if (selectedCategory) {
            fetch(`/main/category?category=${selectedCategory}`)
                .then((response) => response.json())
                .then((data) => {
                    setStores(data);
                    markers.forEach(marker => {
                        marker.setMap(null);
                        if (marker.infowindow) {
                            marker.infowindow.close();
                        }
                    });
                    setMarkers([]);
                });
        }
    }, [selectedCategory]);

    useEffect(() => {
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

                displayMarker(locPosition, message, kakaoMap);

                kakaoMap.setCenter(locPosition);

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
            displayMarker(locPosition, message, kakaoMap);
            kakaoMap.setCenter(locPosition);
        }
    }, [defaultValue, setAddress]);

    useEffect(() => {
        if (map && stores.length > 0) {
            const newMarkers = stores.map(store => {
                const imageSrc = loMarker;
                const imageSize = new kakao.maps.Size(55, 66);
                const imageOption = { offset: new kakao.maps.Point(imageSize.width / 2, imageSize.height) };

                const markerImage = new kakao.maps.MarkerImage(imageSrc, new kakao.maps.Size(imageSize.width * 0.7, imageSize.height * 0.7), imageOption);

                const markerPosition = new kakao.maps.LatLng(store.latitude, store.longitude);

                const marker = new kakao.maps.Marker({
                    position: markerPosition,
                    image: markerImage
                });

                const infowindow = new kakao.maps.InfoWindow({
                    content: `<div style="padding:5px; padding-left:10px; height:1.5vw; font-weight:900; text-align:center;">${store.storeName}</div>`,
                    removable: true
                });

                kakao.maps.event.addListener(infowindow, 'close', () => {
                    const reducedImageSize = new kakao.maps.Size(imageSize.width * 0.7, imageSize.height * 0.7);
                    const reducedImageOption = { offset: new kakao.maps.Point(reducedImageSize.width / 2, reducedImageSize.height) };
                    marker.setImage(new kakao.maps.MarkerImage(imageSrc, reducedImageSize, reducedImageOption));
                });

                let isEnlarged = false;

                kakao.maps.event.addListener(marker, 'click', () => {
                    if (isEnlarged) {
                        marker.setImage(new kakao.maps.MarkerImage(imageSrc, new kakao.maps.Size(imageSize.width * 0.7, imageSize.height * 0.7), imageOption));
                        infowindow.close();
                    } else {
                        markers.forEach(m => {
                            m.setImage(new kakao.maps.MarkerImage(imageSrc, new kakao.maps.Size(imageSize.width * 0.7, imageSize.height * 0.7), imageOption));
                            if (m.infowindow) {
                                m.infowindow.close();
                            }
                        });

                        const enlargedImageSize = new kakao.maps.Size(imageSize.width, imageSize.height);
                        const enlargedImageOption = { offset: new kakao.maps.Point(enlargedImageSize.width / 2, enlargedImageSize.height) };
                        marker.setImage(new kakao.maps.MarkerImage(imageSrc, enlargedImageSize, enlargedImageOption));
                        infowindow.open(map, marker);
                        setCurrentMarker({ marker, infowindow });

                        // Update store information
                        onMarkerClick(store.storeName, store.storeDes, store.storeMenu, store.storeProfile, store.storeAddress);
                    }

                    isEnlarged = !isEnlarged;
                });

                marker.setMap(map);
                marker.infowindow = infowindow;
                return marker;
            });

            setMarkers(newMarkers);
        }
    }, [map, stores]);

    useEffect(() => {
        if (map && address && address !== defaultValue) {
            const places = new kakao.maps.services.Places();

            places.keywordSearch(address, function (result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    const locPosition = new kakao.maps.LatLng(result[0].y, result[0].x);
                    const message = '<div style="padding:5px; padding-left:35px; height:1.5vw; font-weight:900; color:#FF8AA3;">현재 위치</div>';
                    displayMarker(locPosition, message, map);
                } else {
                    alert('주소를 찾을 수 없습니다.');
                }
            });
        }
    }, [map, address, defaultValue]);

    function displayMarker(locPosition, message, mapInstance) {
        if (!mapInstance) return;

        if (currentMarker.marker) {
            currentMarker.marker.setMap(null);
            currentMarker.infowindow.close();
        }

        const marker = new kakao.maps.Marker({
            map: mapInstance,
            position: locPosition
        });

        const infowindow = new kakao.maps.InfoWindow({
            content: message,
            removable: true
        });

        infowindow.open(mapInstance, marker);

        mapInstance.setCenter(locPosition);
        setCurrentMarker({ marker, infowindow });

    }

    return (
        <div id="map"></div>
    );
};

export default Map;
