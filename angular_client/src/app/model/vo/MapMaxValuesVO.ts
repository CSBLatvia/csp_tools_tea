export class MapMaxValuesVO {


  public MAX_E:number;
  public MAX_VA:number;
  public MAX_VP:number;

  public max_empl_w:number;
  public max_value_added_w:number;
  public max_value_prod_w:number;

  public max_empl_h:number;
  public max_value_added_h:number;
  public max_value_prod_h:number;

  constructor(){}

  public update():void{
    this.MAX_E = Math.max(this.max_empl_w,this.max_empl_h);
    this.MAX_VA = Math.max(this.max_value_added_w,this.max_value_added_h);
    this.MAX_VP = Math.max(this.max_value_prod_w,this.max_value_prod_h);
  }

}
