import {PercentageBarItemVO} from "./PercentageBarItemVO";

export class PercentageBarVO{

  public text:string;
  public values:Array<PercentageBarItemVO>;

  constructor(text:string,values:Array<PercentageBarItemVO>) {
    this.text = text;
    this.values = values;
  }
}
