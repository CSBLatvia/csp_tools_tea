import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ControlValueVO} from "../../ui-controls/vos/ControlValueVO";
import {TranslationVO} from "../../model/vo/TranslationVO";
import {AChooseUI} from "../../model/AChooseUI";
import {ModelService} from "../../model/model.service";

@Component({
  selector: 'app-choose-m2-m2',
  templateUrl: './choose-m2-m2.component.html',
  styleUrls: ['./choose-m2-m2.component.scss']
})
export class ChooseM2M2Component extends AChooseUI {

  @Input() mobile:boolean = false;
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

  public  m2:string = '';
  public  sx:string = '';
  public  sy:string = '';

  public  label_horizontal:TranslationVO;
  public  label_vertical:TranslationVO;

  public  sx_data:Array<ControlValueVO>=[];
  public  sy_data:Array<ControlValueVO>=[];
  public ids:Array<string> = ['e','av','vp'];

  public  axisLabels:Array<TranslationVO>=[];
  public  axisRadioLabel:TranslationVO;
  public  axisValuesX:Array<ControlValueVO>=[];
  public  axisValuesY:Array<ControlValueVO>=[];
  public x_type_id:string = 'lin';
  public y_type_id:string = 'lin';

  @Output() onAxisChange:EventEmitter<string> = new EventEmitter<string>();




  override onComponentLanguageChanged():void {
    this.label_vertical = this.model.translations.item('choose-m2-m2-title-vertical');
    this.label_horizontal = this.model.translations.item('choose-m2-m2-title-horizontal');
    this.axisRadioLabel = this.model.translations.item('ui-radio-scatter-scale-label');
  }


  override onComponentValuesChanged():void {

    this.route = this.model.getRoute();
    this.lang = this.route.lang;

    if(this.axisLabels.length==0){
      this.axisLabels = [this.model.translations.item('ui-radio-scatter-linear'),this.model.translations.item('ui-radio-scatter-logarithmic') ];
      this.axisValuesX = [new ControlValueVO('lin',this.axisLabels[0]), new ControlValueVO('log', this.axisLabels[1]) ];
      this.axisValuesY = [new ControlValueVO('lin',this.axisLabels[0]), new ControlValueVO('log', this.axisLabels[1]) ];
    }else{
      this.axisLabels[0].lang = this.lang;
      this.axisLabels[1].lang = this.lang;
    }

    this.sx_data = this.route.M1=='w'?[...this.model.settings.sx_data_w]:[...this.model.settings.sx_data_h];
    this.sy_data = this.route.M1=='w'?[...this.model.settings.sy_data_w]:[...this.model.settings.sy_data_h];

    this.m2 = this.route.M2;
    this.sx = this.route.SX;
    this.sy = this.route.SY;

    this.sx_data.forEach((item:ControlValueVO)=>{
      item.active = false;
      if(this.sx==item.id){
        item.active = true;
      }
    });
    this.sy_data.forEach((item:ControlValueVO)=>{
      item.active = false;
      if(this.sy==item.id){
        item.active = true;
      }
    });
  }
  override onChange(vo:ControlValueVO):void{
    this.axisLabels = [this.model.translations.item('ui-radio-scatter-linear'),this.model.translations.item('ui-radio-scatter-logarithmic') ];
    this.axisLabels[0].lang = this.lang;
    this.axisLabels[1].lang = this.lang;
    this.axisValuesX = [new ControlValueVO('lin',this.axisLabels[0]), new ControlValueVO('log', this.axisLabels[1]) ];
    this.axisValuesY = [new ControlValueVO('lin',this.axisLabels[0]), new ControlValueVO('log', this.axisLabels[1]) ];
    return null;
  }
  public onChange_1(vo:ControlValueVO):void{
    this.model.settings.changeSX_SY(vo.id,this.route.SY);
  }
  public onChange_2(vo:ControlValueVO):void{
    this.model.settings.changeSX_SY(this.route.SX,vo.id);
  }

  public onChangeX(vo:ControlValueVO):void{
    this.x_type_id = vo.id;
    this.onAxisChange.emit(this.x_type_id+'_'+this.y_type_id);
  }
  public onChangeY(vo:ControlValueVO):void{
    this.y_type_id = vo.id;
    this.onAxisChange.emit(this.x_type_id+'_'+this.y_type_id);
  }

}
