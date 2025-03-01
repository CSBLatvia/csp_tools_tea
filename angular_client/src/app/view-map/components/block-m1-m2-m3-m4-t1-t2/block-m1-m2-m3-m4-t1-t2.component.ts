import {Component} from '@angular/core';
import {ABlock} from "../../../model/ABlock";

@Component({
  selector: 'block-m1-m2-m3-m4-t1-t2',
  templateUrl: './block-m1-m2-m3-m4-t1-t2.component.html',
  styleUrls: ['./block-m1-m2-m3-m4-t1-t2.component.scss']
})
export class BlockM1M2M3M4T1T2Component extends ABlock{

  constructor() { super();}
  public updateTitleVOS():void {
    this.titleVO = this.model.translations.item('block-map-m1-m2-m3-m4-t1-t2-title');
    this.descriptionVO = this.model.translations.item('block-map-m1-m2-m3-m4-t1-t2-desc');
  }
  ///////////////////////////
  override onChanges():void{
    if(this.initialized==false){return;}
    this.updateTitleVOS();
  }
}
