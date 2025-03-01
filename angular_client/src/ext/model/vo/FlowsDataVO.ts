import {TerritorySimpleVO} from "./TerritorySimpleVO";

export class FlowsDataVO {

  public code:string;
  public code_other:string;
  public amount:number;
  public age_avg:number;
  public territory:TerritorySimpleVO = null;

  constructor(
    code:string,
    code_other:string,
    amount:number,
    age_avg:number,
    territory:TerritorySimpleVO = null
  ){
      this.code = code;
      this.code_other = code_other;
      this.amount = amount;
      this.age_avg = age_avg;
      this.territory = territory;
  }

}
