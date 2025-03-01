import {Component, ViewChild} from '@angular/core';
import {TranslationVO} from "../../../model/vo/TranslationVO";
import {ABlock} from "../../../model/ABlock";
import {RegionNameVO} from "../../../model/vo/RegionNameVO";
import {RouteVO} from "../../../model/vo/RouteVO";
import { v4 as uuidv4 } from 'uuid';
import {TerritoryInfoVO} from "../../../model/vo/TerritoryInfoVO";
import {TerritoryInfoVoItem} from "../../../model/vo/TerritoryInfoVoItem";
import {HttpClient} from "@angular/common/http";
import {Utils} from "../../../model/inc/Utils";
import {ModelService} from "../../../model/model.service";

@Component({
  selector: 'block-t1-t2-info',
  templateUrl: './block-t1-t2-info.component.html',
  styleUrls: ['./block-t1-t2-info.component.scss']
})
export class BlockT1T2InfoComponent extends ABlock{

  public regionVO:RegionNameVO;
  public buttonVO:TranslationVO;
  public info:TerritoryInfoVO = null;

  constructor(private http:HttpClient) { super();}

  private updateTitleVOS():void{
    this.regionVO = this.model.getRegionbyCode(this.route.T2);
    this.regionVO.name.lang = this.route.lang;

    this.titleVO = this.model.translations.item('territory-info-title-'+this.route.M2+'-'+this.route.M1).clone();
    this.titleVO.replaceString('[region_gen]',this.regionVO.name_lv_gen,this.regionVO.name.name_en);
    this.titleVO.replaceString('[region_loc]',this.regionVO.name_lv_loc,this.regionVO.name.name_en);
    this.titleVO.lang = this.route.lang;

    this.buttonVO = this.model.translations.item('btn-'+this.route.M1+'-block-link');
    this.link ='/'+this.route.lang+'/territory/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(this.route.M1)+'/'+this.model.M2_getRouteNameFromID(this.route.M2,this.route.M1)+'/'+this.model.T1_getRouteNameFromID(this.route.T1)+'/'+this.route.T2+'/'+this.model.M3_getRouteNameFromID(this.route.M3)+'/'+this.route.M4;

    this.component_link = this.externalComponentsURL+'/'+this.route.lang+'/ext-map-territory/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(this.route.M1)+'/'+this.model.M2_getRouteNameFromID(this.route.M2,this.route.M1)+'/'+this.model.T1_getRouteNameFromID(this.route.T1)+'/'+this.route.T2+'/'+this.model.M3_getRouteNameFromID(this.route.M3)+'/'+this.route.M4
    this.component_link = this.component_link+'?dom='+this.id;
  }
  override onChanges():void{
    if(this.initialized==false){return;}
    let newInfo:boolean = this.oldRoute==undefined||this.route.isEqual(this.oldRoute)==false;
    this.oldRoute = this.route.clone();
    this.updateTitleVOS();
    if(newInfo == true || this.info==null){
      this.loadTerritoryInfo();
    }
  }
  public loadTerritoryInfo=():void=>{
    this.info = null;
    const func:string = this.route.view=='landing'?'map-territory-info-home':'map-territory-info';
    const URL:string = this.model.config.serviceURL+'?db='+func+'&lang='+this.route.lang+'&year='+this.route.year+'&m1='+this.route.M1+'&m2='+this.route.M2+'&m3='+this.route.M3+'&m4='+this.route.M4+'&t1='+this.route.T1+'&t2='+this.route.T2;
    this.http.get(URL).subscribe((data:any) => this.loadTerritoryInfoDone({...data},this.route.lang));
  }
  public loadTerritoryInfoDone=(data:any,lang:string='lv'):void=>{
    if(data.info=='ok'){
      const ob:any = data.data.map_territory_info;
      const items:Array<TerritoryInfoVoItem> = [];
      ob.data[0].forEach((item:any)=>{
        items.push(new TerritoryInfoVoItem(item.variable,item.name,item.value!==undefined?item.value:-1));
      })
      this.info = new TerritoryInfoVO(ob.title,items);
      //this.parseInfoValues();
      this.updateTitleVOS();

    }else{
      this.info = null;
    }
  }
  private parseInfoValues=():void=>{

    // y15y64
    // empl_count
    // empl_level

    //value_sum
    //per_empl

    this.info.data.forEach((vo:TerritoryInfoVoItem)=>{

      if(vo.variable=='y15y64'){
        vo.name = this.model.translations.item('territory-info-e-'+this.route.M1+'-1').name;
        vo.valueSTR = Utils.prettyNumber(vo.value);

      }else if(vo.variable=='empl_count'){
        vo.name = this.model.translations.item('territory-info-e-'+this.route.M1+'-2').name;
        vo.valueSTR = Utils.prettyNumber(vo.value);

      }else if(vo.variable=='empl_level'){
        vo.name = this.model.translations.item('territory-info-e-'+this.route.M1+'-3').name;
        vo.valueSTR = Utils.prettyNumber(vo.value)+' '+(this.route.lang=='lv'?'darbvietas':'workplaces');

      }else if(vo.variable=='value_sum'){
        vo.name = this.model.translations.item('territory-info-'+this.route.M2+'-'+this.route.M1+'-1').name;
        vo.valueSTR = Utils.prettyNumber(vo.value)+' €';

      }else if(vo.variable=='per_empl'){
        vo.name = this.model.translations.item('territory-info-'+this.route.M2+'-'+this.route.M1+'-2').name;
        vo.valueSTR = Utils.prettyNumber(vo.value)+' €';

      }else{
        vo.name = 'unknown variable:'+vo.variable;
      }
    })
  }
}
