import {Component} from '@angular/core';
import {TranslationVO} from "../model/vo/TranslationVO";
import {AViewSecond} from "../model/AViewSecond";

@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent extends AViewSecond {

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
