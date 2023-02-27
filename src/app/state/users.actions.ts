import { createAction, props } from "@ngrx/store";
import { User } from "../models/user.model";

// export const loadUsers = createAction(
//     '[Users API] Load Users',
//     props<{ users: User[] }>()
// );
export const loadUsers = createAction(
    '[Users] Load Users'
);

export const userLogin = createAction(
    '[Login page] User Login',
    props<{ loggedInUser: User }>()
);

export const userLoginFinished = createAction(
    '[Login page] User Login Complete',
    props<{ loggedInUser: User }>()
);

export const userLogout = createAction(
    '[Logout function] User Logout',
    props<{ loggedOutUser: User }>()
);

export const LoadUsersSuccess = createAction(
    '[Users] Load Users Success',
    props<{ users: User[] }>()
);

export const LoadUsersFailure = createAction(
    '[Users] Load Users Failure',
    props<{ error: string }>()
);

export const chnageConnectionStatus = createAction(
    '[User] Chnage Connection Status',
    props<{ user: User }>()
);