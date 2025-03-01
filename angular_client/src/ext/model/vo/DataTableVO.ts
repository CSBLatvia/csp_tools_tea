import {TranslationVO} from './TranslationVO';

export class DataTableVO{

  public title:TranslationVO;
  public sort_code:string;
  public value:number;
  public value_round:number;
  public value_calc:number;
  public data:Array<DataTableVO>=[];

  constructor(title:TranslationVO,value:number,value_calc:number,sort_code:string='') {
    this.title = title;
    this.sort_code = sort_code;
    this.value = value;
    // this.value_round = value>0?Math.round(value/1000):value;
    this.value_round = value>0?Math.round(value):value;
    this.value_calc = value_calc;
  }
}
