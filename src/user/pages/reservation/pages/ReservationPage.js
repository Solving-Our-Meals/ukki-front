import Profile from "../components/Profile";
import RepresentativePhoto from "../components/RepresentativePhoto";

function Reservation () {

    return(
        <>
            <div><RepresentativePhoto/></div>
            <div><Profile/></div>
            <div>예약 정보</div>
            <div>이용약관</div>
        </>
    );
}

export default Reservation;