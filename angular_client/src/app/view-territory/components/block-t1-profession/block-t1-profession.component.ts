import {Component} from '@angular/core';
import {ABlock} from "../../../model/ABlock";
import {RouteVO} from "../../../model/vo/RouteVO";

@Component({
  selector: 'block-t1-profession',
  templateUrl: './block-t1-profession.component.html',
  styleUrls: ['./block-t1-profession.component.scss']
})
export class BlockT1ProfessionComponent extends ABlock{

  /*
  Profesijas
  */
  public routeOther:RouteVO;

  constructor() { super();}


  private updateTitleVOS():void{
    this.titleVO = this.model.translations.item('block-territory-profession-t1-title');
    this.subTitleVO = this.model.translations.item('block-territory-profession-t1-sub-title-'+this.route.T1+'-'+this.route.M1);
    this.linkVO = this.model.translations.item('view-in-map');
    const route:RouteVO = this.route;
          route.M3 = 'p';

    this.routeOther = route;

    this.link = '/'+route.lang+'/map/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(route.M1)+'/'+this.model.M2_getRouteNameFromID(route.M2,route.M1)+'/'+this.model.T1_getRouteNameFromID(route.T1)+'/'+this.route.T2+'/profession/'+this.route.M4;

    this.component_link = this.externalComponentsURL+'/'+route.lang+'/ext-percentage-list/'+route.year+'/'+this.model.M1_getRouteNameFromID(route.M1)+'/'+this.model.M2_getRouteNameFromID(route.M2,route.M1)+'/'+this.model.T1_getRouteNameFromID(route.T1)+'/'+route.T2+'/profession/'+route.M4
    this.component_link = this.component_link+'?dom='+this.id;
    console.dir(this.component_link);
  }
  ///////////////////////////
  override onChanges():void{
    if(this.initialized==false){return;}
    this.updateTitleVOS();
  }
}
