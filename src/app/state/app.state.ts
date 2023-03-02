import { User } from "../models/user.model";

/**
 * Represents the application state.
 * @property users - The array of all users.
 * @property loggedInUsers - The array of logged in users.
 * @property isLoading - A flag to indicate if the app is currently loading data.
 * @property error - An error message or null if no error.
 */
export interface AppState {
    users: User[];
    loggedInUsers: User[];
    isLoading: boolean;
    error: string | null;
}