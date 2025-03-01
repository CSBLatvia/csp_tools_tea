import {inject, Injectable} from '@angular/core';
import {AComponentService} from "./AComponentService";
import {IComponentService} from "./IComponentService";
import {HttpClient} from "@angular/common/http";
import {MiniModelService} from "../../../app/model/minimodel.service";
import {ContentVO} from "../components/comp-lines-chart/vos/ContentVO";
import {ComponentServiceEmptyVO} from "./ComponentServiceEmptyVO";
import {ComponentServiceErrorVO} from "./ComponentServiceErrorVO";
import {TabItemVO} from "../components/comp-percentage-list/vos/TabItemVO";
import {LinesChartVO} from "../components/comp-lines-chart/vos/LinesChartVO";
import {RouteVO} from "../../../app/model/vo/RouteVO";
import {IModel} from "../../../app/model/IModel";



export class LinesChartService  extends AComponentService implements IComponentService{
protected override http:HttpClient = inject(HttpClient);

  public title:string;
  public title_x:string;
  public title_y:string;

  public content:Array<ContentVO>=[];
  public id:number=0;

  // a_generate_lines_chart(lang,year,m1,m2,m3,m4,t1,t2)

  constructor() {
    super();
    this.FUNCTION = 'lines-chart';
  }
  override loadData(route: RouteVO) {
    this.route = route;
    this.model.translations.lang = this.route.lang;

    this.content=[];
    this.data=[];
    const URL:string = this.model.config.serviceURL+'?db='+this.FUNCTION+'&lang='+route.lang+'&year='+route.year+'&m1='+route.M1+'&m2='+route.M2+'&m3='+route.M3+'&m4='+route.M4+'&t1='+route.T1+'&t2='+route.T2;
    this.http.get(URL).subscribe((data:any) => this.onLoaded({...data},route.lang));
  }
  override onLoaded(ob:any,lang:string):void {


    if(ob.info=='ok'&& ob.data.lines_chart_set!==undefined){

      if(ob.data.lines_chart_set.lines_chart_abs.data==null && ob.data.lines_chart_set.lines_chart_rel.data==null){
        //not ok
        this.empty = new ComponentServiceEmptyVO(
          this.model.translations.item('ext-no-data-title').name,
          this.model.translations.item('ext-no-data-text').name,
          this.route.toString().replaceAll('\n','<br>')
        );
        super.onLoaded(null);

      }else{

        //ok
        const obj:any = ob.data.lines_chart_set;
        this.parseData(obj);
        super.onLoaded(this.content);

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
  private parseData(data:any):void{
    let content:ContentVO;
    let item:any;
    //this.title = data.title;

    if(data.lines_chart_abs.data!==null){

      let tab_ = data.lines_chart_abs.tab;
      let title_ = data.lines_chart_abs.title;
      let legend_ = data.lines_chart_abs.legend;
      let data_ = data.lines_chart_abs.data;

      let series:any = [];
      let cattegories:any = [];

      let test_ob = data_[0];

      if(test_ob.value_all!==undefined){
        series.push({name:legend_.text_all,data:[],marker: {symbol: 'circle'}});
      }
      if(test_ob.value_same!==undefined){
        series.push({name:legend_.text_same,data:[],marker: {symbol: 'circle'}});
      }
      if(test_ob.value_out!==undefined){
        series.push({name:legend_.text_out,data:[],marker: {symbol: 'circle'}});
      }

      data_.forEach((ob)=>{

        cattegories.push(ob.year);
        if(ob.value_all!==undefined){
          series[0].data.push(ob.value_all);
        }
        if(ob.value_same!==undefined){
          series[1].data.push(ob.value_same);
        }
        if(ob.value_out!==undefined){
          series[2].data.push(ob.value_out);
        }

        /*
          {
            "year": 2017,
            "value_all": 6214,
            "value_same": 2586,
            "value_out": 3628
          }
        */

      })

      this.content.push(
        new ContentVO('0',new TabItemVO(tab_,'0'),  new LinesChartVO(title_,series,cattegories) )
      )

    }
    if(data.lines_chart_rel.data!==null){

      let tab_ = data.lines_chart_rel.tab;
      let title_ = data.lines_chart_rel.title;
      let data_ = data.lines_chart_rel.data;

      let series:any = [];
      let cattegories:any = [];

          series.push({name:title_,data:[]});

          data_.forEach((ob)=>{
            cattegories.push(ob.year);
            series[0].data.push(ob.value);
          })

      this.content.push(
        new ContentVO('1',new TabItemVO(tab_,'1'),  new LinesChartVO(title_,series,cattegories) )
      )

    }


    this.title_x = this.model.translations.item('ext-lines-chart-label-x').name;
    this.title_y = this.model.translations.item('ext-lines-chart-label-y-'+this.route.M1).name;

    this.id = 0;
    this.title = this.content[this.id].data.name;
  }

  public setID(id:number):void{
    this.id = id;
    this.title = this.content[this.id].data.name;
  }
}
