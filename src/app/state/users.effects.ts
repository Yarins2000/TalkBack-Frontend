import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import * as UsersActions from './users.actions';
import { of } from 'rxjs';
import { ContactsService } from '../services/contacts/contacts.service';
import { ContactsSignalRService } from '../hubServices/contactsSignalR/contactsSignalR.service';

@Injectable()
export class UsersEffects {
    constructor(private actions$: Actions, private contactsService: ContactsService, private contactsSignalRService: ContactsSignalRService) { }

    loadUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersActions.loadUsers),
            switchMap(() =>
                this.contactsService.getUsers().pipe(
                    map(users => this.contactsService.mapUsers(users)),
                    map(mappedUsers => UsersActions.LoadUsersSuccess({ users: mappedUsers })),
                    catchError(error => of(UsersActions.LoadUsersFailure({ error })))
                )
            )
        )
    );

    // userLoggedIn$ = createEffect(() => this.actions$.pipe(
    //     ofType(UsersActions.userLogin),
    //     switchMap(({ loggedInUser }) => {
    //         this.contactsSignalRService.newLogin(loggedInUser.username);
    //         return of(UsersActions.userLoginFinished({ loggedInUser }))
    //     })
    // ));
}