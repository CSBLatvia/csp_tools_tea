import {TerritoryInfoVoItem} from "./TerritoryInfoVoItem";

export class TerritoryInfoVO {

  public title:string;
  public data:Array<TerritoryInfoVoItem>;

  constructor(title:string,data:Array<TerritoryInfoVoItem>) {
    this.title = title;
    this.data = data;
  }
}
