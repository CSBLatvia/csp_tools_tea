import {TranslationVO} from "./vo/TranslationVO";

export class Translations{

    private data:Array<TranslationVO> = [];
    private _lang:string = 'lv';

    constructor(){}

    public initializeJSON(data:any,lang:string):void{
        for (const entry in data) {
            this.data.push(new TranslationVO(entry, data[entry][0], data[entry].length>1?data[entry][1]:data[entry][0]));
        }
        this._lang = lang;
    }
    public initializeDB(data:Array<any>,lang:string):void{
      data.forEach((item:any)=>{
        this.data.push(new TranslationVO(item.variable_name, item.lv, item.en));
      });
      this._lang = lang;
    }
    public get lang():string{
        return this._lang;
    }
    public set lang(id:string){
        this._lang = id;
        for (const vo of this.data) {
            vo.lang = id;
        }
    }
    public item(key:string):TranslationVO{
        for (const vo of this.data) {
            if(vo.id===key){
                return vo;
            }
        }
        return null;
    }


}
