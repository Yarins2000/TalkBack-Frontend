import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './app.state';

const selectAppState = createFeatureSelector<AppState>('users');

export const usersSelector = createSelector(
  selectAppState,
  (state) => state.users
);

export const loggedInUsersSelector = createSelector(
  selectAppState,
  (state) => state.loggedInUsers
);

export const errorSelector = createSelector(
  selectAppState, 
  (state) => state.error
);

export const selectUserByUsername = (username: string) => createSelector(
  selectAppState,
  state => {
    return state.users.find(user => user.username === username)!;
  }
);