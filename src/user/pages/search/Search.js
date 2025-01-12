import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../common/header/css/reset.css';
import style from './css/search.module.css';
import search from '../main/image/Search.png';

function Search() {
  const [searchTerm, setSearchTerm] = useState(''); // 검색어
  const [storeList, setStoreList] = useState([]); // 검색된 가게 목록
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem('recentSearches')) || []
  ); // 최근 검색어
  const [popularSearches, setPopularSearches] = useState([ // 실시간 인기 검색어
    
  ]);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  // 검색어 입력 시 자동완성 리스트 업데이트
  const updateSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const searchStores = (storeName) => {
    setIsLoading(true); // 로딩 시작
    axios.get(`/api/store/search?name=${storeName}`)
      .then((response) => {
        setStoreList(response.data); // 검색된 가게 목록을 상태에 저장
        setIsLoading(false); // 로딩 종료
      })
      .catch((error) => {
        console.error('검색 오류:', error);
        setIsLoading(false); // 로딩 종료
      });
  };

  // 최근 검색어 처리
  const handleSearch = () => {
    if (searchTerm && !recentSearches.includes(searchTerm)) {
      const updatedRecentSearches = [searchTerm, ...recentSearches].slice(0, 5); // 최근 5개만 저장
      setRecentSearches(updatedRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecentSearches)); // 로컬 스토리지에 저장
    }

    // 검색 실행
    searchStores(searchTerm);
  };

  // 엔터키나 서치 아이콘 클릭 시 검색 처리
  const handleSearchTrigger = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      handleSearch();
    }
  };

  useEffect(() => {
    // 실시간 인기 검색어 API 호출 예시
    axios
      .get('/api/popular-searches')
      .then((response) => {
        setPopularSearches(response.data);
      })
      .catch((error) => {
        console.error('Error fetching popular searches:', error);
      });
  }, []);

  return (
    <div id={style.search}>
      <div className={style.input}>
        <div>
          <input
            className={style.dlsvnt}
            type="search"
            value={searchTerm}
            onChange={updateSearch}
            onKeyDown={handleSearchTrigger}
            placeholder="검색어를 입력하세요"
          />
          <img
            src={search}
            alt="search"
            onClick={handleSearchTrigger}
          />
        </div>

        <p>최근 검색어</p>
        <div className={style.boxs}>
          {recentSearches.map((term, index) => (
            <span key={index}>{term}</span>
          ))}
        </div>

        <p>실시간 인기 검색어</p>
        <div className={style.boxs}>
          {popularSearches.map((term, index) => (
            <span key={index}>{term}</span>
          ))}
        </div>

        <div className={style.dlsrl}></div>
      </div>

      <div className={style.storeList}>
        {isLoading ? (
          <p>로딩 중...</p>
        ) : storeList.length > 0 ? (
          storeList.map((store) => (
            <div key={store.STORE_NO} className={style.storeItem}>
              <p>{store.STORE_NAME}</p>
              <p>{store.STORE_ADDRESS}</p>
              <p>{store.STORE_DES}</p>
            </div>
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default Search;
