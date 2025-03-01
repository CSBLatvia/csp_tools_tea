export class ScriptLoadInfoVO{

  public id:string;
  public path:string;
  public loaded:boolean = false;
  public status:string = '';

  constructor(id:string,path:string){
    this.id = id;
    this.path = path;
  }

}
