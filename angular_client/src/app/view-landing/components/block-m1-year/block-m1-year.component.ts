import {Component} from '@angular/core';
import {ABlock} from "../../../model/ABlock";
import {TranslationVO} from "../../../model/vo/TranslationVO";

@Component({
  selector: 'block-m1-year',
  templateUrl: './block-m1-year.component.html',
  styleUrls: ['./block-m1-year.component.scss']
})
export class BlockM1YearComponent extends ABlock{

  public titleVO_1:TranslationVO;
  public descriptionVO_1:TranslationVO;

  public titleVO_2:TranslationVO;
  public descriptionVO_2:TranslationVO;

  constructor() {super();}

  private updateTitleVOS():void{
    this.titleVO = this.model.translations.item('block-landing-m1-year-title');

    this.titleVO_1 = this.model.translations.item('block-landing-m1-year-info-title-1-'+this.route.M1+'-'+this.route.T1);
    this.descriptionVO_1 = this.model.translations.item('block-landing-m1-year-info-text-1-'+this.route.M1+'-'+this.route.T1);

    this.titleVO_2 = this.model.translations.item('block-landing-m1-year-info-title-2-'+this.route.M1+'-'+this.route.T1);
    this.descriptionVO_2 = this.model.translations.item('block-landing-m1-year-info-text-2-'+this.route.M1+'-'+this.route.T1);
  }
  ///////////////////////////

  override onChanges():void{
    if(this.initialized==false){return;}
    this.updateTitleVOS();
  }
}
