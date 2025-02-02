import React, { useEffect, useState, useRef } from 'react';
import './Map.css';
import loMarker from '../image/marker.png';
import { API_BASE_URL } from '../../../../config/api.config';

const { kakao } = window;

const KAKAO_API_KEY = window._env_?.REACT_APP_KAKAOMAP_APP_KEY || process.env.REACT_APP_KAKAOMAP_APP_KEY;
const KAKAO_REST_API_KEY = window._env_?.REACT_APP_KAKAOMAP_REST_API_KEY || process.env.REACT_APP_KAKAOMAP_REST_API_KEY;

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
    const [storeAddress, setStoreAddress] = useState('');



    useEffect(() => {
        if (map && currentPosition) {
            const newLatLng = new kakao.maps.LatLng(currentPosition.y, currentPosition.x);
            map.setCenter(newLatLng); // 지도 중심을 현재 위치로 이동

            // 이전 위치 마커 제거
            if (currentMarker.marker) {
                currentMarker.marker.setMap(null); // 기존 마커 제거
                currentMarker.infowindow.close();  // 기존 인포윈도우 닫기
            }

            // 기존 경로가 있으면 삭제
            if (window.currentPolyline) {
                window.currentPolyline.setMap(null);  // 경로 삭제
                window.currentPolyline = null;        // 글로벌 변수 초기화
            }

            // 새로운 위치 마커 표시
            const message = '<div style="padding:3px; padding-left:40px; height:1.5vw; font-weight:700; color:#FF8AA3;">현재 위치</div>';
            displayMarker(newLatLng, message, map);
        }
    }, [currentPosition, map]);

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
    }, [map, address, defaultValue]); // address가 변경될 때마다 호출


    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            // 사용자가 엔터를 눌렀을 때
            updateLocationAndRoute(defaultValue); // 주소 업데이트하고 경로 새로 그리기
        }
    };

    const updateLocationAndRoute = async (newAddress) => {
        // 새로운 주소를 좌표로 변환

        if (currentMarker.marker) {
            currentMarker.marker.setMap(null); // 기존 마커 제거
            currentMarker.infowindow.close();  // 기존 인포윈도우 닫기
        }

        // 기존 경로가 있으면 삭제
        if (window.currentPolyline) {
            window.currentPolyline.setMap(null);  // 경로 삭제
            window.currentPolyline = null;        // 글로벌 변수 초기화
        }
        const geocoder = new kakao.maps.services.Geocoder();

        geocoder.addressSearch(newAddress, function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                // 주소를 위도/경도로 변환


                if (currentMarker.marker) {
                    currentMarker.marker.setMap(null); // 기존 마커 제거
                    currentMarker.infowindow.close();  // 기존 인포윈도우 닫기
                }

                // 기존 경로가 있으면 삭제
                if (window.currentPolyline) {
                    window.currentPolyline.setMap(null);  // 경로 삭제
                    window.currentPolyline = null;        // 글로벌 변수 초기화
                }
                const newLatLng = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 지도 중심을 새 위치로 업데이트
                if (map) {
                    map.setCenter(newLatLng);
                }

                // 현재 위치와 가게 위치 사이 경로를 요청
                if (currentPosition) {
                    requestDirections(newLatLng); // 경로 요청
                }
                // 입력한 주소를 state로 저장
                setStoreAddress(newAddress);

                // 해당 위치에 마커 표시
                const message = '<div style="padding:3px; padding-left:40px; height:1.5vw; font-weight:700; color:#FF8AA3;">입력한 주소</div>';
                displayMarker(newLatLng, message, map);
            } else {
                alert("주소를 찾을 수 없습니다.");
            }
        });
    };

    useEffect(() => {
        if (selectedCategory) {
            fetch(`${API_BASE_URL}/main/category?category=${selectedCategory}`)
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
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&libraries=services`;
        script.async = true;
        script.onload = () => {
            const mapContainer = document.getElementById('map');
            const mapOption = {
                center: new kakao.maps.LatLng(37.563322, 127.192546),
                level: 3
            };

            const kakaoMap = new kakao.maps.Map(mapContainer, mapOption);
            setMap(kakaoMap); // 상태 업데이트
        };
        document.head.appendChild(script);
    }, []);  // map을 의존성 배열에서 제거

    useEffect(() => {
        if (map && navigator.geolocation) {
            const geoWatcher = navigator.geolocation.watchPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;


                    if (currentMarker.marker) {
                        currentMarker.marker.setMap(null); // 기존 마커 제거
                        currentMarker.infowindow.close();  // 기존 인포윈도우 닫기
                    }

                    // 기존 경로가 있으면 삭제
                    if (window.currentPolyline) {
                        window.currentPolyline.setMap(null);  // 경로 삭제
                        window.currentPolyline = null;        // 글로벌 변수 초기화
                    }

                    const locPosition = new kakao.maps.LatLng(lat, lon);
                    const message = '<div style="padding:3px; padding-left:40px; height:1.5vw; font-weight:700; color:#FF8AA3;">현재 위치</div>';

                    // 위치 마커 표시
                    displayMarker(locPosition, message, map);
                    setCurrentPosition({ x: lon, y: lat }); // 사용자 현재 위치 설정

                    // 지도 중심을 현재 위치로 설정
                    map.setCenter(locPosition);

                    // 주소 변환
                    const geocoder = new kakao.maps.services.Geocoder();
                    geocoder.coord2Address(lat, lon, (result, status) => {
                        if (status === kakao.maps.services.Status.OK) {
                            const address = result[0].road_address
                                ? result[0].road_address.address_name
                                : result[0].address.address_name;
                            if (address !== defaultValue) {
                                setAddress(address);
                                console.log("주소가 변경되었습니다: ", address);
                            }
                        }
                    });
                },
                (error) => {
                    console.error("위치 정보 가져오기 실패: ", error);
                },
                {
                    enableHighAccuracy: true, // 위치 정확도 높이기
                    maximumAge: 0, // 오래된 위치 정보는 사용하지 않음
                    timeout: 5000, // 타임아웃 시간
                }
            );

            // 컴포넌트가 언마운트 될 때 위치 추적을 중지
            return () => {
                navigator.geolocation.clearWatch(geoWatcher);
            };
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
                    onMarkerClick(store.storeName, store.storeDes, store.storeMenu, store.storeProfile, store.storeAddress, store.storeNo);
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
                'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}`,
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
            console.error('유효하지 않은 경로 데이터');
            return;
        }

        // 기존 경로 삭제
        if (window.currentPolyline) {
            window.currentPolyline.setMap(null);
        }

        // 새 경로 표시
        const polyline = new kakao.maps.Polyline({
            path: routePath.map(point => new kakao.maps.LatLng(point[1], point[0])),
            strokeWeight: 5,
            strokeColor: '#FF0000',
            strokeOpacity: 1,
            strokeStyle: 'solid'
        });

        polyline.setMap(map);
        window.currentPolyline = polyline;

        const bounds = new kakao.maps.LatLngBounds();
        routePath.forEach(point => bounds.extend(new kakao.maps.LatLng(point[1], point[0])));
        map.setBounds(bounds);
    };



    function displayMarker(locPosition, message, mapInstance) {
        if (!mapInstance) return;

        if (currentMarker.marker) {
            currentMarker.marker.setMap(null); // 기존 마커 제거
            currentMarker.infowindow.close();  // 기존 인포윈도우 닫기
        }

        // 기존 경로가 있으면 삭제
        if (window.currentPolyline) {
            window.currentPolyline.setMap(null);  // 경로 삭제
            window.currentPolyline = null;        // 글로벌 변수 초기화
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