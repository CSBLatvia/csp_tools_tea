import {TranslationVO} from './TranslationVO';

export class RegionNameVO{

    public code:string;
    public name:TranslationVO;
    public name_short:TranslationVO;
    ///////////////////////////////
    public name_lv_dat: string;
    public name_lv_gen: string;
    public name_lv_loc: string;
    public name_lv_short: string;
    public name_lv_short_dat: string;
    public name_lv_short_gen: string;
    public name_lv_short_loc: string;

    constructor(
      code:string,
      name:TranslationVO,
      name_short:TranslationVO,
      name_lv_dat: string=null,
      name_lv_gen: string=null,
      name_lv_loc: string=null,
      name_lv_short: string=null,
      name_lv_short_dat: string=null,
      name_lv_short_gen: string=null,
      name_lv_short_loc: string=null
    ){
        this.code = code;
        this.name = name;
        this.name_short = name_short;
        ////////////////////////////
        this.name_lv_dat = name_lv_dat;
        this.name_lv_gen = name_lv_gen;
        this.name_lv_loc = name_lv_loc;
        this.name_lv_short = name_lv_short;
        this.name_lv_short_dat = name_lv_short_dat;
        this.name_lv_short_gen = name_lv_short_gen;
        this.name_lv_short_loc = name_lv_short_loc;

    }

}
