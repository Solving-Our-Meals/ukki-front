import React, { useEffect, useState, useRef } from 'react';
import './Map.css';
import loMarker from '../image/marker.png';

const { kakao } = window;

const Map = ({ address, setAddress, defaultValue, selectedCategory, onMarkerClick, toggleIsMarkerClicked }) => {
    const [map, setMap] = useState(null);
    const [stores, setStores] = useState([]);
    const [currentMarker, setCurrentMarker] = useState({ marker: null, infowindow: null });
    const markersRef = useRef([]); // 마커들을 상태 대신 참조로 관리
    const [currentPosition, setCurrentPosition] = useState(null); // 사용자 현재 위치
    const [selectedStore, setSelectedStore] = useState(null); // 선택된 가게 정보
    const [isMarkerClicked, setIsMarkerClicked] = useState(false);
    const [clickedStoreId, setClickedStoreId] = useState(null);
    const [polylines, setPolylines] = useState([]);  // 표시된 경로들

    useEffect(() => {
        if (selectedCategory) {
            fetch(`/main/category?category=${selectedCategory}`)
                .then((response) => response.json())
                .then((data) => {
                    setStores(data);

                    // 기존 마커들 삭제
                    markersRef.current.forEach(marker => {
                        marker.setMap(null);  // 마커 삭제
                        if (marker.infowindow) {
                            marker.infowindow.close();
                        }
                    });
                    markersRef.current = []; // 기존 마커 배열 초기화
                });
        }
    }, [selectedCategory]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAOMAP_APP_KEY}&libraries=services`;
        script.async = true;
        script.onload = () => {
            const mapContainer = document.getElementById('map');
            const mapOption = {
                center: new kakao.maps.LatLng(37.562997, 127.189575),
                level: 3
            };

            const kakaoMap = new kakao.maps.Map(mapContainer, mapOption);
            setMap(kakaoMap); // 상태 업데이트
        };
        document.head.appendChild(script);
    }, []);  // map을 의존성 배열에서 제거

    useEffect(() => {
        if (map && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const locPosition = new kakao.maps.LatLng(lat, lon);
                const message = '<div style="padding:3px; padding-left:40px; height:1.5vw; font-weight:700; color:#FF8AA3;">현재 위치</div>';

                displayMarker(locPosition, message, map);
                setCurrentPosition({ x: lon, y: lat }); // 사용자 현재 위치 설정

                map.setCenter(locPosition);

                const geocoder = new kakao.maps.services.Geocoder();
                geocoder.coord2Address(lat, lon, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        const address = result[0].road_address
                            ? result[0].road_address.address_name
                            : result[0].address.address_name;
                        if (address !== defaultValue) {
                            setAddress(address);
                        }
                    }
                });
            });
        } else {
            const locPosition = new kakao.maps.LatLng(37.562997, 127.189575);
            const message = '현재위치 추적 불가능';
            if (map) {
                displayMarker(locPosition, message, map);
                map.setCenter(locPosition);
            }
        }
    }, [map, defaultValue, setAddress]);
    useEffect(() => {
        // 카테고리가 변경될 때 경로 초기화
        if (window.currentPolyline) {
            window.currentPolyline.setMap(null);  // 이전 경로 지우기
            window.currentPolyline = null;  // 글로벌 변수 초기화
        }
    }, [selectedCategory]);  // 카테고리 변경 시 실행
    
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

                kakao.maps.event.addListener(marker, 'click', async () => {
                    // 모든 마커의 크기를 원래대로 리셋
                    markersRef.current.forEach(m => {
                        const originalImageSize = new kakao.maps.Size(44, 55); // 원래 크기로 리셋
                        const originalImageOption = { offset: new kakao.maps.Point(originalImageSize.width / 2, originalImageSize.height) };
                        m.setImage(new kakao.maps.MarkerImage(imageSrc, originalImageSize, originalImageOption));
                        if (m.infowindow) {
                            m.infowindow.close();
                        }
                    });

                    // 클릭된 마커 확대
                    const enlargedImageSize = new kakao.maps.Size(55, 66); // 클릭된 마커 크기
                    const enlargedImageOption = { offset: new kakao.maps.Point(enlargedImageSize.width / 2, enlargedImageSize.height) };
                    marker.setImage(new kakao.maps.MarkerImage(imageSrc, enlargedImageSize, enlargedImageOption));
                    infowindow.open(map, marker);
                    setCurrentMarker({ marker, infowindow });
                    setSelectedStore(store);

                    // 현재 위치가 있으면 경로를 요청하는 함수 호출
                    if (currentPosition) {
                        requestDirections(store);
                    }

                    // 가게 정보를 업데이트
                    onMarkerClick(store.storeName, store.storeDes, store.storeMenu, store.storeProfile, store.storeAddress);
                });

                marker.setMap(map);
                marker.infowindow = infowindow;

                // 마커를 ref에 저장
                markersRef.current.push(marker);
                return marker;
            });

            // markersRef.current는 참조 배열이므로 별도로 상태를 업데이트할 필요가 없습니다.
        }
    }, [map, stores, currentPosition]);

    const requestDirections = async (store) => {
        try {
            if (!currentPosition) return;
        
            const url = `https://apis-navi.kakaomobility.com/v1/waypoints/directions`;
        
            const headers = {
                'Authorization': `KakaoAK ${process.env.REACT_APP_KAKAOMAP_REST_API_KEY}`,
                'Content-Type': 'application/json',
            };
        
            const body = JSON.stringify({
                origin: currentPosition,
                destination: { x: store.longitude, y: store.latitude },
                waypoints: []
            });
        
            const response = await fetch(url, { method: 'POST', headers, body });
        
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const data = await response.json();
        
            // 경로 데이터 처리
            if (data.routes && data.routes.length > 0 && data.routes[0].sections && data.routes[0].sections.length > 0) {
                const roads = data.routes[0].sections[0].roads;
                if (roads && roads.length > 0) {
                    const routePath = roads.flatMap(road => road.vertexes.map((coord, index, arr) => {
                        if (index % 2 === 0 && arr[index + 1] !== undefined) {
                            const lat = arr[index + 1];
                            const lon = coord;
                            if (!isNaN(lat) && !isNaN(lon)) {
                                return [lon, lat];
                            }
                        }
                        return null;
                    }).filter(Boolean));
            
                    if (routePath && routePath.length > 0) {
                        // 경로를 삭제하고 새 경로 표시
                        displayRoute(routePath);
                    } else {
                        console.error('Invalid directions data: No valid route path found in roads', data);
                    }
                } else {
                    console.error('Invalid directions data: No roads found in sections', data);
                }
            } else {
                console.error('Invalid directions data: No valid route or sections found', data);
            }
        } catch (error) {
            console.error('Error fetching directions:', error);
        }
    };
    
    const displayRoute = (routePath) => {
        if (!routePath || routePath.length === 0) {
            console.error('Invalid directions data: No route path found');
            return;
        }
        
        // 기존 경로 삭제 (새 경로 표시 전에)
        if (window.currentPolyline) {
            window.currentPolyline.setMap(null);
        }
    
        // 새로운 경로 표시
        const polyline = new kakao.maps.Polyline({
            path: routePath.map(point => new kakao.maps.LatLng(point[1], point[0])),
            strokeWeight: 5,
            strokeColor: '#FF0000',
            strokeOpacity: 1,
            strokeStyle: 'solid'
        });
        
        polyline.setMap(map);
        
        // 경로를 전역 변수로 설정 (다음 경로 표시 시 삭제할 수 있도록)
        window.currentPolyline = polyline;
        
        // 경로의 범위에 맞춰 지도 bounds 설정
        const bounds = new kakao.maps.LatLngBounds();
        routePath.forEach(point => bounds.extend(new kakao.maps.LatLng(point[1], point[0])));
        map.setBounds(bounds);
    };
    
    
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