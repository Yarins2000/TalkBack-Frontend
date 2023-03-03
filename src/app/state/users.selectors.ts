import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './app.state';

/**
 * Selector function that returns the feature selector for the 'users' slice of the app state.
 */
const selectAppState = createFeatureSelector<AppState>('users');

/**
 * Selector function that returns the 'users' array from the app state.
 * @returns an observable of 'users' array.
 */
export const usersSelector = createSelector(
  selectAppState,
  (state) => state.users
);

/**
 * Selector function that returns the 'error' string or null from the app state.
 * @returns an observable of 'error' string or null.
 */
export const errorSelector = createSelector(
  selectAppState, 
  (state) => state.error
);

/**
 * Selector function that returns a user by username from the 'users' array in the app state.
 * @param username - string representing the username of the user to be selected.
 * @returns an observable of a user object that matches the provided username.
 */
export const selectUserByUsername = (username: string) => createSelector(
  selectAppState,
  state => {
    return state.users.find(user => user.username === username)!;
  }
);

export const selectLoggedInUser = (username: string) => createSelector(
  selectAppState,
  state => {
    return state.loggedInUsers.find(user => user.username === username);
  }
);