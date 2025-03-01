import {inject, Injectable} from '@angular/core';
import {AComponentService} from "./AComponentService";
import {IComponentService} from "./IComponentService";
import {HttpClient} from "@angular/common/http";
import {ComponentServiceErrorVO} from "./ComponentServiceErrorVO";
import {MiniModelService} from "../../../app/model/minimodel.service";
import {ComponentServiceEmptyVO} from "./ComponentServiceEmptyVO";
import {TranslationVO} from "../../../app/model/vo/TranslationVO";
import {RouteVO} from "../../../app/model/vo/RouteVO";


export class ScatterPlotService extends AComponentService implements IComponentService  {

  protected override http:HttpClient = inject(HttpClient);

  public titleX:TranslationVO;
  public titleY:TranslationVO;
  public title:TranslationVO;
  public x_type:string = '' //count,money
  public y_type:string = '' //count,money
  private types_count:Array<string>=[
  "empl",
  "empl_level",
  "empl_wp_100",
  "wp"
  ]
  private types_money:Array<string>=[
    "va_emp",
    "va_h",
    "va_w",
    "va_wp"
  ]




  constructor() {
    super();
    this.FUNCTION = 'scatter-plot';
  }
  override loadData(route: RouteVO):void{
      this.route = route;
      this.model.translations.lang = this.route.lang;

      this.data=[];
      this.x_type = this.types_count.indexOf(route.SX)==-1?'money':'count';
      this.y_type = this.types_count.indexOf(route.SY)==-1?'money':'count';
      const URL:string = this.model.config.serviceURL+'?db=scatter-plot&lang='+route.lang+'&year='+route.year+'&m1='+route.M1+'&m2='+route.M2+'&m3='+route.M3+'&m4='+route.M4+'&t1='+route.T1+'&t2='+route.T2+'&sx='+route.SX+'&sy='+route.SY;
      this.http.get(URL).subscribe((data:any) => this.onLoaded({...data},route.lang));
  }

  override onLoaded(ob:any,lang:string):void {
    if(ob.info=='ok'&& ob.data.scatter_chart_set!==undefined){
        if(ob.data.scatter_chart_set.scatter_chart_data!==null){
          //ok
          this.data = ob.data.scatter_chart_set.scatter_chart_data;
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
          this.title = new TranslationVO('', ob.data.scatter_chart_set.scatter_texts.chart_title_lv, ob.data.scatter_chart_set.scatter_texts.chart_title_en);
          this.titleX = new TranslationVO('', ob.data.scatter_chart_set.scatter_texts.x_axis_title_lv, ob.data.scatter_chart_set.scatter_texts.x_axis_title_en);
          this.titleY = new TranslationVO('', ob.data.scatter_chart_set.scatter_texts.y_axis_title_lv, ob.data.scatter_chart_set.scatter_texts.y_axis_title_en);

          this.title.lang = lang;
          this.titleX.lang = lang;
          this.titleY.lang = lang;

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

}
