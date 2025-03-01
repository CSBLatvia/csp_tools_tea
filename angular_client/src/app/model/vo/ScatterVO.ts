import {ScatterValueVO} from "./ScatterValueVO";

export class ScatterVO{

  public item_x:ScatterValueVO;
  public item_y:ScatterValueVO;

  constructor(item_x:ScatterValueVO,item_y:ScatterValueVO) {
    this.item_x = item_x;
    this.item_y = item_y;
  }
}
