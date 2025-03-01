import {Component} from '@angular/core';
import {ABlock} from "../../../model/ABlock";

@Component({
  selector: 'app-block-m1-m3-m4-t1-t2-year',
  templateUrl: './block-m1-m3-m4-t1-t2-year.component.html',
  styleUrls: ['./block-m1-m3-m4-t1-t2-year.component.scss']
})
export class BlockM1M3M4T1T2YearComponent extends ABlock{

  constructor() { super();}
  private updateTitleVOS=():void=>{
    this.titleVO = this.model.translations.item('block-compare-title-'+this.route.T1);
    this.descriptionVO = this.model.translations.item('block-compare-desc');
  }
  ///////////////////////////
  override onChanges():void{
    if(this.initialized==undefined){return;}
    this.updateTitleVOS();
  }
}
