/**
 * A model represents a registration request
 */
export class RegisterRequest {
    constructor(public username: string, public password: string, public confirmPassword: string) {}
}