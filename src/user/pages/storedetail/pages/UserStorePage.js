import ReservationInfo from "./ReservationInfo";
import Review from "./Review";
import StoreDetail from "./StoreDetail";

function UserStorePage(){

    return(
        <>
            <StoreDetail/>
            <ReservationInfo/>
            <Review/>
        </>
    );
}

export default UserStorePage;