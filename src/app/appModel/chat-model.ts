export class ChatModel {


}

export class UserPresence {
    public UserId: string = '';
    public Status: string = '';
    public updatedBy: Date;
}

export class TypingStatus {
    public UserId: string = '';
    public isTyping: boolean = false;
    public updatedBy: Date;
}
