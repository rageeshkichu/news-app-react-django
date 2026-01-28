import { FETCH_NEWS_REQUEST, FETCH_NEWS_SUCCESS, FETCH_NEWS_ERROR } from "../actions/NewsActions"

const initialState = {
    news: [],
    loading: false,
    error: null,
}


const NewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_NEWS_REQUEST:
            return {...state, loading: true, error: null}
        case FETCH_NEWS_SUCCESS:
            return {...state, news: action.payload, loading: false}
        case FETCH_NEWS_ERROR:
            return {...state, error: action.payload, loading: false}
        default:
            return state;
    }
}
export default NewsReducer;