import {LinesChartVO} from "./LinesChartVO";
import {TabItemVO} from "./TabItemVO";

export class ContentVO {

  public id:string;
  public tab:TabItemVO;
  public data:LinesChartVO;

  constructor(id:string,tab:TabItemVO, data:LinesChartVO) {
    this.id = id;
    this.tab = tab;
    this.data = data;
  }
}
