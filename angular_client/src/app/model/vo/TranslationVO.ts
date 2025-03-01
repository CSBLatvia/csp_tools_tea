import {ControlValueVO} from "../../ui-controls/vos/ControlValueVO";
import {throwError} from "rxjs";

export class TranslationVO{


    public id:string='';
    public name_lv:string;
    public name_en:string;
    public name_lv_mod:string;
    public name_en_mod:string;

    private _lang:string = 'lv';

    public used:boolean = true;
    public html:boolean = false;

    constructor(id:string, value_lv:string, value_en:string, used:boolean = true, html:boolean = false){
        this.id = id;

        this.name_lv = value_lv.replace(/—/g, '-');
        this.name_en = value_en.replace(/—/g, '-');

        this.name_lv = this.name_lv.replace(/&apos;/g, "'");
        this.name_en = this.name_en.replace(/&apos;/g, "'");

        this.name_lv = this.name_lv.replace(/ /g, " ");
        this.name_en = this.name_en.replace(/ /g, " ");


        this.name_lv = this.name_lv==''?this.id:this.name_lv;
        this.name_en = this.name_en==''?this.id:this.name_en;

        this.name_lv_mod = this.name_lv;
        this.name_en_mod = this.name_en;

        this.used = used;
        this.html = html;
    }
    public replaceString(str:string,value_lv:string,value_en:string=''):void{
      if(this.name_lv.indexOf(str)!==-1) {
        this.name_lv_mod = this.name_lv.replace(str, value_lv);
      }
      if(this.name_en.indexOf(str)!==-1) {
        this.name_en_mod = this.name_en.replace(str,value_en);
      }
    }
  /* MUST use this function instead old replaceString */
  public replace(str_arr:Array<string>,values:Array<any>):void{
      if(str_arr.length!==values.length){
        throwError('str_arr and values not equal!!! something is missing!');
      }
      let index:number = 0;
      let value:any;
      let name_lv_mod:string = this.name_lv;
      let name_en_mod:string = this.name_en;

      str_arr.forEach((item:string)=>{
        value = values[index];
        name_lv_mod.replace(item,value.name_lv);
        name_en_mod.replace(item,value.name_en);
      });

      this.name_lv_mod = name_lv_mod;
      this.name_en_mod = name_en_mod;
  }
    public clone():TranslationVO{
      const vo:TranslationVO = new TranslationVO(this.id, this.name_lv, this.name_en,this.used,this.html);
            vo.name_lv = this.name_lv;
            vo.name_en = this.name_en;
            vo.name_lv_mod = this.name_lv_mod;
            vo.name_en_mod = this.name_en_mod;
            vo.lang = this.lang;
      return vo;
    }
    public get name():string{
      return this._lang==='lv'? this.name_lv_mod:this.name_en_mod;
    }
    public get lang(): string {
      return this._lang;
    }
    public set lang(value: string) {
      this._lang = value;
    }
}
