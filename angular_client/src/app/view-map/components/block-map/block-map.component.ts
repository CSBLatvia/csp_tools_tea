import {Component} from '@angular/core';
import {ABlock} from "../../../model/ABlock";
import {TranslationVO} from "../../../model/vo/TranslationVO";
import {RouteVO} from "../../../model/vo/RouteVO";
import {TitlesVO} from "../../../model/vo/TitlesVO";
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'block-map',
  templateUrl: './block-map.component.html',
  styleUrls: ['./block-map.component.scss']
})
export class BlockMapComponent extends ABlock{

  // https://tools.csb.gov.lv/tea_2/api?db=title&lang=lv&year=2020&m1=w&m2=e&m3=i&m4=none&t1=3&t2=all

  constructor(private http:HttpClient) { super();}

  private updateTitleVOS():void{
    if(this.model.route.view!=='map'){return;}
    this.component_link =   this.externalComponentsURL+'/'+this.route.lang+'/ext-map-viz/'+this.route.year+'/'+this.model.M1_getRouteNameFromID(this.route.M1)+'/'+this.model.M2_getRouteNameFromID(this.route.M2,this.route.M1)+'/'+this.model.T1_getRouteNameFromID(this.route.T1)+'/'+this.route.T2+'/'+this.model.M3_getRouteNameFromID(this.route.M3)+'/'+this.route.M4
    this.component_link = this.component_link+'?dom='+this.id;

    const route:RouteVO = this.route;
    const url:string = this.model.config.serviceURL+'?db=title&lang='+route.lang+'&year='+route.year+'&m1='+route.M1+'&m2='+route.M2+'&m3='+route.M3+'&m4='+route.M4+'&t1='+route.T1+'&t2='+route.T2;
    this.http.get(url).subscribe((data:any) => this.onLoadDataDone({...data}));
  }
  private onLoadDataDone=(data:any):void=>{
    const vo:TitlesVO = new TitlesVO();

    if(data.info==='ok'){
      const json:any = data.data;
      vo.map_title = json.map_title;
      /*
      vo.table_title = json.table_title;
      vo.legend_clusters_title = json.legend_clusters_title;
      vo.legend_sizes_title = json.legend_sizes_title;
      vo.legend_circles_title = json.legend_circles_title;
      vo.legend_list_title = json.legend_list_title;
      vo.table_col_1_title = json.table_col_1_title;
      vo.table_col_2_title = json.table_col_2_title;
      vo.table_col_3_title = json.table_col_3_title;

      vo.meta_title_main = json.meta_title_main;
      vo.meta_description_main = json.meta_description_main;
      */
      //// console.dir(vo);
      this.titleVO = new TranslationVO('',vo.map_title,vo.map_title);
      this.titleVO.lang = this.route.lang;

    }else{
      this.titleVO = new TranslationVO('','karte','map');
    }
  }

  ///////////////////////////
  override onChanges():void{
    if(this.initialized==false){return;}
    this.updateTitleVOS();
  }
}
