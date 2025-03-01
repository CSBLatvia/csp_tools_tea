import {Component, ViewChild} from '@angular/core';
import {TranslationVO} from "../../../model/vo/TranslationVO";
import {RouteVO} from "../../../model/vo/RouteVO";
import {ABlock} from "../../../model/ABlock";
import {RegionNameVO} from "../../../model/vo/RegionNameVO";

@Component({
  selector: 'block-t1-t2-flow',
  templateUrl: './block-t1-t2-flow.component.html',
  styleUrls: ['./block-t1-t2-flow.component.scss']
})
export class BlockT1T2FlowComponent extends ABlock{


  constructor() {
    super();
  }

  private updateTitleVOS():void{
    const territory_code:string = this.route.T2;
    let region:RegionNameVO = this.model.getRegionbyCode(territory_code);

    this.titleVO = this.model.translations.item('block-territory-flow-title');
    this.subTitleVO = this.model.translations.item('block-territory-flow-sub-title-'+this.route.T1+'-'+this.route.M1);
    if(this.route.M1=='h'){
      this.subTitleVO.replaceString('[region_loc]',region.name_lv_loc,region.name.name_en);
    }else{
      this.subTitleVO.replaceString('[region_gen]',region.name_lv_gen,region.name.name_en);
    }

    this.linkVO = this.model.translations.item('view-in-map');
    const route:RouteVO = this.route;
    this.link = '/'+route.lang+'/map/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(route.M1)+'/'+this.model.M2_getRouteNameFromID(route.M2,route.M1)+'/'+this.model.T1_getRouteNameFromID(route.T1)+'/'+this.route.T2+'/profession/'+this.route.M4;
    this.component_link = this.externalComponentsURL+'/'+this.route.lang+'/ext-flow-chart/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(this.route.M1)+'/'+this.model.M2_getRouteNameFromID(this.route.M2,this.route.M1)+'/'+this.model.T1_getRouteNameFromID(this.route.T1)+'/'+this.route.T2+'/'+this.model.M3_getRouteNameFromID(this.route.M3)+'/'+this.route.M4;
    this.component_link = this.component_link+'?dom='+this.id+'&mobile='+(this.model.dom.isMobile==true?'1':'0');

  }
  override onChanges():void{
    if(this.initialized==false){return;}
    this.updateTitleVOS();
  }
}
