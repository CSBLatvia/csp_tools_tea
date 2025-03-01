import {Component} from '@angular/core';
import {TranslationVO} from "../model/vo/TranslationVO";
import {AViewSecond} from "../model/AViewSecond";

@Component({
  selector: 'app-territory-view',
  templateUrl: './territory-view.component.html',
  styleUrls: ['./territory-view.component.scss']
})
export class TerritoryViewComponent extends AViewSecond{

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
    this.titleVO = this.model.translations.item('map-view-title');
    this.descriptionVO = this.model.translations.item('map-view-desc');
    this.descriptionVO.replaceString('[year]',this.route.year+'',this.route.year+'');
  }

}
