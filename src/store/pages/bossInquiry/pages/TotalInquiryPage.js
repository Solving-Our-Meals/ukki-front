import { useState, useEffect } from 'react';
import { useSearchParams, useOutletContext, useNavigate} from 'react-router-dom';
import styles from '../css/totalInquiryPage.module.css';
import searchBtn from '../images/searchBtn.png';
import { API_BASE_URL } from '../../../../config/api.config';
import { useError } from '../../../../common/error/components/ErrorContext';
import loadingGif from '../../../../common/inquiry/img/loadingInquiryList.gif';


function TotalInquiryPage(){

    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { setGlobalError } = useError();

    const {storeNo} = useOutletContext();
    const {userNo} = useOutletContext();

    const [currentPage, setCurrentPage] = useState(1); 
    const [currentPageGroup, setCurrentPageGroup] = useState(1);

    const [searchWord, setSearchWord] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const [inquiries, setInquiries] = useState([]);
    const [recentInquiry, setRecentInquiry] = useState({});

    const itemsPerPage = 7; 
    const pagesPerGroup = 5;

    const totalPages = Math.ceil(inquiries.length / itemsPerPage);
    const totalGroups = Math.ceil(totalPages / pagesPerGroup);
    
    const startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
    const endPage = Math.min(currentPageGroup * pagesPerGroup, totalPages);

    const currentItems = inquiries.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage 
    );
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevGroup = () => {
        if (currentPage > 1) { 
            if ((currentPage - 1) % pagesPerGroup === 0) {
                setCurrentPageGroup(prev => prev - 1);  
            }
            setCurrentPage(currentPage - 1); 
        }
    };

    const handleNextGroup = () => {
        if (currentPage < totalPages) {  
            if (currentPage % pagesPerGroup === 0) {
                setCurrentPageGroup(prev => prev + 1);  
            }
            setCurrentPage(currentPage + 1);
        }
    };

    useEffect(() => {
        fetch(`${API_BASE_URL}/boss/mypage/recentInquiry?storeNo=${storeNo}&userNo=${userNo}`,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials:"include",
        })
        .then(response => {
            if (!response.ok) {
                const error = new Error(`HTTP error! status: ${response.status}`);
                error.status = response.status;
                throw error;
            }
            // 비어 있는 응답 대비
            if(response.status === 204) {
                return [];
            }
            return response.json();
        })
        .then(data => {
            setRecentInquiry(data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error(error);
            setGlobalError(error.message, error.status);

            // 네비게이션 처리: 에러 상태에 맞는 페이지로 리디렉션
            if (error.status === 404) {
                navigate('/404');
            } else if (error.status === 403) {
                navigate('/403');
            } else if(error.status === 500) {
                navigate('/500');
            } else {
                console.log('error : ', error)
            }
            setIsLoading(false);
        });
    }, [setGlobalError, inquiries]);


    useEffect(() => {
        const searchQuery = searchParams.get("searchWord") || "";
        setSearchWord(searchQuery);
        sendSearchWordHandler(searchQuery);
    }, [searchParams]);

    const keyPressHandler = (e) => {
        if(e.key === 'Enter'){
            sendSearchWordHandler(searchWord);
            setSearchParams({ searchWord });
        }
    };

    const sendSearchWordHandler = (searchTerm = "") => {
        const term = typeof searchTerm === 'string' ? searchTerm : "";
        const url = searchTerm.trim() === "" ? `${API_BASE_URL}/boss/mypage/inquiryList?storeNo=${storeNo}&userNo=${userNo}` : `${API_BASE_URL}/boss/mypage/inquiryList?storeNo=${storeNo}&userNo=${userNo}&searchWord=${searchTerm}`;

        fetch(url,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
        })
        .then(response => {
            if (!response.ok) {
                const error = new Error(`HTTP error! status: ${response.status}`);
                error.status = response.status;
                throw error;
            }
            return response.json();
        })
        .then(data => {
            setInquiries(Array.isArray(data) ? data : []);
            console.log('문의 내역 : ', data);
        })
        .catch(error => {
            console.error(error);
            setGlobalError(error.message, error.status);

            // 네비게이션 처리: 에러 상태에 맞는 페이지로 리디렉션
            if (error.status === 404) {
                navigate('/404');
            } else if (error.status === 403) {
                navigate('/403');
            } else {
                navigate('/500');
            }
        })
    };

    const navigateToSpecificInquiry = (inquiryNo, categoryNo) => {
        console.log('recentInquiry', recentInquiry);
        navigate(`/boss/inquiry/${inquiryNo}?categoryNo=${categoryNo}`);
    }

    // 추가 부분 - 최근 문의 내역 로직
    let recentCategoryName = "";
    switch(recentInquiry.categoryNo){
        case 1 : recentCategoryName = '리뷰문의'; break;
        case 2 : recentCategoryName = '예약문의'; break;
        case 3 : recentCategoryName = '회원문의'; break;
        case 4 : recentCategoryName = '일반문의'; break;
        case 5 : recentCategoryName = '예약문의'; break;
        case 6 : recentCategoryName = '수정문의'; break;
        case 7 : recentCategoryName = '일반문의'; break;
        case 0 : recentCategoryName = '리뷰신고'; break;
    }

    let recentState = "";
    switch(recentInquiry.state){
        case "COMPLETE" : recentState = "[처리완료]"; break;
        case "CHECK" : recentState = "[읽음]"; break;
        case "확인" : recentState = "[읽음]"; break;
        case "PROCESSING" : recentState = "[처리중]"; break;
        case "처리중" : recentState = "[처리중]"; break;
    }   

    if(isLoading){
        // 로딩 상태일 때 로딩 화면을 표시
        return(
            <div className={styles.loadingContainer}>
                <img src={loadingGif} alt='로딩 중' className={styles.loadingImg} />
                <p>Loading...</p>
            </div>
        )
    }

    return(
        <>
            <div id={styles.background}>
            <div
                id={styles.recentInquiry}
                onClick={Object.keys(recentInquiry).length > 0 ? () => navigateToSpecificInquiry(recentInquiry.inquiryNo, recentInquiry.categoryNo) : null}
                style={{ pointerEvents: Object.keys(recentInquiry).length > 0 ? 'auto' : 'none' }} // 클릭 방지 수정
            >
                    <span>최근 문의</span>
                    <span id={styles.recentState}>{recentState}</span>
                    <span id={styles.recentCategory}>{recentCategoryName}</span>
                    <span id={styles.recentTitle}>{recentInquiry.inquiryTitle}</span>
                </div>
                <div id={styles.strInquiry}>문의 내역</div>
                <input 
                    id={styles.inputSearch} 
                    name='searchWord' 
                    type='text' 
                    placeholder='검색할 내용을 입력해주세요.' 
                    value={searchWord}
                    onChange={(e) => setSearchWord(e.target.value)}
                    onKeyPress={(e) => keyPressHandler(e)}
                />
                <img 
                    src={searchBtn} 
                    id={styles.searchBtn}
                    onClick={() => { 
                        sendSearchWordHandler(searchWord); 
                        setSearchParams({ searchWord }); 
                    }}
                />
                <div className={styles.inquiryListArea}>
                    <div className={styles.strArea}>
                        <div id={styles.strState}>문의 상태</div>
                        <div id={styles.strCategory}>카테고리</div>
                        <div id={styles.strTitle}>제목</div>
                        <div id={styles.strDate}>일자</div>
                    </div>
                    <div className={styles.inquiryContainer}>
                        {currentItems.length > 0 ? (
                            currentItems.map((inquiry, index) => {
                                let categoryName = "";
                                switch(inquiry.categoryNo){
                                    case 1 : categoryName = '리뷰문의'; break;
                                    case 2 : categoryName = '예약문의'; break;
                                    case 3 : categoryName = '회원문의'; break;
                                    case 4 : categoryName = '일반문의'; break;
                                    case 5 : categoryName = '예약문의'; break;
                                    case 6 : categoryName = '수정문의'; break;
                                    case 7 : categoryName = '일반문의'; break;
                                    case 0 : categoryName = '리뷰신고'; break;
                                }

                                let state = "";
                                switch(inquiry.state){
                                    case "COMPLETE" : state = "처리완료"; break;
                                    case "CHECK" : state = "읽음"; break;
                                    case "확인" : state = "읽음"; break;
                                    case "PROCESSING" : state = "처리중"; break;
                                    case "처리중" : state = "처리중"; break;
                                }
                                return(
                                    <div
                                        key={index}
                                        className={styles.inquiry}
                                        style={{ border : (index + 1) % 7 === 0 ? "none" : ""}}
                                        onClick={() => navigateToSpecificInquiry(inquiry.inquiryNo, inquiry.categoryNo)}
                                    >
                                        <span id={styles.inquiryState}>[{state}]</span>
                                        <span id={styles.categoryName}>{categoryName}</span>
                                        <span id={styles.inquiryTitle}>{inquiry.inquiryTitle}</span>
                                        <span id={styles.inquiryDate}>{inquiry.inquiryDate}</span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className={styles.noResultsMessage}>문의 내역이 존재하지 않습니다.</div>
                        )}
                        </div>
                    <hr/>
                    <div className={styles.pagination}>
                        <div
                            className={`${styles.paginationButton} ${styles.arrow} ${currentPage === 1 ? styles.disabled : ''}`}
                            onClick={() => handlePrevGroup()}
                        >
                            ◀
                        </div>
                        {Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i).map(pageNum => (
                            <div
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`${styles.paginationButton} ${currentPage === pageNum ? styles.active : ''}`}
                            >
                                {pageNum}
                            </div>
                        ))}    
                        <div
                            className={`${styles.paginationButton} ${styles.arrow} ${currentPage === totalPages || totalPages === 0 ? styles.disabled : ''}`}
                            onClick={() => handleNextGroup()}
                        >
                            ▶
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TotalInquiryPage;