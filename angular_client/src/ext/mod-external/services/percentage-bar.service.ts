import {inject, Injectable} from '@angular/core';
import {AComponentService} from "./AComponentService";
import {IComponentService} from "./IComponentService";
import {HttpClient} from "@angular/common/http";
import {MiniModelService} from "../../../app/model/minimodel.service";
import {ComponentServiceEmptyVO} from "./ComponentServiceEmptyVO";
import {ComponentServiceErrorVO} from "./ComponentServiceErrorVO";
import {PercentageBarVO} from "../components/comp-percentage-bar/vos/PercentageBarVO";
import {PercentageBarItemVO} from "../components/comp-percentage-bar/vos/PercentageBarItemVO";
import {RouteVO} from "../../../app/model/vo/RouteVO";


export class PercentageBarService extends AComponentService implements IComponentService {

  protected override http:HttpClient = inject(HttpClient);


  constructor() {
    super();
    this.FUNCTION = 'percentage-bar';
  }
  override loadData(route: RouteVO) {
    this.route = route;
    this.model.translations.lang = this.route.lang;
    this.data=null;
    const URL:string = this.model.config.serviceURL+'?db='+this.FUNCTION+'&lang='+route.lang+'&year='+route.year+'&m1='+route.M1+'&m2='+route.M2+'&m3='+route.M3+'&m4='+route.M4+'&t1='+route.T1+'&t2='+route.T2;
    this.http.get(URL).subscribe((data:any) => this.onLoaded({...data},route.lang));
  }
  override onLoaded(ob:any,lang:string):void {

    if(ob.info=='ok'&& ob.data.percentage_bar_set!==undefined){

      if(ob.data.percentage_bar_set.data==null  || ob.data.percentage_bar_set.text==null ){
        //not ok
        this.empty = new ComponentServiceEmptyVO(
          this.model.translations.item('ext-no-data-title').name,
          this.model.translations.item('ext-no-data-text').name,
          this.route.toString().replaceAll('\n','<br>')
        );
        super.onLoaded(null);

      }else{

        //ok
        const obj:any = ob.data.percentage_bar_set;

        let content:PercentageBarVO = new PercentageBarVO(
            obj.text!==null?obj.text:'text prop is empty..',
            [
              new PercentageBarItemVO(obj.data[0].sector,obj.data[0].pct,obj.data[0].code),
              new PercentageBarItemVO(obj.data[1].sector,obj.data[1].pct,obj.data[1].code)
            ]
        );
        this.data = content;
        console.dir(this.data);
        super.onLoaded(content);
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

  public get content():PercentageBarVO{
   return this.data as PercentageBarVO;
  }

}
