import {Component, ViewChild} from '@angular/core';
import {TranslationVO} from "../../../model/vo/TranslationVO";
import {ABlock} from "../../../model/ABlock";
import {RegionNameVO} from "../../../model/vo/RegionNameVO";
import {RouteVO} from "../../../model/vo/RouteVO";
import {DomSanitizer, SafeResourceUrl, SafeUrl} from "@angular/platform-browser";
import {ModelService} from "../../../model/model.service";
import {DomElementsInfo} from "../../../model/vo/DomElementsInfo";
import {Location} from "@angular/common";
import { v4 as uuidv4 } from 'uuid';
import {IModel} from "../../../model/IModel";

@Component({
  selector: 'block-t1-industry',
  templateUrl: './block-t1-industry.component.html',
  styleUrls: ['./block-t1-industry.component.scss']
})
export class BlockT1IndustryComponent extends ABlock{

  /*
  NOZARES/INDUSTRY
  */
  ///////////////////////////////////

  public routeOther:RouteVO;

  constructor() {
    super();
  }

  private updateTitleVOS():void{
    this.titleVO = this.model.translations.item('block-territory-industry-t1-title');
    this.subTitleVO = this.model.translations.item('block-territory-industry-t1-sub-title-'+this.route.T1+'-'+this.route.M1);
    this.linkVO = this.model.translations.item('view-in-map');
    const route:RouteVO = this.route.clone();
          route.M3 = 'i';

    this.route = route;

    this.link = '/'+route.lang+'/map/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(this.route.M1)+'/'+this.model.M2_getRouteNameFromID(this.route.M2,this.route.M1)+'/'+this.model.T1_getRouteNameFromID(this.route.T1)+'/'+this.route.T2+'/industry/'+this.route.M4;

    this.component_link = this.externalComponentsURL+'/'+this.route.lang+'/ext-percentage-list/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(this.route.M1)+'/'+this.model.M2_getRouteNameFromID(this.route.M2,this.route.M1)+'/'+this.model.T1_getRouteNameFromID(this.route.T1)+'/'+this.route.T2+'/industry/'+this.route.M4;
    this.component_link = this.component_link+'?dom='+this.id;
    console.dir(this.component_link);
  }
  ///////////////////////////
  ///////////////////////////
  override onChanges():void{
    if(this.initialized==false){return;}
    this.updateTitleVOS();
  }
}
