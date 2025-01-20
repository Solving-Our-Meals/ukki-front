import { useOutletContext } from 'react-router-dom';
import TotalReview from './TotalReview';
import SpecificReview from '../components/SpecificReview';

function BossReviewPage(){

    const {storeNo} = useOutletContext();

    return(
        <>
            <TotalReview storeNo={storeNo}/>
            <SpecificReview storeNo={storeNo}/>
        </>
    );
}

export default BossReviewPage;