import {Component} from '@angular/core';
import {TranslationVO} from '../model/vo/TranslationVO';
import {AViewSecond} from "../model/AViewSecond";

@Component({
  selector: 'app-landing-view',
  templateUrl: './landing-view.component.html',
  styleUrls: ['./landing-view.component.scss']
})
export class LandingViewComponent extends AViewSecond{

  public titleVO:TranslationVO;
  public descriptionVO:TranslationVO;

  constructor() {
    super();
  }

  override onChanges():void{
    super.onChanges();
    this.updateTitleVOS();
  }
  private updateTitleVOS=():void=>{
    this.titleVO = this.model.translations.item('landing-view-title');
    this.descriptionVO = this.model.translations.item('landing-view-desc');
    this.descriptionVO.replaceString('[year]',this.route.year+'',this.route.year+'');
  }

}
