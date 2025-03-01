import {TranslationVO} from "./TranslationVO";

export class LevelVO {

    public id:number;
    private _name:string;
    private _lang:string = 'lv';

    private arr:Array<TranslationVO>=[
      new TranslationVO('0','territory-0-lv','territory-0-en'),
      new TranslationVO('1','territory-1-lv','territory-1-en'),
      new TranslationVO('2','territory-2-lv','territory-2-en'),
      new TranslationVO('3','territory-3-lv','territory-3-en'),
      new TranslationVO('4','territory-4-lv','territory-4-en'),
      new TranslationVO('5','territory-5-lv','territory-5-en'),
    ];
    private vo:TranslationVO;

    constructor(id:number){
        this.id = id;
        this.vo = this.arr[this.id];
    }
    public get name():string{
        return this._name;
    }
    public get lang():string{
      return this._lang;
    }
    public set lang(value: string) {
      this._lang = value;
      this.vo.lang = this._lang;
    }

}
