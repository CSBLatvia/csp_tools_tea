export class AriaVO{


  public role:string = '';
  public ariaLabel:string = '';
  public tabIndex:number=0;

  constructor(role:string,ariaLabel:string,tabIndex:number=0){
    this.role = role;
    this.ariaLabel = ariaLabel;
    this.tabIndex = tabIndex;
  }


}
