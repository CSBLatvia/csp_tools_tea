import {Component} from '@angular/core';
import {TranslationVO} from "../model/vo/TranslationVO";

import {Location} from "@angular/common";
import {ItemApiVO} from "../model/vo/ItemApiVO";
import {AViewSecond} from "../model/AViewSecond";

@Component({
  selector: 'app-about-api-view',
  templateUrl: './about-api-view.component.html',
  styleUrls: ['./about-api-view.component.scss']
})
export class AboutApiViewComponent extends AViewSecond {

  public title:TranslationVO;
  public description:TranslationVO;
  public items:Array<ItemApiVO>=[];


  constructor(private location: Location) {
    super();
  }

  override onChanges():void{
    super.onChanges();
    this.updateTitleVOS();
  }


  updateTitleVOS():void{
    if(this.initialized===true){return;}

    this.title = this.model.translations.item('api-title');
    this.description = this.model.translations.item('api-description');
    this.title.lang = this.lang;
    this.description.lang = this.lang;

    /////////////////////////////////////////////////
    this.items=[
      new ItemApiVO(this.returnItemAPIByName('api-f1')),
      new ItemApiVO(this.returnItemAPIByName('api-f2')),
      new ItemApiVO(this.returnItemAPIByName('api-f3')),
      new ItemApiVO(this.returnItemAPIByName('api-f4')),
      new ItemApiVO(this.returnItemAPIByName('api-f5')),
      new ItemApiVO(this.returnItemAPIByName('api-f6')),
      new ItemApiVO(this.returnItemAPIByName('api-f7')),
      new ItemApiVO(this.returnItemAPIByName('api-f8')),
      new ItemApiVO(this.returnItemAPIByName('api-f9')),
      new ItemApiVO(this.returnItemAPIByName('api-f10')),
      new ItemApiVO(this.returnItemAPIByName('api-f11')),
      new ItemApiVO(this.returnItemAPIByName('api-f12')),
      new ItemApiVO(this.returnItemAPIByName('api-f13'))
    ];
    this.items.forEach((vo:ItemApiVO)=>{
      vo.lang = this.route.lang;
    })
  }
  private returnItemAPIByName=(name:string):Array<TranslationVO>=>{
    let arr:Array<TranslationVO> = [
        this.model.translations.item(name),
        this.model.translations.item(name+'-descr'),
        this.model.translations.item(name+'-url'),
        this.model.translations.item(name+'-table')
    ];
    //// console.dir(arr);
    arr[2].replaceString('[host]',this.model.config.hostURL,this.model.config.hostURL);
    return arr;
  }
  public close=():void=>{
    this.location.back();
  }

}
