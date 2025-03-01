import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IComponentService} from "../../../../services/IComponentService";
import {TitlesVO} from "../../../../../model/vo/TitlesVO";
import {RouteVO} from "../../../../../../app/model/vo/RouteVO";

@Injectable({
  providedIn: 'root'
})
export class TitlesService {

  private service:IComponentService;
  private serviceURL:string = '';
  public initialized:boolean = false;
  public route:RouteVO;

  private onModelReadyListener:any;
  private onRouteUpdateListener:any;
  private onLanguageUpdateListener:any;

  public onServiceChange:EventEmitter<string> = new EventEmitter<string>();
  public vo:TitlesVO;



  constructor(private http: HttpClient) {}

  public update(route:RouteVO):void{
    this.route = route;
    if(this.initialized===false){return;}
    this.loadData();
  }
  public initialize(service:IComponentService){
    if(this.initialized===true){return;}
    this.service = service;
    this.route = service.route;
    this.onModelReadyListener = this.service.model.onModelReady.subscribe(this.onModelReady);
    this.onRouteUpdateListener = this.service.model.onRouteUpdate.subscribe(this.onRouteUpdate);
    if(this.service.model.READY===true){
      this.initializeService();
    }
  }
  initializeService():void {
    if(this.initialized===true){return;}
    this.initialized = true;
    this.serviceURL = this.service.model.config.serviceURL;
    this.loadData();
  }
  private onModelReady=():void=>{
    this.initializeService();
  }
  private onRouteUpdate=():void=>{
    if(this.initialized===false){return;}
    this.loadData();
  }
  ///////////////////////////////////////
  private loadData():void{
    const url:string = this.serviceURL+'?db=title&lang='+this.route.lang+'&year='+this.route.year+'&m1='+this.route.M1+'&m2='+this.route.M2+'&m3='+this.route.M3+'&m4='+this.route.M4+'&t1='+this.route.T1+'&t2='+this.route.T2;
    this.http.get(url).subscribe((data:any) => this.onLoadDataDone({...data}));
  }
  private onLoadDataDone=(data:any):void=>{
    const vo:TitlesVO = new TitlesVO();

    if(data.info==='ok'){
      const json:any = data.data;
      vo.map_title = json.map_title;
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
      // console.dir(vo);

      this.vo = vo;
      this.onServiceChange.emit('update');
    }else{
      this.vo = vo;
      this.onServiceChange.emit('update');
    }
  }
}
