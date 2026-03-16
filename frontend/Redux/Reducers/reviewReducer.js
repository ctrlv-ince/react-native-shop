const initialState = {
    reviews: [],
    loading: false,
    error: null
};

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_REVIEWS_REQUEST':
            return { ...state, loading: true, reviews: [] };
        case 'FETCH_REVIEWS_SUCCESS':
            return { ...state, loading: false, reviews: action.payload };
        case 'FETCH_REVIEWS_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'ADD_REVIEW_SUCCESS':
            return { ...state, reviews: [...state.reviews, action.payload] };
        default:
            return state;
    }
};

export default reviewReducer;
