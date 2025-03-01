import {inject, Injectable} from '@angular/core';
import {AComponentService} from "./AComponentService";
import {IComponentService} from "./IComponentService";
import {HttpClient} from "@angular/common/http";
import {MiniModelService} from "../../../app/model/minimodel.service";
import {ComponentServiceEmptyVO} from "./ComponentServiceEmptyVO";
import {ComponentServiceErrorVO} from "./ComponentServiceErrorVO";
import {Router} from "@angular/router";
import {TranslationVO} from "../../../app/model/vo/TranslationVO";
import {RouteVO} from "../../../app/model/vo/RouteVO";


export class FlowChartService extends AComponentService implements IComponentService{

// a_generate_map_viz(lang,year,m1,m2,m3,m4,t1,t2)
  protected override http:HttpClient = inject(HttpClient);

  public title:TranslationVO;
  public titleWork:TranslationVO;
  public titleHome:TranslationVO;
  public mobile:boolean = false; //mobile=1, mobile=-1

  protected router:Router = inject(Router);

  constructor() {
    super();
    this.FUNCTION = 'flow-chart';
  }
  override loadData(route: RouteVO) {
    this.parseURLParams();
    this.data=[];

    const URL:string = this.model.config.serviceURL+'?db='+this.FUNCTION+'&lang='+route.lang+'&year='+route.year+'&m1='+route.M1+'&m2='+route.M2+'&m3='+route.M3+'&m4='+route.M4+'&t1='+route.T1+'&t2='+route.T2;
    this.http.get(URL).subscribe((data:any) => this.onLoaded({...data},route.lang));
  }
  override onLoaded(ob:any,lang:string):void {
    if(ob.info=='ok'&& ob.data.flow_chart_set!==undefined){
      if(ob.data.flow_chart_set.data!==null){
        //ok
        this.data = ob.data.flow_chart_set.data;
        /*
        "scatter_chart_set": {
            "scatter_texts": {
                "chart_title_lv": "Teritorijā nodarbināto skaits un pievienotā vērtība",
                "chart_title_en": "Teritorijā nodarbināto skaits un pievienotā vērtība",
                "x_axis_title_lv": "Pievienotā vērtība",
                "x_axis_title_en": "Pievienotā vērtība",
                "y_axis_title_lv": "Darbvietu skaits",
                "y_axis_title_en": "Darbvietu skaits"
         */
        this.title = new TranslationVO('', ob.data.flow_chart_set.title, ob.data.flow_chart_set.title);
        this.title.lang = lang;
        this.titleHome = this.model.translations.item('t1-title-h');
        this.titleHome.lang = lang;
        this.titleWork = this.model.translations.item('t1-title-w');
        this.titleWork.lang = lang;

        super.onLoaded(this.data);


      }else{

        //not ok
        this.empty = new ComponentServiceEmptyVO(
          this.model.translations.item('ext-no-data-title').name,
          this.model.translations.item('ext-no-data-text').name,
          this.route.toString().replaceAll('\n','<br>')
        );
        super.onLoaded(null);

      }
    }else{

      //not ok
      this.error = new ComponentServiceErrorVO(
        this.model.translations.item('ext-api-request-error').name,
        ob.data.error_msg,ob.data.error_detail.replace(',',', ')
      );
      super.onLoaded(null);
    }
  }

  private parseURLParams():void{
    const hasParams:boolean = this.router.url.split('?').length>1;
    let param_arr:Array<string>;
    let param:string='';
    let value:string='';

    if(hasParams===true){
      const params:Array<string> = this.router.url.split('?')[1].split('&');
      params.forEach((item:string)=>{
        param_arr = item.split('=');
        if(param_arr.length===2){
          param = item.split('=')[0];
          value = item.split('=')[1];
          if(param==='mobile'){
            this.mobile = value==='1'?true:false;
          }
        }
      });
    }
  }
}
