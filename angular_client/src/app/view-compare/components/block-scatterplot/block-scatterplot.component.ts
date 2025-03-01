import {Component, ViewChild} from '@angular/core';
import {TranslationVO} from "../../../model/vo/TranslationVO";
import {ABlock} from "../../../model/ABlock";
import {RegionNameVO} from "../../../model/vo/RegionNameVO";
import {RouteVO} from "../../../model/vo/RouteVO";

@Component({
  selector: 'app-block-scatterplot',
  templateUrl: './block-scatterplot.component.html',
  styleUrls: ['./block-scatterplot.component.scss']
})
export class BlockScatterplotComponent extends ABlock{


  //////////////////////////////
  public routeOther:RouteVO;
  public axisType:string = 'lin_lin';

  constructor() {
    super();
    this.logger.enabled = false;
  }

  public onAxisChange(value:string):void{
    this.axisType = value;
    this.updateTitleVOS();
  }
  private updateTitleVOS=():void=>{

    this.titleVO = this.model.translations.item('block-scatterplot-title');
    this.titleVO.lang = this.route.lang;

    this.component_link = this.externalComponentsURL+'/'+this.route.lang+'/ext-scatter-plot/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(this.route.M1)+'/'+this.model.M2_getRouteNameFromID(this.route.M2,this.route.M1)+'/'+this.model.T1_getRouteNameFromID(this.route.T1)+'/'+this.route.T2+'/'+this.model.M3_getRouteNameFromID(this.route.M3)+'/'+this.route.M4+'/'+this.route.SX+'/'+this.route.SY+'/'+this.axisType;
    this.component_link = this.component_link+'?dom='+this.id;

    this.routeOther = this.model.getRoute();

  }
  private firsCharToUpperCase(str:string):string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  ///////////////////////////

  override onChanges=():void=>{
    if(this.initialized==false){return;}
    this.updateTitleVOS();
  }
}
