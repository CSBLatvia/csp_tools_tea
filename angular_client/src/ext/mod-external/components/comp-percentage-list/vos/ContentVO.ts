import {ContentItemVO} from "./ContentItemVO";
import {TabItemVO} from "./TabItemVO";

export class ContentVO {

  public id:string;
  public tab:TabItemVO;
  public data:Array<ContentItemVO>;
  public columns:Array<any>=[];

  constructor(id:string,tab:TabItemVO, data:Array<ContentItemVO>,columns:Array<any>) {
    this.id = id;
    this.tab = tab;
    this.data = data;
    this.columns = columns;
  }
}
