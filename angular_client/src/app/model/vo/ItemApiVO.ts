import {TranslationVO} from "./TranslationVO";
import {ItemApiTableVO} from "./ItemApiTableVO";

export class ItemApiVO{

  public name:TranslationVO;
  public descr:TranslationVO;
  public link:TranslationVO;

  public data_lv:Array<ItemApiTableVO> = [];
  public data_en:Array<ItemApiTableVO> = [];
  public _lang:string='lv';

  constructor(arr:Array<TranslationVO>){
    this.name = arr[0];
    this.descr = arr[1];
    this.link = arr[2];
    let vo:any;

    (arr[3].name_en.split('^') as any).forEach((item:any)=>{
      vo = item.split(':');
      this.data_en.push(new ItemApiTableVO(vo[0],vo[1]));
    });
    (arr[3].name_lv.split('^') as any).forEach((item:any)=>{
      vo = item.split(':');
      this.data_lv.push(new ItemApiTableVO(vo[0],vo[1]));
    });


  }
  public set lang(lang:string){
      this._lang = lang;
      this.name.lang = lang;
      this.descr.lang = lang;
      this.link.lang = lang;
  }
  public get lang():string{
    return this._lang;
  }
  public get data():Array<ItemApiTableVO>{
    return this._lang=='lv'?this.data_lv:this.data_en;
  }


}
