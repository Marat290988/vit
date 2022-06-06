export class User {
    public userId: string;
    public username: string;
    public email: string;
    public role: string;
    public lastLoginDate: Date;
    public lastLoginDateDisplay: Date;
    public joinDate: Date;
    public isActive: boolean;
    public isNotLocked: boolean;
    public activeString: string;
    public notLockedString: string;
    public password: string;

    constructor() {
        this.userId = '';
        this.username = '';
        this.email = '';
        this.role = '';
        this.lastLoginDate = null;
        this.lastLoginDateDisplay = null;
        this.joinDate = null;
        this.isActive = false;
        this.isNotLocked = false;
        this.password = '';
    }
}