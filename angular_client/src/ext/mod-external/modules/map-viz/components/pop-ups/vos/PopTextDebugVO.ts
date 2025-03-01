export class PopTextDebugVO {

  public text:string='';
  public error:boolean=false;
  public error_info:string='';

  public sql:string='';
  public parameters:string='';
  public id:string='';

  constructor(text:string,error:boolean,sql:string='',parameters:string='',id:string='',error_info:string='') {
    this.text = text;
    this.error = error;
    this.error_info = error_info;
    this.sql = sql;
    this.parameters = parameters;
    this.id = id;
  }

}
