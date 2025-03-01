import {TranslationVO} from "./TranslationVO";

export class ScatterValueVO {


  public axis:string;
  public code:string;
  public comments:string;
  public display:string;   // w or h
  public title:TranslationVO;

  constructor(
    axis:string,
    code:string,
    comments:string,
    display:string,
    title_en:string,
    title_lv:string
  ) {

    this.axis = axis;
    this.code = code;
    this.comments = comments;
    this.display = display;
    this.title = new TranslationVO('scatter_title',title_lv,title_en);
  }


}
