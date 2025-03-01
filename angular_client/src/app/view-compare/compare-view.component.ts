import {Component} from '@angular/core';
import {TranslationVO} from "../model/vo/TranslationVO";
import {AViewSecond} from "../model/AViewSecond";

@Component({
  selector: 'app-compare-view',
  templateUrl: './compare-view.component.html',
  styleUrls: ['./compare-view.component.scss']
})
export class CompareViewComponent extends AViewSecond {

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
    //this.titleVO = this.model.translations.item('compare-view-title');
    //this.descriptionVO = this.model.translations.item('compare-view-desc');
    //this.descriptionVO.replaceString('[year]',this.route.year+'',this.route.year+'');
  }
}
