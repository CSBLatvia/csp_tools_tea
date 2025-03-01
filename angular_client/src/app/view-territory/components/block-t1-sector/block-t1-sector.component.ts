import {Component} from '@angular/core';
import {ABlock} from "../../../model/ABlock";
import {RouteVO} from "../../../model/vo/RouteVO";

@Component({
  selector: 'block-t1-sector',
  templateUrl: './block-t1-sector.component.html',
  styleUrls: ['./block-t1-sector.component.scss']
})
export class BlockT1SectorComponent extends ABlock{

  /*
  Sektors
  */

  ///////////////////////////////////
  public routeOther:RouteVO;

  constructor() { super(); }


  private updateTitleVOS():void{
    this.titleVO = this.model.translations.item('block-territory-sector-t1-title');
    this.linkVO = this.model.translations.item('view-in-map');
    const route:RouteVO = this.route.clone();
          route.M3 = 's';

    this.routeOther = route;
    this.link = '/'+route.lang+'/map/'+route.year+'/'+this.model.M1_getRouteNameFromID(route.M1)+'/'+this.model.M2_getRouteNameFromID(route.M2,route.M1)+'/'+this.model.T1_getRouteNameFromID(route.T1)+'/'+route.T2+'/sector/'+route.M4;

    this.component_link = this.externalComponentsURL+'/'+route.lang+'/ext-percentage-bar/'+route.year+'/'+this.model.M1_getRouteNameFromID(route.M1)+'/'+this.model.M2_getRouteNameFromID(route.M2,route.M1)+'/'+this.model.T1_getRouteNameFromID(route.T1)+'/'+route.T2+'/sector/'+route.M4
    this.component_link = this.component_link+'?dom='+this.id;
    console.dir(this.component_link);
  }
  ///////////////////////////
  override onChanges():void{
    if(this.initialized==false){return;}
    this.updateTitleVOS();
  }
}
