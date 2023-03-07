import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import * as UsersActions from './users.actions';
import { of } from 'rxjs';
import { ContactsService } from '../contacts/services/contacts/contacts.service';

@Injectable()
export class UsersEffects {
    constructor(private actions$: Actions, private contactsService: ContactsService) { }

    /**
     * An effect that loads the users from the contacts service and dispatches the corresponding success/failure actions.
     * @returns An Observable of the success/failure actions.
     */
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
}