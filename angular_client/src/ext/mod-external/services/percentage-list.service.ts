import {inject} from '@angular/core';
import {AComponentService} from "./AComponentService";
import {IComponentService} from "./IComponentService";
import {HttpClient} from "@angular/common/http";
import {ComponentServiceEmptyVO} from "./ComponentServiceEmptyVO";
import {ComponentServiceErrorVO} from "./ComponentServiceErrorVO";
import {ContentVO} from "../components/comp-percentage-list/vos/ContentVO";
import {TabItemVO} from "../components/comp-percentage-list/vos/TabItemVO";
import {ContentItemVO} from "../components/comp-percentage-list/vos/ContentItemVO";
import {RouteVO} from "../../../app/model/vo/RouteVO";
import { v4 as uuidv4 } from 'uuid';


export class PercentageListService extends AComponentService implements IComponentService {

  protected override http:HttpClient = inject(HttpClient);

  public title:string;
  public content:Array<ContentVO>=[];
  public id:number=0;
  public hash:string;

  constructor() {
    super();
    this.hash =  uuidv4();
    this.FUNCTION = 'percentage-list';
  }
  override loadData(route: RouteVO) {
    this.route = route;
    this.model.translations.lang = this.route.lang;
    this.data=null;
    const URL:string = this.model.config.serviceURL+'?db='+this.FUNCTION+'&lang='+route.lang+'&year='+route.year+'&m1='+route.M1+'&m2='+route.M2+'&m3='+route.M3+'&m4='+route.M4+'&t1='+route.T1+'&t2='+route.T2;
    this.http.get(URL).subscribe((data:any) => this.onLoaded({...data},route.lang));
  }
  override onLoaded(ob:any,lang:string):void {
    if(ob.info=='ok'&& ob.data.percentage_list_set!==undefined){

      if(ob.data.percentage_list_set.percentage_list_all.data==null && ob.data.percentage_list_set.percentage_list_same.data==null && ob.data.percentage_list_set.percentage_list_out.data==null){
        //not ok
        this.empty = new ComponentServiceEmptyVO(
          this.model.translations.item('ext-no-data-title').name,
          this.model.translations.item('ext-no-data-text').name,
          this.route.toString().replaceAll('\n','<br>')
        );
        super.onLoaded(null);

      }else{

        //ok
        const obj:any = ob.data.percentage_list_set;
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

  private parseItem(item:any):ContentVO{
    const id:string = item.tab_title;
    const tab:TabItemVO = new TabItemVO(id,id);
    const arr:Array<ContentItemVO> = [];
    const columns:Array<any> = [null,item.columns.table_col_2_title,item.columns.table_col_3_title];
    item.data.forEach((ob:any)=>{
      arr.push(new ContentItemVO(ob.name,ob.value,ob.pct));
    });
    return new ContentVO(id,tab, arr,columns);
  }
  private parseData(data:any):void{

    this.title = null;
    this.content=[];

    let content:ContentVO;
    let item:any;

    this.title = data.title;

    if(data.percentage_list_all.data!==null){
      item = data.percentage_list_all;
      content = this.parseItem(item);
      this.content.push(content);
    }
    if(data.percentage_list_out.data!==null){
      //console.log('-percentage_list_out');
      item = data.percentage_list_out;
      content = this.parseItem(item);
      this.content.push(content);
    }
    if(data.percentage_list_same.data!==null){
      //console.log('-percentage_list_same');
      item = data.percentage_list_same;
      content = this.parseItem(item);
      this.content.push(content);
    }

    this.id = 0;
  }





}
