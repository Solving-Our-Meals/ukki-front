import {useEffect, useState, useMemo, useCallback } from 'react'
import '../css/reset.css';
import '../css/StoreInquiryList.css'
import { inquiryList } from '../api/inquiryListAPI';
import { reportList } from '../api/reportListAPI';
import StoreReportInfo from './StoreReportInfo';
import StoreInquiryInfo from './StoreInquiryInfo';


function StoreInquiryList({setInquiryList, setIsLittleInquiryModal}){

    const [listInfo, setListInfo] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isReport, setIsReport] = useState(false);
    const [isInquiry, setIsInquiry] = useState(false);
    const [inquiryNo, setInquiryNo] = useState(0);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 4;
    
        const fetchList = useCallback(async () => {
            try{
             const inquiries = await inquiryList();
             const reports = await reportList();
             if (
                (inquiries && inquiries.length > 0) || (reports && reports.length > 0)
                ){
                const list = sortDate(inquiries.concat(reports))
                
                setListInfo(list)
                
             }
            }catch(error){
                console.log("오류발생", error)
            }finally{
                setLoading(false);
            }
        }, [])

        const sortDate = useCallback( (list) => {
            const sorted_list = list.sort(function(a, b) {
                return new Date(a.inquiryDate).getTime() - new Date(b.inquiryDate).getTime();
            });
            return sorted_list;
        },[])

        function handleCancle(){
            setInquiryList(false);
            setIsLittleInquiryModal(true)
          }

    function handlerInquiryInfo(className, value){
        // 추가 로직을 여기서 처리합니다.
        if (className === "report") 
            { setIsReport(true);
                setIsInquiry(false);
                setInquiryNo(value);

             }
         else if (className === "inquiry") 
            { setIsInquiry(true);
                setIsReport(false);
                setInquiryNo(value);}

    }

    useEffect(()=>{
        fetchList()
    },[fetchList])

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItem = useMemo(()=> {return listInfo.slice(indexOfFirstItem, indexOfLastItem)},[listInfo, indexOfFirstItem, indexOfLastItem]);

    const totalPages = useMemo(()=>Math.ceil(listInfo.length/itemsPerPage),[listInfo.length, itemsPerPage]);

    const visiblePageNum = useCallback(()=>{
        let startPage = Math.max(currentPage-1, 1);
        let endPage = Math.min(currentPage+1, totalPages);

        if(currentPage == 1){
            endPage = Math.min(3, totalPages);
        }else if(currentPage===totalPages)(
            startPage = Math.max(totalPages-2, 1)
        )

        let pageNumbers = []

        for(var i = startPage; i <= endPage; i++){
            pageNumbers.push(i)
        }

        return pageNumbers;
    },[currentPage, totalPages])

    const paginate = useCallback( (no) => {if(0<no && no<=totalPages){setCurrentPage(no)}},[totalPages]);



    return(
        <>
            <div id='storeInquiryListModal'>
                <div id='storeInquiryListText'>문의 내역</div>
                <button id='cancleInquiryListBtn' onClick={handleCancle}>확인</button>
                <div id='inquiryListHeader'>
                    <span className='inquiryState header'>문의 상태</span>
                    <span className='inquiryDate header'>문의 일자</span>
                    <span className='inquiryTitle header'>문의 제목</span>
                </div>
                <div id='listArea'>
                    {loading ? (
                        <div>Loading...</div>
                     ) : (
                        currentItem.map((item, index)=>{ 
                        return  <div key={index} className={item.division} value={item.no} onClick={()=>handlerInquiryInfo(item.division, item.no)}>
                                    <div id='inquiryListBody'>
                                    <span className='inquiryState'>{item.state}</span>
                                    <span className='inquiryDate'>{item.inquiryDate}</span>
                                    <div className='inquiryTitle'><p className='inquiryTitleText'>{item.inquiryTitle}</p></div>
                                    </div>
                                </div>
                        })
                     )}
                    </div>
                    <div className='pageNation'>
                    <button onClick={()=>paginate(currentPage-1)} disabled={currentPage === 1}>◀</button>
                {visiblePageNum().map((pageNum)=>(
                    <button key={pageNum} onClick={() => paginate(pageNum)}
                    className={pageNum === currentPage ? 'active' :''}>
                        {pageNum}
                    </button>
                ))}
                    <button onClick={()=>paginate(currentPage+1)}>▶</button>
            </div>
            </div>
            {isReport && <StoreReportInfo inquiryNo={inquiryNo} setIsReport={setIsReport}/>}
            {isInquiry && <StoreInquiryInfo inquiryNo={inquiryNo} setIsInquiry={setIsInquiry} fetchList={fetchList}/>}
        </>
    )
}

export default StoreInquiryList