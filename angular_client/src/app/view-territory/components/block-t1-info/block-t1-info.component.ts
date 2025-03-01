import {Component, ViewChild} from '@angular/core';
import {ABlock} from "../../../model/ABlock";
import {TranslationVO} from "../../../model/vo/TranslationVO";
import {RouteVO} from "../../../model/vo/RouteVO";
import { v4 as uuidv4 } from 'uuid';
import {TerritoryInfoVO} from "../../../model/vo/TerritoryInfoVO";
import {TerritoryInfoVoItem} from "../../../model/vo/TerritoryInfoVoItem";
import {HttpClient} from "@angular/common/http";
import {Utils} from "../../../model/inc/Utils";
import {ModelService} from "../../../model/model.service";

@Component({
  selector: 'block-t1-info',
  templateUrl: './block-t1-info.component.html',
  styleUrls: ['./block-t1-info.component.scss']
})
export class BlockT1InfoComponent extends ABlock{

  public info:TerritoryInfoVO;

  public pie_chart_link_out:string;
  public pie_chart_link_in:string;

  public id_out:string = uuidv4();
  public id_in:string = uuidv4();
  //////////////////////////////
  public routeOther_in:RouteVO;
  public routeOther_out:RouteVO;


  constructor(private http:HttpClient) { super();}

  private updateTitleVOS():void{

    let ob_w:TranslationVO = this.model.translations.item('m2-value-1-w');
    let ob_h:TranslationVO = this.model.translations.item('m2-value-1-h');
    this.titleVO = this.model.translations.item('block-territory-t1-info-title-'+this.route.T1+'-'+this.route.M2);

    this.component_link = this.externalComponentsURL+'/'+this.route.lang+'/ext-map-territory/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(this.route.M1)+'/'+this.model.M2_getRouteNameFromID(this.route.M2,this.route.M1)+'/'+this.model.T1_getRouteNameFromID(this.route.T1)+'/'+this.route.T2+'/'+this.model.M3_getRouteNameFromID(this.route.M3)+'/'+this.route.M4
    this.component_link = this.component_link+'?dom='+this.id;

    this.pie_chart_link_out = this.externalComponentsURL+'/'+this.route.lang+'/ext-pie-chart/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(this.route.M1)+'/'+this.model.M2_getRouteNameFromID(this.route.M2,this.route.M1)+'/'+this.model.T1_getRouteNameFromID(this.route.T1)+'/'+this.route.T2+'/'+this.model.M3_getRouteNameFromID(this.route.M3)+'/'+this.route.M4+'/out';
    this.pie_chart_link_out = this.pie_chart_link_out+'?dom='+this.id_out;
    this.routeOther_out = this.model.getRoute();
    this.routeOther_out.direction='out';

    this.pie_chart_link_in = this.externalComponentsURL+'/'+this.route.lang+'/ext-pie-chart/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(this.route.M1)+'/'+this.model.M2_getRouteNameFromID(this.route.M2,this.route.M1)+'/'+this.model.T1_getRouteNameFromID(this.route.T1)+'/'+this.route.T2+'/'+this.model.M3_getRouteNameFromID(this.route.M3)+'/'+this.route.M4+'/in';
    this.pie_chart_link_in = this.pie_chart_link_in+'?dom='+this.id_in;
    this.routeOther_in = this.model.getRoute();
    this.routeOther_in.direction='in';

    if(this.route.M2=='e'){
      if(this.route.M1=='w'){
        this.titleVO.replaceString('[m2]',ob_w.name_lv.toLowerCase(),ob_w.name_en);
      }else if(this.route.M1=='h'){
        this.titleVO.replaceString('[m2]',ob_h.name_lv.toLowerCase(),ob_h.name_en);
      }
    }
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
    const URL:string = this.model.config.serviceURL+'?db=map-territory-info&lang='+this.route.lang+'&year='+this.route.year+'&m1='+this.route.M1+'&m2='+this.route.M2+'&m3='+this.route.M3+'&m4='+this.route.M4+'&t1='+this.route.T1+'&t2='+this.route.T2;
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
