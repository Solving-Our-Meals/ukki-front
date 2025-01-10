import Profile from "../components/Profile";
import RepresentativePhoto from "../components/RepresentativePhoto";
import ReservationInfo from "../components/ReservationInfo";
import TermsOfUse from "../components/TermsOfUse";
import styles from '../css/reservation.module.css';

function Reservation () {

    return(
        <div className={styles.reservation}>
            <RepresentativePhoto/>
            <Profile/>
            <ReservationInfo/>
            <TermsOfUse/>
        </div>
    );
}

export default Reservation;