import axios from 'axios'

export const FETCH_NEWS_REQUEST = 'FETCH_NEWS_REQUEST';
export const FETCH_NEWS_SUCCESS = 'FETCH_NEWS_SUCCESS';
export const FETCH_NEWS_ERROR = 'FETCH_NEWS_ERROR';

export const fetchNews = ()=>{
    return async (dispatch) =>{
        try{
            dispatch({ type: FETCH_NEWS_REQUEST });
            const response = await axios.get("http://localhost:8000/api/news/");
            dispatch({ type: FETCH_NEWS_SUCCESS, payload: response.data.news });
        }
        catch(error){
            dispatch({ type: FETCH_NEWS_ERROR, payload: error.message });
        }
    }
}