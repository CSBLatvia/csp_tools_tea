export class LoginVO{

  public user:string;
  public password:string;
  public authorized:boolean;

  constructor(user:string, password:string, authorized:boolean = false) {
    this.user = user;
    this.password = password;
    this.authorized = authorized;
  }
}
