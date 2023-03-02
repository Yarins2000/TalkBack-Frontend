/**
 * A model represents a login request
 * @property username - the user's username
 * @property password - the user's password
 * @property rememberMe - determines whether the user wants to remain connected after logout or not.
 */
export class LoginRequest {
    constructor(public username: string, public password: string, public rememberMe: boolean) {}
}