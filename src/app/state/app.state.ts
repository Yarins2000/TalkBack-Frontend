import { User } from "../models/user.model";

export interface AppState {
    users: User[];
    loggedInUsers: User[];
    isLoading: boolean;
    error: string | null;
}