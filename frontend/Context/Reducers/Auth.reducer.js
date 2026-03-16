import { SET_CURRENT_USER } from '../Actions/Auth.actions';

export default function authReducer(state, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: Object.keys(action.payload).length > 0 ? true : false,
                user: action.payload,
                userProfile: action.userProfile
            };
        default:
            return state;
    }
}
