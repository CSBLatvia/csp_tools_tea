import {TranslationVO} from "./TranslationVO";

export class ItemApiTableVO{

  public lang:string='lv';
  public field:string;
  public info:string;

  constructor(field:string,info:string=''){
    this.field = field;
    this.info = info;
    if(this.info!==''){
      this.info = this.info.replace(/&apos;/g, "'");
    }
  }

}
