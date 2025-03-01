import {Component} from '@angular/core';
import {TranslationVO} from "../../model/vo/TranslationVO";
import {ControlValueVO} from "../../ui-controls/vos/ControlValueVO";
import {AChooseUI} from "../../model/AChooseUI";
import {ModelService} from "../../model/model.service";

@Component({
  selector: 'app-choose-m3',
  templateUrl: './choose-m3.component.html',
  styleUrls: ['./choose-m3.component.scss']
})
export class ChooseM3Component extends AChooseUI {

  ///////////////////////////////////////////
  // M1 - place - work, home
  // M2 - added value, number-of-employees, value-produced-by-employees
  // M3 - industry, profesion, sector

  //  - mprofs:       https://tools.csb.gov.lv/tea/api?db=menu-profs
  //  - mnaces:       https://tools.csb.gov.lv/tea/api?db=menu-naces
  //  - msectors:     https://tools.csb.gov.lv/tea/api?db=menu-sector
  //  - territories:  https://tools.csb.gov.lv/tea/api?db=menu-territories&level=4
  //  - years:        https://tools.csb.gov.lv/tea/api?db=menu-years

  // M4 - chosen M3
  // T1 - territory one
  // T2 - territory two
  ///////////////////////////////
  public  m3:string = '';
  public  m3_label:TranslationVO;
  public  m3_data:Array<ControlValueVO>=[];


  override onComponentLanguageChanged():void {
    this.m3_label = this.model.settings.m3_label;
  }
  override onComponentValuesChanged():void {
    this.route = this.model.getRoute();
    this.lang = this.route.lang;

    this.m3 = this.model.settings.m3;
    this.m3_data = this.model.settings.m3_data;
    this.m3_label = this.model.settings.m3_label;
  }
  override onChange(vo:ControlValueVO):void{
    this.model.settings.changeM3(vo);
  }

}
