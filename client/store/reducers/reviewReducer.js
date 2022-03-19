import {LOAD_ALL_REVIEWS, ADD_REVIEW} from '../actionCreators/reviews';

export const reviewReducer = (state = [], action) => {
    if(action.type === LOAD_ALL_REVIEWS){
        state = [...state, ...action.reviews]
    }
    if(action.type === ADD_REVIEW){
        state = [...state, action.review]
    }
    return state
}