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

  useEffect(() => {
    const storedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    setRecentSearches(storedSearches);
  }, []); 
  
  const [popularSearches, setPopularSearches] = useState([]); // 실시간 인기 검색어
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  const updateSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      searchStores(value);
    } else {
      setStoreList([]);
    }
  };

  const searchStores = (storeName) => {
    const trimmedName = storeName.trim();

    if (!trimmedName) {
      setStoreList([]);
      return;
    }

    setIsLoading(true);
    const encodedName = encodeURIComponent(trimmedName);

    axios.get(`${API_BASE_URL}/store/search?name=${encodedName}`)
      .then((response) => {
        if (response.data && response.data.length) {
          setStoreList(response.data);
        } else {
          setStoreList([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('검색 오류:', error);
        setIsLoading(false);
      });
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      if (!recentSearches.includes(searchTerm)) {
        const updatedRecentSearches = [searchTerm, ...recentSearches].slice(0, 5);
        setRecentSearches(updatedRecentSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedRecentSearches));
      }

      axios.post(`${API_BASE_URL}/store/insertOrUpdateSearch`, { storeName: searchTerm })
        .then(() => {
          fetchPopularSearches();
        })
        .catch((error) => {
          console.error('검색어 기록 오류:', error);
        });
    }
  };

  const fetchPopularSearches = () => {
    setIsLoading(true);
    axios
      .get(`${API_BASE_URL}/store/popular-searches`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setPopularSearches(response.data);
        } else {
          console.error("Invalid data format for popular searches:", response.data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching popular searches:', error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPopularSearches();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReservation = (storeNo) => {
    navigate(`/store/${storeNo}`);
  };

  const handleRecentSearch = (term) => {
    setSearchTerm(term);
    searchStores(term);
  };

  const adjustFooterPosition = () => {
    if (footerRef.current) {
      const storeListElement = document.getElementById(style.storeList);
      if (storeListElement && storeListElement.children.length > 1) {
        const footerTop = window.scrollY + 450;
        footerRef.current.style.top = `${footerTop}px`;
      } else {
        footerRef.current.style.top = `${window.innerHeight - footerRef.current.offsetHeight + 200}px`;
      }
    } else {
      footerRef.current.style.top = `${window.innerHeight - footerRef.current.offsetHeight}px`;
    }
  };

  useEffect(() => {
    adjustFooterPosition();
    window.addEventListener('resize', adjustFooterPosition);

    return () => {
      window.removeEventListener('resize', adjustFooterPosition);
    }
  }, [storeList]);

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
              onKeyPress={handleKeyPress}
              placeholder="검색어를 입력하세요"
            />
            <img
              src={search}
              alt="search"
              onClick={handleSearch}
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
                <span key={index}>{index + 1 + '. '}{search}</span>
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
