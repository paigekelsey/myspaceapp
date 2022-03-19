import {
    GET_ARTISTS,
    GET_ARTIST,
    ADD_ARTIST,
    UPDATE_ARTIST,
    DELETE_ARTIST,
} from "../actionCreators/artists";

export const artistsReducer = (state = [], action) => {
    if (action.type === GET_ARTISTS) {
        return (state = action.artists);
    } else {
        return state;
    }
};
