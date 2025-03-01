import {Component} from '@angular/core';
import {TranslationVO} from "../../model/vo/TranslationVO";
import {ControlValueVO} from "../../ui-controls/vos/ControlValueVO";
import {AChooseUI} from "../../model/AChooseUI";
import {ModelService} from "../../model/model.service";

@Component({
  selector: 'app-choose-t2',
  templateUrl: './choose-t2.component.html',
  styleUrls: ['./choose-t2.component.scss']
})
export class ChooseT2Component extends AChooseUI {

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

  public  t2:string = '';
  public  t2_label:TranslationVO;
  public  t2_search_label:TranslationVO;
  public  t2_data:Array<ControlValueVO>=[];
  public  t2_loading:boolean = false;


  //////////////////////////////////

  override onComponentLanguageChanged():void {
    this.t2_label = this.model.settings.t2_search_label;
    this.t2_search_label = this.model.translations.item('t2-search-label');
    this.t2_data.forEach((item:ControlValueVO)=>{
      item.name.lang = this.model.translations.lang;
    });
  }
  override onComponentValuesChanged():void {
    this.route = this.model.getRoute();
    this.lang = this.route.lang;

    this.t2 = this.model.settings.t2;
    this.t2_data = this.model.settings.t2_data;
    this.t2_loading = this.model.settings.t2_loading;
    this.t2_label = this.model.translations.item('t2-'+this.route.T1+'-label');
    this.t2_search_label = this.model.translations.item('t2-search-label');
  }
  override onChange(vo:ControlValueVO):void{
    this.model.settings.changeT2(vo);
  }

}
