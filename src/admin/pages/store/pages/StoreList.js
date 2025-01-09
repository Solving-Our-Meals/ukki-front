import { useState, useEffect, useCallback, useMemo } from "react"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import styles from "../css/StoreList.module.css"
import "../css/reset.css"
import { StoreListAPI } from "../api/StoreListAPI"

function StoreList(){
    const [list, setList] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchCategory, setSearchCategory] = useState("none");
    const [searchWord, setSearchWord] = useState("");
    const [searchSuccess, setSearchSuccess] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const fetchList = useCallback(async (category, word) => {
        try{
            const storeList = await StoreListAPI(category, word);
            if (storeList && storeList.length > 0){
                setSearchSuccess(true)
                setList(storeList)
            }else{
                setSearchSuccess(false)
            }
        }catch(error){
            console.log("오류발생", error)
        }
    }, [])

    useEffect(()=>{
        fetchList(searchParams.get("category"), searchParams.get("word"));
    },[searchParams, fetchList])

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItem = useMemo(()=> {
        return list.slice(indexOfFirstItem, indexOfLastItem)
    },[list, indexOfFirstItem, indexOfLastItem]);

    const totalPages = useMemo(()=>
        Math.ceil(list.length/itemsPerPage)
    ,[list.length, itemsPerPage]);

    const visiblePageNum = useCallback(()=>{
        let startPage = Math.max(currentPage-2, 1);
        let endPage = Math.min(currentPage+2, totalPages);

        if(currentPage === 1){
            endPage = Math.min(5, totalPages);
        }else if(currentPage === 2){
            endPage = Math.min(5, totalPages);
        }else if(currentPage===totalPages-1){
            startPage = Math.max(totalPages-4, 1)
        }else if(currentPage===totalPages){
            startPage = Math.max(totalPages-4, 1)
        }

        let pageNumbers = []
        for(var i = startPage; i <= endPage; i++){
            pageNumbers.push(i)
        }
        return pageNumbers;
    },[currentPage, totalPages])

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

    return(
    <>
        <div className={styles.storeListText}>가게리스트</div>
        <select className={styles.storeListSelection} onChange={categoryChangeHandler}>
            <option className={styles.storeListOption} value="none" selected>검색 기준</option>
            <option className={styles.storeListOption} value="CATEGORY">카테고리</option>
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
            <button onClick={()=>paginate(currentPage-1)} disabled={currentPage === 1}>◀</button>
            {visiblePageNum().map((pageNum)=>(
                <button key={pageNum} onClick={() => paginate(pageNum)}
                className={pageNum === currentPage ? styles.active :''}>
                    {pageNum}
                </button>
            ))}
            <button onClick={()=>paginate(currentPage+1)}>▶</button>
        </div>
        <button id={styles.storeUserRegist} type="button">가게 등록하기</button>
    </>
    )   
}

export default StoreList; 