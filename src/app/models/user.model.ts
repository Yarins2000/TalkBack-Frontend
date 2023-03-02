/**
 * A model represents a user.
 * @property id - the user id
 * @property name - the user name
 * @property isConnected - whether the user is logged in or not
 */
export class User {
    constructor(public id: string, public username: string, public isConnected: boolean){}
}