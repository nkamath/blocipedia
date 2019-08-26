module.exports = class ApplicationPolicy {

    constructor(user, record) {
        this.user = user;
        this.record = record;
    }

    _isOwner() {
        console.log("this.record (owner): " + this.record);
        console.log("this.record.userId: " + this.record.userId);
        console.log("this.userId: " + this.userId);
        return this.record && (this.record.userId == this.user.id);
    }

    _isAdmin() {
        return this.user && this.user.role == 1;
    }

    _isPremium(){
        return this.user && this.user.role == 2;
    }


    new() {
        return this.user != null;
    }

    create() {
        return this.new();
    }

    show() {
        return true;
    }


    edit() {
        console.log("this.new: " + this.new());
        console.log("this.record: " + this.record);
        return this.new() && this.record;
    }

    update() {
        return this.edit();
    }

    destroy() {
        console.log("this.edit: " + this.edit());
        console.log("this._isAdmin(): " + this._isAdmin());
        console.log("this._isOwner(): " + this._isOwner());
        return this.edit() && (this._isAdmin() || this._isOwner());
        
    }
}