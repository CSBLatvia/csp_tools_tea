import {EventEmitter, Injectable} from '@angular/core';
import {ModelService} from '../../../model/model.service';
import {RouteVO} from '../../../model/vo/RouteVO';
import {HttpClient} from '@angular/common/http';
import {TitlesVO} from '../../../model/vo/TitlesVO';

@Injectable({
  providedIn: 'root'
})
export class TitlesService {

  public initialized:boolean = false;
  public model:ModelService;
  public serviceURL:string = '';
  private onModelReadyListener:any;
  private onRouteUpdateListener:any;
  private onLanguageUpdateListener:any;

  public onServiceChange:EventEmitter<string> = new EventEmitter<string>();
  public vo:TitlesVO;



  constructor(private http: HttpClient) {}
  public initialize(model:ModelService){
    this.model = model;
    this.onModelReadyListener = this.model.onModelReady.subscribe(this.onModelReady);
    this.onRouteUpdateListener = this.model.onRouteUpdate.subscribe(this.onRouteUpdate);
    this.onLanguageUpdateListener = this.model.onLanguageUpdate.subscribe(this.onLanguageUpdate);
    if(this.model.READY===true){
      this.initializeService();
    }
  }
  initializeService():void {
    if(this.initialized===true){return;}
    this.initialized = true;
    this.serviceURL = this.model.config.serviceURL;
    this.loadData();
  }
  private onModelReady=():void=>{
    this.initializeService();
  }
  private onRouteUpdate=():void=>{
    if(this.initialized===false){return;}
    this.loadData();
  }
  private onLanguageUpdate=():void=>{
    if(this.initialized===false){return;}
    this.loadData();
  }
  ///////////////////////////////////////
  private loadData():void{
    if(this.model.route.view!=='map'){return;}
    const route:RouteVO = this.model.getRoute();
    const url:string = this.serviceURL+'?db=title&lang='+route.lang+'&year='+route.year+'&m1='+route.M1+'&m2='+route.M2+'&m3='+route.M3+'&m4='+route.M4+'&t1='+route.T1+'&t2='+route.T2;
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
      // this.logger.dir(vo);

      this.vo = vo;
      this.onServiceChange.emit('update');
    }else{
      this.vo = vo;
      this.onServiceChange.emit('update');
    }
  }
}
