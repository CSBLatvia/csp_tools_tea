import {Component} from '@angular/core';
import {ABlock} from "../../../model/ABlock";
import {RouteVO} from "../../../model/vo/RouteVO";

@Component({
  selector: 'block-t1-economic',
  templateUrl: './block-t1-economic.component.html',
  styleUrls: ['./block-t1-economic.component.scss']
})
export class BlockT1EconomicComponent extends ABlock{


  constructor() { super();}

  private updateTitleVOS():void{
    this.titleVO = this.model.translations.item('block-territory-economic-t1-title');
    this.subTitleVO = this.model.translations.item('block-territory-economic-t1-sub-title-'+this.route.T1+'-'+this.route.M1);
    this.linkVO = this.model.translations.item('view-in-map');
    const route:RouteVO = this.route;
    this.link = '/'+route.lang+'/map/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(route.M1)+'/'+this.model.M2_getRouteNameFromID(route.M2,route.M1)+'/'+this.model.T1_getRouteNameFromID(route.T1)+'/'+this.route.T2+'/profession/'+this.route.M4;
    this.component_link = this.externalComponentsURL+'/'+this.route.lang+'/ext-lines-chart/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(this.route.M1)+'/'+this.model.M2_getRouteNameFromID(this.route.M2,this.route.M1)+'/'+this.model.T1_getRouteNameFromID(this.route.T1)+'/'+this.route.T2+'/'+this.model.M3_getRouteNameFromID(this.route.M3)+'/'+this.route.M4;
    this.component_link = this.component_link+'?dom='+this.id;

  }
  ///////////////////////////
  override onChanges():void{
    if(this.initialized==false){return;}
    this.updateTitleVOS();
  }
}
