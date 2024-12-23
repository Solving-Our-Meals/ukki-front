import { useEffect, useState, useRef } from 'react';
import '../css/reset.css';
import '../css/doinquiry.css';

function StoreUpdateInquiry({ setEnterUpdate, inquiryDTO }) {
    const [inquiryTitle, setInquiryTitle] = useState("");
    const [inquiryContent, setInquiryContent] = useState("");
    const [inquiryFile, setInquiryFile] = useState(null);
    const [isWrite, setIsWrite] = useState([false, false]);
    const fileInputRef = useRef(null);

    function handleTitleChange(e) {
        setInquiryTitle(e.target.value);
        if (e.target.value === '' || e.target.value === null || e.target.value.length < 5) {
            isWrite[0] = false;
            setIsWrite([...isWrite]);
        } else {
            isWrite[0] = true;
            setIsWrite([...isWrite]);
        }
    }

    function handleContentChange(e) {
        setInquiryContent(e.target.value);

        if (e.target.value === '' || e.target.value === null || e.target.value.length < 5) {
            isWrite[1] = false;
            setIsWrite([...isWrite]);
        } else {
            isWrite[1] = true;
            setIsWrite([...isWrite]);
        }
    }

    function handleFileChange(e) {
        setInquiryFile(e.target.files[0]);
    }

    function handleFileButtonClick() {
        fileInputRef.current.click();
    }

    function handleCancle() {
        setEnterUpdate(false);
    }

    function submit(e) {
        e.preventDefault();
        inquiryDTO.inquiryTitle = inquiryTitle;
        inquiryDTO.inquiryContent = inquiryContent;

        const formData = new FormData();
        const json = JSON.stringify(inquiryDTO);
        const blob = new Blob([json], { type: 'application/json' });
        formData.append("data", blob);
        if (inquiryFile) {
            formData.append("file", inquiryFile);
        }

        let isPass = isWrite.every(Boolean);
        if (isPass) {
            let url = '/inquiries/list/' + inquiryDTO.inquiryNo;
            fetch(url, {
                method: "PUT",
                headers: {},
                body: formData
            }).then(res => {
                if (res.ok) {
                    alert(res.message);
                }
            });
        } else {
            alert("내용을 확인해주세요");
        }
    }

    useEffect(() => {
        console.log("Component mounted");
    }, []);

    return (
        <>
            <div id='doInquiryModal'>
                <div id='doInquiryText'>문의수정</div>
                <div id='doInquiryTitleText'>문의 제목: </div>
                <div id='inquiryDateAtUpdate'>문의 일자 : <p>{inquiryDTO.inquiryDate}</p></div>
                <form>
                    <input id='inputDoTitle' type='text' value={inquiryTitle} onChange={handleTitleChange} required />
                    <textarea id='inputDoContent' value={inquiryContent} onChange={handleContentChange} required />
                    <input
                        type="file"
                        id="inquiryFile"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <button type="button" id="inquiryDoFileBtn" onClick={handleFileButtonClick}>
                        첨부파일
                    </button>
                    <button type="button" id='inquiryDoCancleBtn' onClick={handleCancle}>취소</button>
                    <button id='doInquiryBtn' onClick={submit}>확인</button>
                </form>
            </div>
        </>
    );
}

export default StoreUpdateInquiry;
