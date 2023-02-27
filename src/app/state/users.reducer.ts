import { createReducer, on } from "@ngrx/store";
import { User } from "../models/user.model";
import { AppState } from "./app.state";
import * as usersActions from "./users.actions";

export const initialState: AppState = {
    users: [],
    loggedInUsers: [],
    isLoading: false,
    error: null
};

export const reducers = createReducer(
    initialState,
    on(usersActions.loadUsers, (state) => ({ ...state, isLoading: true })),
    on(usersActions.userLogin, (state, { loggedInUser }) => {
        const isUserAlreadyLoggedIn = state.loggedInUsers.includes(loggedInUser);
        if (isUserAlreadyLoggedIn)
            return { ...state, loggedInUsers: state.loggedInUsers };
        else {
            // loggedInUser.isConnected = true;
            // const updatedLoggedInUser = {...loggedInUser, isConnected: true};
            return { ...state, loggedInUsers: [...state.loggedInUsers, loggedInUser] };
            // return { ...state, loggedInUsers: [...state.loggedInUsers, ] };
            // allNavGroups: state.allNavGroups.map(navGroup => ({...navGroup})) // 2
            //                         .map(navGroup => { // 3
            //                             if (navGroup.groupId === group.groupId) {
            //                               return {
            //                                 ...navGroup,
            //                                 collapsed: !navGroup.collapsed,
            //                               } else {
            //                                return navGroup;
            //                               }
            //                             }
            //                          })
        }
    }),
    on(usersActions.userLogout, (state, { loggedOutUser }) => {
        const isUserLoggedIn = state.loggedInUsers.includes(loggedOutUser);
        if (isUserLoggedIn) {
            // const updatedLoggedInUsers = [...state.loggedInUsers];
            // const loggedOutUserFromList = updatedLoggedInUsers.findIndex(user => user.id === loggedOutUser.id);
            // updatedLoggedInUsers[loggedOutUserFromList].isConnected = false;
            return { ...state, loggedInUsers: state.loggedInUsers.filter((user) => user.username !== loggedOutUser.username) };
        }
        else
            return { ...state, loggedInUsers: state.loggedInUsers };
    }),
    on(usersActions.LoadUsersSuccess, (state, action) => ({ ...state, isLoading: false, users: action.users })),
    on(usersActions.LoadUsersFailure, (state, action) => ({ ...state, isLoading: false, error: action.error })),
    on(usersActions.chnageConnectionStatus, (state, action) => ({ ...state, users: state.users.map(currUser => {
        if(currUser.username === action.user.username)
            return {...currUser, isConnected: !currUser.isConnected};
        else
            return currUser;
    })})),
);