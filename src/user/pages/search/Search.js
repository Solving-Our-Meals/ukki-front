import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../common/header/css/reset.css';
import style from './css/search.module.css';
import search from '../main/image/Search.png';
import Profile from '../storedetail/components/Profile';
import Footer from './components/Footer';
import { API_BASE_URL } from '../../../config/api.config';


function Search() {
  const {storeNo} = useParams();
  const [searchTerm, setSearchTerm] = useState(''); // 검색어
  const [storeList, setStoreList] = useState([]); // 검색된 가게 목록
  const navigate = useNavigate();

  const [recentSearches, setRecentSearches] = useState([]); // 최근 검색어
  const footerRef = useRef(null);
  // 최근 검색어 로드
  useEffect(() => {
    const storedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    setRecentSearches(storedSearches);
  }, []); 
  
  // 최근 검색어
  const [popularSearches, setPopularSearches] = useState([]); // 실시간 인기 검색어
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  // 검색 함수
  const searchStores = (storeName) => {
    const trimmedName = storeName.trim();

    if (!trimmedName) {
      setStoreList([]);
      return;
    }

    setIsLoading(true); // 로딩 시작

    // 검색어 인코딩
    const encodedName = encodeURIComponent(trimmedName);

    // 수정된 URL 경로 (storeName을 쿼리 파라미터로 전달)
    axios.get(`${API_BASE_URL}/store/search?name=${encodedName}`)
      .then((response) => {
        if (response.data && response.data.length) {
          setStoreList(response.data); // 검색된 가게 목록을 상태에 저장
        } else {
          setStoreList([]); // 검색 결과가 없을 경우 빈 배열 설정
        }
        setIsLoading(false); // 로딩 종료
      })
      .catch((error) => {
        console.error('검색 오류:', error);
        setIsLoading(false); // 로딩 종료
      });
  };

  // 검색어 입력 시 자동완성 리스트 업데이트
const updateSearch = (e) => {
  const value = e.target.value;
  setSearchTerm(value);

  if (value.trim()) {
      // 부분 검색어로 실시간 검색 결과를 업데이트
      searchStores(value);
  } else {
      setStoreList([]); // 검색어가 비어있으면 결과를 초기화
  }
};

// 검색 함수
const handleSearch = () => {
  const trimmedSearchTerm = searchTerm.trim();

  // 검색어가 완전하게 입력된 경우에만 처리
  if (trimmedSearchTerm && !recentSearches.includes(trimmedSearchTerm)) {
      // 최근 5개의 검색어만 저장
      const updatedRecentSearches = [trimmedSearchTerm, ...recentSearches].slice(0, 5); 
      setRecentSearches(updatedRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecentSearches)); // 로컬 스토리지에 저장

      // 서버에 검색어 기록 (완전한 검색어만 기록)
      axios.post(`${API_BASE_URL}/store/insertOrUpdateSearch`, { storeName: trimmedSearchTerm })
          .then(() => {
              // 인기 검색어 갱신 후 다시 가져오기
              fetchPopularSearches();
          })
          .catch((error) => {
              console.error('검색어 기록 오류:', error);
          });
  }
};


// 실시간 인기 검색어 API 호출
const fetchPopularSearches = () => {
  setIsLoading(true); // 데이터를 가져오기 전에 로딩 상태 설정
  axios
    .get(`${API_BASE_URL}/store/popular-searches`)
    .then((response) => {
      console.log('Popular Search Response:', response.data); // 응답 데이터 확인
      if (Array.isArray(response.data)) {
        const filteredSearches = response.data.filter((search) => {
          return search.length >= 2;  // 2자 이상인 검색어만 필터링 (부분 검색어 제외)
        });
        setPopularSearches(filteredSearches); // 필터링된 인기 검색어 상태 업데이트
      } else {
        console.error("Invalid data format for popular searches:", response.data);
      }
      setIsLoading(false); // 로딩 종료
    })
    .catch((error) => {
      console.error('Error fetching popular searches:', error);
      setIsLoading(false); // 로딩 종료
    });
};

  useEffect(() => {
    fetchPopularSearches();  // 컴포넌트가 마운트될 때 인기 검색어 불러오기
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();  // 엔터키 눌렀을 때 검색어 처리
    }
  };


    // 예약하기 버튼 클릭 시 해당 storeNo 페이지로 이동
    const handleReservation = (storeNo) => {
      navigate(`/store/${storeNo}`); // storeNo에 해당하는 페이지로 이동
    };


    const handleRecentSearch = (term) => {
      setSearchTerm(term); // 검색어 상태 업데이트
      searchStores(term);   // 해당 검색어로 검색 실행
    };


  // Footer의 위치를 조정하는 함수
  const adjustFooterPosition = () => {
    if (footerRef.current) {
      const storeListElement = document.getElementById(style.storeList);
      if (storeListElement && storeListElement.children.length > 1) {
        // const storeListAreaBottom = storeListElement.getBoundingClientRect().bottom;
        const footerTop = window.scrollY + 450

        footerRef.current.style.top = `${footerTop}px`;
      } else {
        footerRef.current.style.top = `${window.innerHeight - footerRef.current.offsetHeight + 200}px`; // 기본 위치에서 10px 높이 조정
      }
    } else {
      footerRef.current.style.top = `${window.innerHeight - footerRef.current.offsetHeight}px`
    }
  };


  useEffect(() => {
    // 컴포넌트가 마운트되거나 리뷰가 업데이트 될 때 Footer 위치 조정
    adjustFooterPosition();
    window.addEventListener('resize', adjustFooterPosition); // 창 크기 조정 시 Footer 위치 조정

    return () => {
      window.removeEventListener('resize', adjustFooterPosition) // 이벤트 리스너 정리                
    }
  }, [storeList])

  return (
    <>
      <div id={style.search}>
        <div className={style.input}>
          <div>
            <input
              className={style.dlsvnt}
              type="search"
              value={searchTerm}
              onChange={updateSearch}
              onKeyPress={handleKeyPress}  // 엔터키 눌렀을 때 검색 처리
              placeholder="검색어를 입력하세요"
            />
            <img
              src={search}
              alt="search"
              onClick={handleSearch}  // 아이콘 클릭 시 검색 처리
            />
          </div>

          <p>최근 검색어</p>
          <div className={style.boxs}>
            {recentSearches.map((term, index) => (
              <span key={term + index} onClick={() => handleRecentSearch(term)}>{term}</span>
            ))}
          </div>

          <p>실시간 인기 검색어</p>
          <div className={style.box}>
            {popularSearches.length > 0 ? (
              popularSearches.map((search, index) => (
                <span key={index}>{index + 1 + '. '}{search}</span> // 바로 문자열을 출력
              ))
            ) : (
              <p></p>
            )}
          </div>

          <div className={style.dlsrl}>

          </div>
          <div></div>
        </div>

        <div className={style.storeList}>
          {storeList.length > 0 ? (
            storeList.map((store) => (
              <div key={store.storeNo}>
                <Profile storeNo={store.storeNo} />
                <h3>{store.storeName}</h3>
                <p>{store.storeAddress}</p>
                <p>{store.storeDes}</p>
                <button onClick={() => handleReservation(store.storeNo)}>예약하기</button>

                <span>가게 키워드</span>
                {store.storeKeyword && (
                  <div>
                    {Object.values(store.storeKeyword).map((keyword, index) => (
                      keyword !== 0 && <span key={index}>{keyword}</span>
                    ))}
                  </div>
                )}
                F
                <hr />
              </div>
            ))
          ) : (
            <h3 className={style.no}>"검색결과가 없습니다."</h3>
          )}
        </div>

      </div>

      <Footer ref={footerRef} />
    </>
  );
}

export default Search;