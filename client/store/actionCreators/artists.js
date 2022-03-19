import axios from "axios";

export const GET_ARTISTS = "GET_ARTISTS";
export const GET_ARTIST = "GET_ARTIST";
export const ADD_ARTIST = "ADD_ARTIST";
export const UPDATE_ARTIST = "UPDATE_ARTIST";
export const DELETE_ARTIST = "DELETE_ARTIST";

export const getArtists = (artists) => ({
    type: GET_ARTISTS,
    artists,
});

export const getArtist = (artist) => ({
    type: GET_ARTIST,
    artist,
});

export const addArtist = (artist) => ({
    type: ADD_ARTIST,
    artist,
});

export const updateArtist = (artist) => ({
    type: UPDATE_ARTIST,
    artist,
});

export const deleteArtist = (id) => ({
    type: UPDATE_ARTIST,
    id,
});

// GET request for all users
export const getArtists_thunk = () => async (dispatch) => {
    try {
        const { data: allArtists } = await axios.get("/api/artists");
        dispatch(getArtists(allArtists));
    } catch (err) {
        console.error(err);
    }
};

export const getArtist_thunk = (id) => async (dispatch) => {
    try {
        const { data: artist } = await axios.get(`/api/artists/${id}`);
        dispatch(getArtist(artist));
    } catch (err) {
        console.error(err);
    }
};

// POST request to add artist
export const addArtist_thunk = (artist) => async (dispatch) => {
    try {
        const token = window.localStorage.getItem("token");
        const { data: newArtist } = await axios.post(
            "/api/artists",
            {
                ...artist,
            },
            {
                headers: {
                    authorization: token,
                },
            },
        );
        dispatch(addArtist(newArtist));
    } catch (err) {
        console.error(err);
    }
};

// PUT request to update artist
export const updateArtist_thunk = (artist) => async (dispatch) => {
    try {
        const token = window.localStorage.getItem("token");
        const { data: updatedArtist } = await axios.put(
            `/api/artists/${artist.id}`,
            { ...artist },
            {
                headers: {
                    authorization: token,
                },
            },
        );

        dispatch(updateArtist(updatedArtist));
    } catch (err) {
        console.error(err);
    }
};

// DELETE request to update artist
export const deleteArtist_thunk = (id) => async (dispatch) => {
    try {
        const token = window.localStorage.getItem("token");
        await axios.delete(`/api/artists/${id}`, {
            headers: {
                authorization: token,
            },
        });

        dispatch(deleteArtist(id));
    } catch (err) {
        console.error(err);
    }
};
