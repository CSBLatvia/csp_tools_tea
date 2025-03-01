import {TranslationVO} from '../../model/vo/TranslationVO';

export class ControlValueVO{

  public name:TranslationVO;
  public id:string;
  public index:number=-1;
  public color:string;
  public active:boolean = false;

  constructor(id:string,name:TranslationVO,active:boolean = false,index:number=-1,color:string='#ffffff'){
    this.id = id;
    this.name = name;
    this.active = active;
    this.index = index;
    this.color = color;
  }

}
