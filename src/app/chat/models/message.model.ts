/**
 * A model represents a message.
 * @property senderId - the id of the message's sender user
 * @property message - the message content
 * @property sendingTime - the time the message was sent
 */
export class Message {
    constructor(public senderId: string, public message: string, public sendingTime: Date) {}
}