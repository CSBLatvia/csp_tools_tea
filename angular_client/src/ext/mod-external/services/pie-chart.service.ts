import {inject, Injectable} from '@angular/core';
import {AComponentService} from "./AComponentService";
import {IComponentService} from "./IComponentService";
import {HttpClient} from "@angular/common/http";
import {MiniModelService} from "../../../app/model/minimodel.service";
import {ComponentServiceEmptyVO} from "./ComponentServiceEmptyVO";
import {ComponentServiceErrorVO} from "./ComponentServiceErrorVO";
import {PieChartVO} from "../components/comp-pie-chart/vos/PieChartVO";
import {RouteVO} from "../../../app/model/vo/RouteVO";


export class PieChartService  extends AComponentService implements IComponentService  {

// a_generate_pie_chart(lang,year,m1,m2,m3,m4,t1,t2, direction)
  protected override http:HttpClient = inject(HttpClient);

  constructor() {
    super();
    this.FUNCTION = 'pie-chart';
  }
  override loadData(route: RouteVO) {
    this.data=[];
    const URL:string = this.model.config.serviceURL+'?db='+this.FUNCTION+'&lang='+route.lang+'&year='+route.year+'&m1='+route.M1+'&m2='+route.M2+'&m3='+route.M3+'&m4='+route.M4+'&t1='+route.T1+'&t2='+route.T2+'&direction='+route.direction;
    this.http.get(URL).subscribe((data:any) => this.onLoaded({...data},route.lang));
  }

  override onLoaded(ob:any,lang:string):void {
    if(ob.info=='ok'&& ob.data.pie_chart_set!==undefined){

      if(ob.data.pie_chart_set.data==null  || ob.data.pie_chart_set.text==null ){
        //not ok
        this.data=[];
        this.empty = new ComponentServiceEmptyVO(
          this.model.translations.item('ext-no-data-title').name,
          this.model.translations.item('ext-no-data-text').name,
          this.route.toString().replaceAll('\n','<br>')
        );
        super.onLoaded(null);

      }else{

        //ok
        const obj:any = ob.data.pie_chart_set;
        let content:PieChartVO = new PieChartVO(
          obj.text!==null?obj.text:'text prop is empty..',
          obj.data[0].pct
        );
        super.onLoaded(content);
      }

    }else{
      //not ok
      this.data=[];
      this.error = new ComponentServiceErrorVO(
        this.model.translations.item('ext-api-request-error').name,
        ob.data.error_msg,ob.data.error_detail.replace(',',', ')
      );
      super.onLoaded(null);
    }
  }

  public get content():PieChartVO{
    return this.data as PieChartVO;
  }

}
