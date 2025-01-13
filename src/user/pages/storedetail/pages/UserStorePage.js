// import {useRef} from 'react';
// import ReservationInfo from "./ReservationInfo";
// import Review from "./Review";
// import StoreDetail from "./StoreDetail";
// import Footer from "../../../../common/footer/components/Footer";

// function UserStorePage(){
//     const reserveScrollRef = useRef(null);

//     const reservationHandler = () => {
//         if(reserveScrollRef.current){
//             reserveScrollRef.current.scrollIntoView({behavior : "nmooth"});
//         }
//     }

//     return(
//         <>
//             <StoreDetail reservationHandler={reservationHandler}/>
//             <ReservationInfo ref={reserveScrollRef}/>
//             <Review/>
//             <Footer/>
//         </>
//     );
// }

// export default UserStorePage;

import React, { useRef } from 'react';
import StoreDetail from './StoreDetail';
import ReservationInfo from './ReservationInfo';
import Review from './Review';
// import Footer from '../../../../common/footer/components/Footer';

function UserStorePage() {
    const reserveScrollRef = useRef(null);

    const reservationHandler = () => {
        if (reserveScrollRef.current) {
            let offset = -650;
            if(window.innerWidth < 769){
                offset = -380;
            } else if (window.innerWidth < 1205){
                offset = -380;
            }
            const targetPosition = reserveScrollRef.current.getBoundingClientRect().top + window.scrollY - offset; 
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            // reserveScrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
            <StoreDetail reservationHandler={reservationHandler} />
            <ReservationInfo ref={reserveScrollRef} />
            <Review />
            {/* <Footer /> */}
        </>
    );
}

export default UserStorePage;
