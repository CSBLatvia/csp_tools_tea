import {Component, ViewChild} from '@angular/core';
import {TranslationVO} from "../../../model/vo/TranslationVO";
import {ABlock} from "../../../model/ABlock";
import {RegionNameVO} from "../../../model/vo/RegionNameVO";
import {RouteVO} from "../../../model/vo/RouteVO";
import {ModelService} from "../../../model/model.service";
import {DomElementsInfo} from "../../../model/vo/DomElementsInfo";
import {Location} from "@angular/common";
import {DomSanitizer} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";
import {TerritoryInfoVoItem} from "../../../model/vo/TerritoryInfoVoItem";
import {TerritoryInfoVO} from "../../../model/vo/TerritoryInfoVO";
import {Utils} from "../../../model/inc/Utils";

@Component({
  selector: 'block-m1-t1-t2-links',
  templateUrl: './block-m1-t1-t2-links.component.html',
  styleUrls: ['./block-m1-t1-t2-links.component.scss']
})
export class BlockM1T1T2LinksComponent extends ABlock{

  public tabVO_1:TranslationVO;
  public tabVO_2:TranslationVO;

  //compare
  public links_1:Array<any>=[];
  //map
  public links_2:Array<any>=[];

  constructor(private http:HttpClient) {
    super();
    this.logger.enabled = false;
  }

  private updateTitleVOS():void{
    this.logger.log('*************************');
    this.logger.log('BLOCK - M1-T1-T2-LINKS - updateTitleVOS()');
    this.logger.log('*************************')
    const territory_code:string = this.route.T2;
    let region:RegionNameVO = this.model.getRegionbyCode(territory_code);
    this.logger.dir(region);
    this.logger.log('*************************')

    if(!region){
      this.logger.error('BLOCK-M1-T1-T2-links - updateTitleVOS - no region!!!!');
      return;
    }else{
      this.logger.log('BLOCK-M1-T1-T2-links - region:');
      this.logger.dir(region);
    }
    let route:RouteVO = this.route;

    this.titleVO = this.model.translations.item('block-landing-m1-links-title-'+this.route.M1);

    let vo_1:TranslationVO = this.model.translations.item('block-landing-m1-link-'+this.route.M1+'-e-map-sel');
          vo_1.replaceString('[territory_gen]',region.name_lv_gen,region.name.name_en);
    let vo_2:TranslationVO = this.model.translations.item('block-landing-m1-link-'+this.route.M1+'-av-map-sel');
          vo_2.replaceString('[territory_gen]',region.name_lv_gen,region.name.name_en);
    let vo_3:TranslationVO = this.model.translations.item('block-landing-m1-link-'+this.route.M1+'-vp-map-sel');
          vo_3.replaceString('[territory_gen]',region.name_lv_gen,region.name.name_en);

    this.links_2=[];
    this.links_2=[
      {
        link:'/'+this.route.lang+'/map/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(route.M1)+'/'+this.model.M2_getRouteNameFromID('e',route.M1)+'/'+this.model.T1_getRouteNameFromID(route.T1)+'/'+this.route.T2+'/'+this.model.M3_getRouteNameFromID(route.M3)+'/'+this.route.M4,
        name:vo_1
      },
      {
        link:'/'+this.route.lang+'/map/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(route.M1)+'/added-value/'+this.model.T1_getRouteNameFromID(route.T1)+'/'+this.route.T2+'/'+this.model.M3_getRouteNameFromID(route.M3)+'/'+this.route.M4,
        name:vo_2
      },
      {
        link:'/'+this.route.lang+'/map/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(route.M1)+'/value-produced/'+this.model.T1_getRouteNameFromID(route.T1)+'/'+this.route.T2+'/'+this.model.M3_getRouteNameFromID(route.M3)+'/'+this.route.M4,
        name:vo_3
      }
    ];

    this.tabVO_1 = this.model.translations.item('block-landing-m1-t1-t2-links-tab-compare');
    this.tabVO_1.replaceString('[region]',region.name_lv_gen,region.name.name_en);
    this.tabVO_2 = this.model.translations.item('block-landing-m1-t1-t2-links-tab-map');
    this.logger.dir(this.links_2);
    this.logger.log('*************************')
  }
  ///////////////////////////
  override onChanges():void{
    if(this.initialized==false){return;}
    let newInfo:boolean = this.oldRoute==undefined||this.route.isEqual(this.oldRoute)==false;
    this.oldRoute = this.route.clone();
    this.updateTitleVOS();
    if(newInfo==true){
      this.loadData();
    }
  }

  public loadData=():void=>{
    this.links_1 = [];
    const URL:string = this.model.config.serviceURL+'?db=menu-scatter-links&m1='+this.route.M1;
    this.http.get(URL).subscribe((data:any) => this.loadDataDone({...data},this.route.lang));
  }
  public loadDataDone=(data:any,lang:string='lv'):void=>{
    const links = [];
    if(data.info=='ok'){
      const items:any = data.data;
      items.forEach((item:any)=>{
          const ob:any =  {};
          const x_code:string = item.x_axis_code;
          const y_code:string = item.y_axis_code;
          ob.link = '/'+this.route.lang+'/compare/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(this.route.M1)+'/'+this.model.M2_getRouteNameFromID('e',this.route.M1)+'/'+this.model.T1_getRouteNameFromID(this.route.T1)+'/'+this.route.T2+'/'+this.model.M3_getRouteNameFromID(this.route.M3)+'/'+this.route.M4+'/'+x_code+'/'+y_code;
          ob.name = new TranslationVO('',item.chart_title_lv,item.chart_title_en);
         ob.name.lang = this.route.lang;
        links.push(ob);
    });
      this.links_1 = links;
    }else{
      this.links_1 = [];
    }
  }


}
