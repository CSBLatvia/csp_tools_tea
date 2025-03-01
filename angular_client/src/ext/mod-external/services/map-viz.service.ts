import {EventEmitter, inject, Injectable} from '@angular/core';
import {AComponentService} from "./AComponentService";
import {IComponentService} from "./IComponentService";;
import {BackgroundDataVO} from "../modules/map-viz/vos/BackgroundDataVO";
import {IVizService} from "../modules/map-viz/services/viz-services/IVizService";
import {MapBackgroundChoroService} from "../modules/map-viz/services/map-bacground-choro/map-background-choro.service";
import {MapCentroidsService} from "../modules/map-viz/services/map-centroids/map-centroids.service";
import {MapLegendService} from "../modules/map-viz/services/map-legend/map-legend.service";
import {MapPopService} from "../modules/map-viz/services/map-pop/map-pop.service";
import {VizCirclesService} from "../modules/map-viz/services/viz-services/viz-circles.service";
import {VizCirclesRegionService} from "../modules/map-viz/services/viz-services/viz-circles-region.service";
import {VizCirclesSectorsService} from "../modules/map-viz/services/viz-services/viz-circles-sectors.service";
import {VizCirclesSectorsRegionService} from "../modules/map-viz/services/viz-services/viz-circles-sectors-region.service";
import { v4 as uuidv4 } from 'uuid';
import {TitlesService} from "../modules/map-viz/services/titles/titles.service";
import {HttpClient} from "@angular/common/http";
import {throwError} from "rxjs";
import { RouteVO } from 'src/app/model/vo/RouteVO';
import {ControlValueVO} from "../../ui-controls/vos/ControlValueVO";
import {MiniModelService} from "../../../app/model/minimodel.service";
import { RegionNameVO } from 'src/app/model/vo/RegionNameVO';
import {ColorCategories} from "../../../app/model/inc/ColorCategories";
import {ColorCategoriesVO} from "../../../app/model/inc/ColorCategoriesVO";
import {TranslationVO} from "../../../app/model/vo/TranslationVO";


@Injectable()
export class MapVizService  extends AComponentService implements IComponentService{

  public onServiceReady:EventEmitter<string>;
  public onCentroidsUpdate:EventEmitter<string>;
  public onBackgroundUpdate:EventEmitter<string>;

  private onCentroidsDataUpdateListener:any;
  private onBackgroundDataUpdateListener:any;

  // a_generate_map(lang,year,m1,m2,m3,m4,t1,t2)
  // map_light
  // map_dark
  // map_osm
  public id:string;


  public map_style_ids:Array<string> = [
    'map-light-rupucs',
    'map-dark-rupucs',
    'map-light',
    'map-dark',
    'map-osm',
    'map-orto'
  ]
  public MAP_POP_STYLE:string = 'map-light-rupucs';

  public dataIsNotComplete:boolean = false;
  public
  public MAP_SIZE:number;
  public MAP_ZOOM:number;

  public VIZ:number=-1;
  public vizService:IVizService = null;
  public override route:RouteVO = null;
  private oldRoute:RouteVO = null;
  /////////////////////


  public  m4_data:Array<ControlValueVO>=[];
  public  m4_data_ids:Array<string>=[];
  //industry
  private  data_i:Array<ControlValueVO>=[];
  private  data_i_ids:Array<string>=[];
  //proffesion
  private  data_p:Array<ControlValueVO>=[];
  private  data_p_ids:Array<string>=[];
  //sectors
  private  data_s:Array<ControlValueVO>=[];
  private  data_s_ids:Array<string>=[];

  public background:MapBackgroundChoroService = inject(MapBackgroundChoroService);  //NO- ROUTE
  public centroids:MapCentroidsService = inject(MapCentroidsService);               //NO- ROUTE


  public legendService: MapLegendService = inject(MapLegendService);
  public popService:MapPopService = inject(MapPopService);
  public titlesService:TitlesService = inject(TitlesService);
  protected override http:HttpClient = inject(HttpClient);


  private vizCirclesService:VizCirclesService = inject(VizCirclesService); //NO- ROUTE update and http loading..
  private vizCirclesRegionService:VizCirclesRegionService = inject(VizCirclesRegionService); //NO- ROUTE update and http loading..
  private vizCirclesSectorsService:VizCirclesSectorsService = inject(VizCirclesSectorsService); //NO- ROUTE update and http loading..
  private vizCirclesSectorsRegionService:VizCirclesSectorsRegionService = inject(VizCirclesSectorsRegionService); //NO- ROUTE update and http loading..


  ///////////////////////////////////////
  // all props for map and viz
  ///////////////////////////////////////
  public regionNames:Array<RegionNameVO> = [];
  public regionNames_ids:Array<string> = [];

  ///////////////////////////////////////
  private readyCount:number=0;
  READY:boolean = false;
  private initialized:boolean = false;
  private  updateRunning:boolean = false;

  //////////////////////////////////////
  // sekvence kurai jāizpildās pie route izmaiņām:
  //////////////////////////////////////

  /*

    1 - loadMenuDataM4(this.route.M3);
    2 - loadTerritories
    3 - loadCentroids
    4 - loadMapData

    kad visi četri ir izpildījušies, tad karti un vizualizāciju ir iespējams uzzimēt:
    vizService.parseData(data.data);
   */




  constructor() {
    super();
    this.id = uuidv4();
    this.onServiceReady = new EventEmitter<string>();
    this.onCentroidsUpdate = new EventEmitter<string>();
    this.onBackgroundUpdate = new EventEmitter<string>();
  }
  public initialize(route:RouteVO):void{
    if(this.initialized==true){return;}
    this.oldRoute = this.route;
    this.route = route;

    this.readyCount=0;
    this.initialized = true;

    this.background.initialize(this);
    this.centroids.initialize(this);

    this.legendService.initialize(this);
    this.popService.initialize(this);
    this.titlesService.initialize(this);

    this.onBackgroundDataUpdateListener = this.background.onDataUpdated.subscribe(this.onBackgrounDatadUpdate);
    this.onCentroidsDataUpdateListener = this.centroids.onDataUpdated.subscribe(this.onCentroidsDataUpdate);


    switch(this.route.VIZ){
      case 1:
        this.VIZ = 1;
        this.vizService = this.vizCirclesService;
        this.vizService.initialize(this);
        break;
      case 2:
        this.VIZ = 2;
        this.vizService = this.vizCirclesRegionService;
        this.vizService.initialize(this);
        break;
      case 3:
        this.VIZ = 3;
        this.vizService = this.vizCirclesSectorsService;
        this.vizService.initialize(this);
        break;
      case 4:
        this.VIZ = 4;
        this.vizService = this.vizCirclesSectorsRegionService;
        this.vizService.initialize(this);
        break;
    }
    //this.loadMenuDataM4(this.route.M3);
  }
  public onBackgrounDatadUpdate=():void=>{
    this.onBackgroundUpdate.emit('update');
  }
  public onCentroidsDataUpdate=():void=>{
    this.onCentroidsUpdate.emit('update');
  }

  public update(route:RouteVO):void{
    if(!this.initialized){
      this.initialize(route);
    }
    if(this.route!==null && this.route.isEqual(route)){
      console.error('MAP-VIZ-sERVICE - UPDATING with old route!!!!');
      //return;
    }

    this.oldRoute = this.route;
    this.route = route;

    this.readyCount=0;
    this.legendService.update(this.route);
    this.popService.update(this.route);
    this.titlesService.update(this.route);


    switch(this.route.VIZ){
      case 1:
        this.VIZ = 1;
        this.vizService = this.vizCirclesService;
        this.vizService.initialize(this);
        break;
      case 2:
        this.VIZ = 2;
        this.vizService = this.vizCirclesRegionService;
        this.vizService.initialize(this);
        break;
      case 3:
        this.VIZ = 3;
        this.vizService = this.vizCirclesSectorsService;
        this.vizService.initialize(this);
        break;
      case 4:
        this.VIZ = 4;
        this.vizService = this.vizCirclesSectorsRegionService;
        this.vizService.initialize(this);
        break;
    }

    this.loadMenuDataM4(this.route.M3);
  }

  public loadMapData():void{
    const route:RouteVO = this.route;
    const URL:string = this.model.config.serviceURL+'?db=map-viz&lang='+route.lang+'&year='+route.year+'&m1='+route.M1+'&m2='+route.M2+'&m3='+route.M3+'&m4='+route.M4+'&t1='+route.T1+'&t2='+route.T2;
    this.http.get(URL).subscribe((data:any) => this.onLoadMapDataDone({...data}));
  }
  public onLoadMapDataDone(data:any):void{
    this.vizService.parseData(data.data);
    this.readyCount++;
    this.checkReady();
  }           // readyCount - 3
  private loadTerritories():void{
    const id:string = this.route.T1;
    if(this.oldRoute.T1==this.route.T1 && this.oldRoute.year==this.route.year && this.regionNames.length>0){
      this.readyCount++;
      this.loadCentroids();
    }else{
      this.http.get(this.model.config.serviceURL+'?db=menu-territories&level='+id+'&year='+this.route.year).subscribe((data:any) => this.onLoadTerritoriesDone({...data}));
    }
  }
  private onLoadTerritoriesDone=(data:any):void=>{
    const t2_data:Array<ControlValueVO> = [];
    t2_data.push(new ControlValueVO('all',this.model.translations.item('territories-all')));

    if(data.info==='ok'){

      let arr:Array<any> = data.data as Array<any>;
      ///////////////////////////////////////////////
      const collator:any = new Intl.Collator('lv');
      arr = arr.sort(function(a:any, b:any) {
        return collator.compare(a.name_lv.toLowerCase(), b.name_lv.toLowerCase());
      });

      ///////////////////////////////////////////////
      let i:number=0;
      const L:number=arr.length;
      let item:any;

      const regionNames:Array<RegionNameVO> = [];
      const regionNames_ids:Array<string> = [];

      while(i<L){
        item = arr[i];
        t2_data.push(
          new ControlValueVO(
            item.code,
            new TranslationVO(item.code,item.name_lv,item.name_en)
          )
        );
        //////////////////////////////
        // model
        regionNames.push(
          new RegionNameVO(
            item.code,
            new TranslationVO(item.code,item.name_lv,item.name_en),
            new TranslationVO(item.code,item.name_lv_short,item.name_en_short)
          )
        );
        regionNames_ids.push(item.code);
        /////////////////////////////
        i++;
      }

      this.regionNames = [...regionNames];
      this.regionNames_ids = [...regionNames_ids];

      this.readyCount++;
      console.log('**************');
      console.log('MAP-VIZ-SERVICE - onLoadTerritoriesDone - readyCount:'+this.readyCount);
      console.log('**************');
      this.loadCentroids();

    }else{
      throwError('MAP-VIZ-SERVICE - onLoadTerritoriesDone - ERROR');
    }

  }     //readyCount  - 2
  ////////////////////////////////////////
  public loadCentroids():void{
    const route:RouteVO = this.route;
    const url:string = this.model.config.serviceURL+'?db=map-centroids&t1='+route.T1+'&year='+route.year;
    this.http.get(url).subscribe((data:any) => this.onLoadCentroidsDone({...data}));
  }
  public onLoadCentroidsDone(data:any):void{
    if(data.info==='ok'){

      this.centroids.parseData(data.data);
      this.readyCount++;
      console.log('**************');
      console.log('MAP-VIZ-SERVICE - onLoadCentroidsDone - readyCount:'+this.readyCount);
      console.log('**************');
      this.loadMapData();
    }else{
      throwError('MAP-VIZ-SERVICE - onLoadCentroidsDone - ERROR');
    }

  }           // readyCount - 3

  private checkReady(){
    if(this.readyCount==4){
      this.READY=true;
      console.log('*************************************************');
      console.log('MAP-VIZ-SERVICE- readyCount: '+this.readyCount);
      console.log('*************************************************');
      console.dir(this.background.data);
      console.log('*************************************************');
      this.onServiceReady.emit('update');
    }else{ return;}
  }

  //////////////////////////////////////////
  public updateLegendListData(colorCategories:ColorCategories):void{
    // console.log('***********************');
    // console.log('MAP-VIZ-SERVICE - updateLegendListData()')
    // console.log('***********************');
    // console.dir(colorCategories);
    // console.log('***********************');
    const items:Array<ColorCategoriesVO> = colorCategories.items;
    /* TODO - how to use settings inside this class */
     //const arr:Array<ControlValueVO> = this.settings.m4_data.slice(1);
    const arr:Array<ControlValueVO>=this.m4_data.slice(1);
    // console.dir(this.m4_data);
    // console.dir(arr);
    // console.log('***********************');
    function searchByPropCode(code:string):ControlValueVO {
      let ret:ControlValueVO = null;
      // tslint:disable-next-line:no-shadowed-variable
      arr.forEach((item:ControlValueVO)=>{
        if(item.id===code){
          ret = item;
        }
      });
      return ret;
    }
    const list_data:Array<ControlValueVO>=[];

    let i:number=0;
    const L:number = items.length;
    let item:ControlValueVO;
    let color:string;

    while(i<L){
      const code = items[i].property;
      color = items[i].color;
      item = searchByPropCode(code);
      if(item!==null){
        list_data.push(new ControlValueVO(item.id, item.name, false, i, color));
      }
      if(code==='other'){
        list_data.push(new ControlValueVO('other', new TranslationVO('legend-other','Cita','Other'), false, i, color));
      }
      i++;
    }
    // console.dir(list_data);
    // console.log('***********************');
    this.legendService.updateLegendListData(list_data);
  }
  public updateLegendSizes(valueTooSmallStartsFrom:number=-1,valueMaxOnScreen:number=-1,areaMaxOnScreen:number=-1, minRadius:number=-1){
    this.legendService.updateLegendSizes(valueTooSmallStartsFrom,valueMaxOnScreen,areaMaxOnScreen, minRadius);
  }
  //////////////////////////////////////////
  // nace, profesion, sector
  // i, p , s

  //////////////////////////////////////////
  private loadMenuDataM4(id:string):void{

    console.log('***************************************');
    console.log('MAP-VIZ-SERVICE - loadMenuDataM4() id:'+id+' api url: '+this.model.config.serviceURL);
    console.log('***************************************');

    this.m4_data = [];
    this.m4_data_ids = [];

      switch (id) {
        case 'i':
          if(this.data_i.length==0){
            this.http.get(this.model.config.serviceURL+'?db=menu-naces').subscribe((data: any) => this.onloadMenuDataM4Done(id, {...data}));
          }else{
            this.m4_data = [...this.data_i];
            this.m4_data_ids = [...this.data_i_ids];
            this.readyCount++;
            this.loadTerritories();
          }
          break;
        case 'p':
          if(this.data_p.length==0){
            this.http.get(this.model.config.serviceURL+'?db=menu-profs').subscribe((data: any) => this.onloadMenuDataM4Done(id, {...data}));
          }else{
            this.m4_data = [...this.data_p];
            this.m4_data_ids = [...this.data_p_ids];
            this.readyCount++;
            this.loadTerritories();
          }
          break;
        case 's':

          if(this.data_s.length==0){
            this.http.get(this.model.config.serviceURL+'?db=menu-sectors').subscribe((data: any) => this.onloadMenuDataM4Done(id, {...data}));
          }else{
            this.m4_data = [...this.data_s];
            this.m4_data_ids = [...this.data_s_ids];
            this.readyCount++;
            this.loadTerritories();
          }
          break;
        case 'none':
          this.readyCount++;
          this.loadTerritories();
          break;
      }
  }
  private onloadMenuDataM4Done=(id:string, data:any):void=>{

    if(data.info==='ok'){
      let item:any;
      const m4_data:Array<ControlValueVO> = [];
      const m4_data_ids:Array<string> = [];
      m4_data.push(new ControlValueVO('none',this.model.translations.item('ui-top-values')));
      m4_data_ids.push('none');

      const obj:any = data.data;
      for (const code in obj) {
        if (obj.hasOwnProperty(code)) {
          item = obj[code];
          m4_data.push(new ControlValueVO(code,new TranslationVO(code,obj[code][0],obj[code][1])));
          m4_data_ids.push(code);
        }
      }

      this.m4_data = m4_data;
      this.m4_data_ids = m4_data_ids;

      switch (id){
        case 'i':
          this.data_i = [...this.m4_data];
          this.data_i_ids = [...this.m4_data_ids];
          break;
        case 'p':
          this.data_p = [...this.m4_data];
          this.data_p_ids = [...this.m4_data_ids];
          break;
        case 's':
          this.data_s = [...this.m4_data];
          this.data_s_ids = [...this.m4_data_ids];
          break;
      }




      this.readyCount++;
      console.log('**************');
      console.log('MAP-VIZ-SERVICE - onloadMenuDataM4Done - readyCount:'+this.readyCount);
      console.log('**************');
      this.loadTerritories();


    }else{
      // // console.error('dataM4 - load error..');
    }
  }

  public getRegionbyCode(code:string):RegionNameVO{
    const arr:Array<string> = code.split('parent-');
    if(arr.length>1){
      code = arr[1];
    }
    if(code==='LV'|| code==='all'){
      return new RegionNameVO(code, new TranslationVO(code,'Visa Latvija','All country'),new TranslationVO(code,'Visa Latvija','All country'));
    }
    const index:number = this.regionNames_ids.indexOf(code);
    if(index!==-1){
      return this.regionNames[index];
    }else{
      console.error('getRegionbyCode('+code+') - region not found !!!');
      console.dir(this.regionNames);
      console.dir(this.regionNames_ids);
      return null;
    }
  }
}
