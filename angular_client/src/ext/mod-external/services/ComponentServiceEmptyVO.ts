export class ComponentServiceEmptyVO{

  public error_title:string;
  public error_msg:string;
  public error_detail:string;

  constructor(error_title:string, error_msg:string, error_detail:string) {
    this.error_title = error_title;
    this.error_msg = error_msg;
    this.error_detail = error_detail;
  }
}
