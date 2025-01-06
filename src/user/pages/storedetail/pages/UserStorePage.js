import ReservationInfo from "./ReservationInfo";
import Review from "./Review";
import StoreDetail from "./StoreDetail";
import Footer from "../../../../common/footer/components/Footer";

function UserStorePage(){

    return(
        <>
            <StoreDetail/>
            <ReservationInfo/>
            <Review/>
            <Footer/>
        </>
    );
}

export default UserStorePage;