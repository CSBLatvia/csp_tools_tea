import {Component} from '@angular/core';
import {ABlock} from "../../../model/ABlock";

@Component({
  selector: 'block-t1-t2',
  templateUrl: './block-t1-t2.component.html',
  styleUrls: ['./block-t1-t2.component.scss']
})
export class BlockT1T2Component extends ABlock{

  constructor() { super();}

  private updateTitleVOS=():void=>{
    this.titleVO = this.model.translations.item('block-landing-t1-t2-title');
    this.descriptionVO = this.model.translations.item('block-landing-t1-t2-description');
  }

  ///////////////////////////
  override onChanges=():void=>{
    if(this.initialized==false){return;}
    this.updateTitleVOS();
  }

}
