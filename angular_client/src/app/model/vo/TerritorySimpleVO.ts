export class TerritorySimpleVO{

  public code:string;
  public name_en:string;
  public name_en_short:string;
  public name_lv:string;
  public name_lv_short:string;

  constructor(ob:any){
    this.code = ob.code_other;
    this.name_en = ob.name_en_to;
    this.name_lv = ob.name_lv_to;
    this.name_en_short = ob.name_en_short_to;
    this.name_lv_short = ob.name_lv_short_to;
  }

}
