import {Meta, Title} from '@angular/platform-browser';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RouteVO} from '../../vo/RouteVO';
import {IModel} from "../../IModel";


@Injectable()

export class MetaUpdateService {

  private model:IModel;
  private serviceURL:string = '';
  private onModelReadyListener:any;
  public initialized:boolean = false;
  //////////////////////////////////

  private onRouteUpdateListener:any;
  private onLanguageUpdateListener:any;

  constructor(private http: HttpClient, public title:Title, private meta: Meta) { }

  public initialize(model:IModel){
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
    /* TODO - MUST FIX this service at the end ....
    /*
    this.title.setTitle('');
    this.meta.getTag('name=Description').content = '';
    this.loadData();
    */
  }
  private onLanguageUpdate=():void=>{
    if(this.initialized===false){return;}
    //this.loadData();
  }

  ///////////////////////////////////////
  private loadData():void{
    const route:RouteVO = this.model.getRoute();
     let url:string;
     if(this.model.route.view=='about'||'api'){
       url = this.serviceURL+'?db=meta-client&view='+this.model.route.view+'&lang='+route.lang;
     }else{
       url = this.serviceURL+'?db=meta-client&view='+route.view+'&lang='+route.lang+'&year='+route.year+'&m1='+route.M1+'&m2='+route.M2+'&m3='+route.M3+'&m4='+route.M4+'&t1='+route.T1+'&t2='+route.T2;
     }
    // this.http.get(url).subscribe((data:any) => this.onLoadDataDone({...data}));
  }
  private onLoadDataDone=(data:any):void=>{
    if(data.info==='ok'){
      const ob:any = data.data;
       this.title.setTitle(ob.title);
       this.meta.getTag('name=Description').content = ob.description;
    }else{
      this.title.setTitle('');
      this.meta.getTag('name=Description').content = '';
    }
  }
}
