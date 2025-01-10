import { useState, useEffect, useCallback, useMemo } from "react"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import styles from "../css/UserList.module.css"
import "../css/reset.css"
import { UserListAPI } from "../api/UserListAPI"

function UserList(){

    const [list, setList] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchCategory, setSearchCategory] = useState("none");
    const [searchWord, setSearchWord] = useState("");
    const [searchSuccess, setSearchSuccess] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const fetchList = useCallback(async (category, word) => {
            console.log(category+"fetchlist")
            console.log(word)
                try{
                 const userList = await UserListAPI(category, word);
                 if (
                    (userList && userList.length > 0)
                    ){
                    setSearchSuccess(true)
                    setList(userList)
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
        const currentItem = useMemo(()=> {return list.slice(indexOfFirstItem, indexOfLastItem)},[list, indexOfFirstItem, indexOfLastItem]);
    
        const totalPages = useMemo(()=>Math.ceil(list.length/itemsPerPage),[list.length, itemsPerPage]);
    
        const visiblePageNum = useCallback(()=>{
            let startPage = Math.max(currentPage-2, 1);
            let endPage = Math.min(currentPage+2, totalPages);
    
            if(currentPage === 1){
                endPage = Math.min(5, totalPages);
            }else if(currentPage === 2){
                endPage = Math.min(5, totalPages);
            }else if(currentPage===totalPages-1){
                startPage = Math.max(totalPages-4, 1)
            }else if(currentPage===totalPages)(
                startPage = Math.max(totalPages-4, 1)
            )
    
            let pageNumbers = []
    
            for(var i = startPage; i <= endPage; i++){
                pageNumbers.push(i)
            }
    
            return pageNumbers;
        },[currentPage, totalPages])
    
        const paginate = useCallback( (no) => {
            console.log(no)
            if(0<no && no<=totalPages){setCurrentPage(no)}
        },[totalPages]);
    
        function categoryChangeHandler(e){
            console.log(e.target.value)
            setSearchCategory(e.target.value)
        }

        function searchChangeHandler(e){
            console.log(e.target.value)
            setSearchWord(e.target.value)
        }

        function searchClickHandler(){
            const url = `?category=${searchCategory}&word=${searchWord}`;
            navigate(url);
        }

        function handlerUserInfo(no){
            const url = `/admin/users/info/${no}`;
            console.log(url)
            navigate(url)
        }

        function handleKeyPress(e) {
            if (e.key === 'Enter') {
                searchClickHandler();
            }
        }
    return(
    <>
        <div className={styles.userListText}>회원리스트</div>
        <select className={styles.userListSelection} onChange={categoryChangeHandler}>
            <option className={styles.userListOption} value="none" selected>검색 기준</option>
            <option className={styles.userListOption} value="USER_ID">아이디</option>
            <option className={styles.userListOption} value="USER_NAME">닉네임</option>
            <option className={styles.userListOption} value="EMAIL">이메일</option>
        </select>   
        <input 
            type="text" 
            className={styles.userListSearchInput} 
            value={searchWord} 
            onChange={searchChangeHandler}
            onKeyPress={handleKeyPress}
        ></input>
        <button type="button" onClick={searchClickHandler} className={styles.userListSearchBtn}/>
        <table className={styles.userList}>
            <thead className={styles.userListHeader}>
                <tr>
                    <th style={{width: '400px'}}>아이디</th>
                    <th style={{width: '400px'}}>닉네임</th>
                    <th style={{width: '508px'}}>이메일</th>
                    <th style={{width: '181px'}}>노쇼 횟수</th>
                </tr>
            </thead>
        </table>
        <div id={styles.userListBodyPosition}>
            {searchSuccess? currentItem.map((item, index)=>{ 
                return <div className={styles.userListBody}>
                    <div key={index} className={styles[item.userRole] || ''} value={item.userNo} onClick={()=>handlerUserInfo(item.userNo)}>
                        <div style={{width: '400px'}}>{item.userId}</div>
                        <div style={{width: '400px'}}>{item.userName}</div>
                        <div style={{width: '508px'}}>{item.email}</div>
                        <div style={{width: '181px'}}>{item.noShow}</div>
                    </div>
                </div>
            }) : <div className={styles.userListBody}>해당 결과가 존재하지 않습니다.</div>
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
    </>
    )   

}

export default UserList;