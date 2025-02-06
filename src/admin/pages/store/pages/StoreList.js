import { useState, useEffect, useCallback, useMemo } from "react"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import styles from "../css/StoreList.module.css"
import "../css/reset.css"
import { StoreListAPI } from "../api/StoreListAPI"
import { fetchGraphData2 } from "../../dashboard/api/DashboardAPI"
import LodingPage from "../../../components/LoadingPage";

function StoreList(){
    const [list, setList] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchCategory, setSearchCategory] = useState("none");
    const [searchWord, setSearchWord] = useState("");
    const [searchSuccess, setSearchSuccess] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [graphData, setGraphData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

        const fetchGraphData = async () => {
            const data = await fetchGraphData2();
            const totalStoreCount = Object.values(data)[0];
            setGraphData(totalStoreCount);
        }

    const fetchList = useCallback(async (category, word) => {
        try{
            const storeList = await StoreListAPI(category, word);
            if (storeList && storeList.length > 0){
                setSearchSuccess(true)
                setList(storeList)
                setCurrentPage(1);
            }else{
                setSearchSuccess(false)
            }
        }catch(error){
            console.log("오류발생", error)
        }
    }, [])

    useEffect(()=>{
        fetchList(searchParams.get("category"), searchParams.get("word"));
        fetchGraphData();
        setIsLoading(false);
    },[searchParams, fetchList])

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItem = list.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = useMemo(() => Math.ceil(list.length / itemsPerPage), [list.length, itemsPerPage]);

    
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }
    
    const currentRangeStart = Math.floor((currentPage - 1) / 5) * 5 + 1;
    const currentRangeEnd = Math.min(currentRangeStart + 4, totalPages);

    const pageNumbersToDisplay = pageNumbers.slice(currentRangeStart - 1, currentRangeEnd);



    const paginate = useCallback((no) => {
        if(0<no && no<=totalPages){setCurrentPage(no)}
    },[totalPages]);

    function categoryChangeHandler(e){
        setSearchCategory(e.target.value)
    }

    function searchChangeHandler(e){
        setSearchWord(e.target.value)
    }

    function searchClickHandler(){
        const url = `?category=${searchCategory}&word=${searchWord}`;
        navigate(url);
    }

    function handlerStoreInfo(no){
        const url = `/admin/stores/info/${no}`;
        navigate(url)
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchClickHandler();
        }
    }

    if (isLoading) {
        return <LodingPage />;
    }

    return(
    <>
        <div className={styles.storeListText}>가게리스트</div>
        <div className={styles.totalStoreCount}>총 {graphData}개의 가게가 등록되어 있습니다.</div>
        <select className={styles.storeListSelection} onChange={categoryChangeHandler}>
            <option className={styles.storeListOption} value="none" selected>검색 기준</option>
            <option className={styles.storeListOption} value="CATEGORY_NAME">카테고리</option>
            <option className={styles.storeListOption} value="STORE_NAME">가게이름</option>
            <option className={styles.storeListOption} value="STORE_ADDRESS">가게위치</option>
            <option className={styles.storeListOption} value="STORE_REGIST_DATE">가게등록일</option>
        </select>   
        <input 
            type="text" 
            className={styles.storeListSearchInput} 
            value={searchWord} 
            onChange={searchChangeHandler}
            onKeyPress={handleKeyPress}
            placeholder="검색어를 입력해주세요"
        ></input>
        <button type="button" onClick={searchClickHandler} className={styles.storeListSearchBtn}/>
        <table className={styles.storeList}>
            <thead className={styles.storeListHeader}>
                <tr>
                    <th style={{width: '300px'}}>카테고리</th>
                    <th style={{width: '400px'}}>가게이름</th>
                    <th style={{width: '508px'}}>가게위치</th>
                    <th style={{width: '281px'}}>가게등록일</th>
                </tr>
            </thead>
        </table>
        <div id={styles.storeListBodyPosition}>
            {searchSuccess? currentItem.map((item, index)=>{ 
                return <div className={styles.storeListBody}>
                    <div key={index} value={item.storeNo} onClick={()=>handlerStoreInfo(item.storeNo)}>
                        <div style={{width: '300px'}}>{item.storeCategory}</div>
                        <div style={{width: '400px'}}>{item.storeName}</div>
                        <div style={{width: '508px'}}>{item.storeAddress}</div>
                        <div style={{width: '281px'}}>{item.storeRegistDate}</div>
                    </div>
                </div>
            }) : <div className={styles.storeListBody}>해당 결과가 존재하지 않습니다.</div>
            }
        </div>

        <div className={styles.pageNation}>
            <div className={`${styles.pageNationBackBtn} ${currentPage === 1 ? styles.disabled : ''}`} onClick={() => paginate(currentPage - 1)} hidden={currentPage === 1}>◀</div>
            <div className={styles.pageNumArea}>
                {pageNumbersToDisplay.map((pageNum) => (
                    <div key={pageNum} onClick={() => paginate(pageNum)} className={`${styles.pageNumBtn} ${pageNum === currentPage ? styles.active : ''}`}>
                        {pageNum}
                    </div>
                ))}
                </div>
            <div className={`${styles.pageNationForwordBtn} ${currentPage === totalPages? styles.disabled : ''}`} onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>▶</div>
            </div>
        <button id={styles.storeUserRegist} type="button" onClick={()=>navigate('/admin/stores/regist/user')}>가게 등록하기</button>
    </>
    )   
}

export default StoreList; 