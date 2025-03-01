import {Component, ViewEncapsulation} from '@angular/core';
import {TranslationVO} from '../model/vo/TranslationVO';
import {Location} from '@angular/common';
import {AViewSecond} from "../model/AViewSecond";

@Component({
  selector: 'app-about-view',
  templateUrl: './about-view.component.html',
  styleUrls: ['./about-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AboutViewComponent extends AViewSecond{


  public titleVO:TranslationVO;
  public descriptionVO:TranslationVO;
  //////////////////////////////
  public buttonBack:TranslationVO;
  public urlVO:TranslationVO;

  constructor(private location:Location) {
    super();
  }

  override onChanges():void{
    super.onChanges();
    this.updateTitleVOS();
  }

  private updateTitleVOS=():void=>{
    this.titleVO = this.model.translations.item('about-view-title');
    this.descriptionVO = this.model.translations.item('about-view-description');
    this.descriptionVO.replaceString('[year]',this.route.year+'',this.route.year+'');
    this.buttonBack = this.model.translations.item('about-view-close');
    this.titleVO.lang = this.route.lang;
    this.descriptionVO.lang = this.route.lang;
    this.buttonBack.lang = this.route.lang;
  }

  public close=():void=>{
    this.location.back();
  }


}
