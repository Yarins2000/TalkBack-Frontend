import { createReducer, on } from "@ngrx/store";
import { AppState } from "./app.state";
import * as usersActions from "./users.actions";

export const initialState: AppState = {
    users: [],
    loggedInUsers: [],
    isLoading: false,
    error: null
};

/**
 * The reducer function that handles user-related actions and updates the app state.
 */
export const reducers = createReducer(
    initialState,
    on(usersActions.loadUsers, (state) => ({ ...state, isLoading: true })),

    on(usersActions.userLogin, (state, { loggedInUser }) => {
        const isUserAlreadyLoggedIn = state.loggedInUsers.includes(loggedInUser);
        if (isUserAlreadyLoggedIn)
            return { ...state, loggedInUsers: state.loggedInUsers };
        else {
            return { ...state, loggedInUsers: [...state.loggedInUsers, loggedInUser] };
        }
    }),

    on(usersActions.userLogout, (state, { loggedOutUser }) => {
        const isUserLoggedIn = state.loggedInUsers.find(user => user.id === loggedOutUser.id);
        if (isUserLoggedIn) {
            return { ...state, loggedInUsers: state.loggedInUsers.filter(user => user.id !== loggedOutUser.id) };
        }
        else
            return { ...state, loggedInUsers: state.loggedInUsers };
    }),

    on(usersActions.LoadUsersSuccess, (state, action) => ({ ...state, isLoading: false, users: action.users })),

    on(usersActions.LoadUsersFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),
    
    on(usersActions.chnageConnectionStatus, (state, action) => ({
        ...state, users: state.users.map(currUser => {
            if (currUser.username === action.user.username)
                return { ...currUser, isConnected: !currUser.isConnected };
            else
                return currUser;
        })
    })),
);