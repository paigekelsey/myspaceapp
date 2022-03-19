import axios from 'axios';

export const LOAD_ALL_REVIEWS = 'LOAD_ALL_REVIEWS';
export const ADD_REVIEW = 'ADD_REVIEW';

export const loadReviews = (reviews) => {
    return {
        type:LOAD_ALL_REVIEWS,
        reviews
    }
}

export const addReview = (review) => {
    return{
        type: ADD_REVIEW,
        review
    }
}

export const thunkLoadReviews = () => {
    try{
        return async(dispatch) => {
            const {data: reviews} = await axios.get('/api/reviews');
            dispatch(loadReviews(reviews));
        };
    } catch(err){
        console.log(err)
    }
};

export const thunkAddReview = (review) => {
    try{
        return async(dispatch) => {
            const {data:newReview} = await axios.post('/api/reviews', review);
            dispatch(addReview(newReview))
        }
    } catch(err){
        console.log(err)
    }
};
