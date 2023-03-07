import { User } from "../../models/user.model";

/**
 * A model for the chat-participients's ids.
 * @property {User} sender - the user who sends a message
 * @property {User} recipient - the user who received a message
 */
export interface ChatParticipants {
    sender: User;
    recipient: User;
}