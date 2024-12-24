import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import { useState, useEffect } from 'react';
import marMarker from '../images/smallMapMarker-logo.png';

function KakaoMap(){
    const [ storeLatitude, setStoreLatitude ] = useState("")
    const [ storeLongitude, setStoreLongitude ] = useState("")
    const [ storeName, setStoreName ] = useState("")

    const mapLink  = `https://map.kakao.com/link/map/${storeName},${storeLatitude},${storeLongitude}`

    useEffect(() => {
        fetch('/store/test')
        .then(res => res.json())
        .then(data => {
            setStoreLatitude(data.latitude);
            setStoreLongitude(data.longitude);
            setStoreName(data.storeName);
        });
    }, [])
    
    return(
        <>
            <Map
                // 지도로 보여줄 위치 지정(위도, 경도)
                center={{ lat : storeLatitude, lng : storeLongitude}}
                // 지도 스타일 적용
                style = {{
                    position : 'absolute',
                    left : '1064px',
                    top : '585px',
                    width: '698px',
                    height : '352px',
                    border : '7.21px solid #FFA8B8',
                    borderRadius : '36px'
                }}
                level={3}
            >
                <MapMarker 
                    //  핀 찍힐 위치 지정
                    style={{ border : 'transparent' }}
                    position={{ lat : storeLatitude, lng : storeLongitude }}
                    // 마커 커시텀할 이미지 주소 및 스타일 적용
                    image={{ 
                        src : marMarker,
                        size : {
                            width : 64,
                            height : 85
                        },
                        // 마커의 포인터가 놓일 위치
                        // 마커의 크기가 width : 64, height : 85일 경우 
                        // 포인터의 위치는 width의 중간, height의 끝에 와야하기에 다음과 같이 적용
                        options : {
                            offset : {
                                x : 32,
                                y : 85,
                            },
                        },
                        }}
                >
                    <CustomOverlayMap
                        position={{ lat : storeLatitude, lng : storeLongitude}}
                        yAnchor={2.5}
                    >
                        <div className="customoverlay"
                                style = {{
                                color : '#323232',
                                fontFamily : 'Pretendard Variable',
                                fontSize : '17px',
                                fontStyle : 'Regular',
                                fontWeight : 600,
                                display : "block",
                                flexDirection : "column",
                                border : '2px solid #323232',
                                borderRadius : '36px',
                                backgroundColor : '#FFFFFF',
                                padding : 10,
                                textAlign : 'center'
                                }}   
                        >
                            <div>
                                {storeName}
                            </div>
                            <div>
                                <a
                                    href= {mapLink}
                                    style={{
                                        color : '#007AFF',
                                        fontFamily : 'Pretendard Variable',
                                        fontSize : '15px',
                                        fontStyle : 'Regular',
                                        border : 'none'
                                    }}
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
                                    style={{
                                        color : '#007AFF',
                                        fontFamily : 'Pretendard Variable',
                                        fontSize : '15px',
                                        fontStyle : 'Regular',
                                    }}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                   &nbsp; 길찾기 &emsp;
                                </a>
                            </div>
                        </div>
                    </CustomOverlayMap>
                </MapMarker>
            </Map>
        </>
    );
}

export default KakaoMap;