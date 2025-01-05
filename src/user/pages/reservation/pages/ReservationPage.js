import Profile from "../components/Profile";
import RepresentativePhoto from "../components/RepresentativePhoto";
import ReservationInfo from "../components/ReservationInfo";
import TermsOfUse from "../components/TermsOfUse";

function Reservation () {

    return(
        <>
            <div><RepresentativePhoto/></div>
            <div><Profile/></div>
            <div><ReservationInfo/></div>
            <div><TermsOfUse/></div>
        </>
    );
}

export default Reservation;