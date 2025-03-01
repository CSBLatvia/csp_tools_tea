import {Component} from '@angular/core';
import {ABlock} from "../../../model/ABlock";

@Component({
  selector: 'block-m1-m2',
  templateUrl: './block-m1-m2.component.html',
  styleUrls: ['./block-m1-m2.component.scss']
})
export class BlockM1M2Component extends ABlock{

  constructor() { super();}

  private updateTitleVOS():void {
    this.titleVO = this.model.translations.item('block-territory-m1-m2-title');
    this.descriptionVO = this.model.translations.item('block-territory-m1-m2-desc');
    this.titleVO.lang = this.model.route.lang;
    this.descriptionVO.lang = this.model.route.lang;
  }

  ///////////////////////////
  override onChanges():void{
    if(this.initialized==false){return;}
    this.updateTitleVOS();
  }
}
