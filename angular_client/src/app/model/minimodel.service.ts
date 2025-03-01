import {EventEmitter, Inject, Injectable} from '@angular/core';
import {HttpClient, HttpUrlEncodingCodec} from '@angular/common/http';
import {ActivationEnd, NavigationEnd, Router} from '@angular/router';
import {Translations} from './Translations';
import {Config} from './Config';
import { v4 as uuidv4 } from 'uuid';

import {MapMaxValuesVO} from '../../ext/model/vo/MapMaxValuesVO';
import {Observable, throwError} from 'rxjs';
import {ColorCategories} from './inc/ColorCategories';


import {environment} from '../../environments/environment';
import {ControlValueVO} from '../../ext/ui-controls/vos/ControlValueVO';
import {DomElementsInfo} from "./vo/DomElementsInfo";

import {IModel} from "./IModel";
import {ScatterValueVO} from "../../ext/model/vo/ScatterValueVO";
import {RouteVO} from "./vo/RouteVO";
import {TranslationVO} from "./vo/TranslationVO";
import {RegionNameVO} from "./vo/RegionNameVO";
import {WindowRefService} from "./services/window/window-ref.service";
import {MetaUpdateService} from "./services/meta-update/meta-update.service";
import {StatsService} from "./services/stats/stats.service";
import {RouteService} from "./services/route/route.service";


@Injectable()
export class MiniModelService implements IModel{

  public id:string;
  public selectedRegion:RegionNameVO = null;
  public regionNames:Array<RegionNameVO> = [];
  public regionNames_ids:Array<string> = [];
  public years:Array<ControlValueVO> = [];

  public config:Config;
  private readyCount:number = 0; // finished if count === 4
  public READY:boolean = false;
  public MOBILE_SIZE:number= 900;
  public DPI:number = 1;

  public translations:Translations;

  public M1_names:Array<string>=['workplace','place-of-residence'];
  public M1_ids:Array<string>=['w','h'];

  public M2_names:Array<string>=['number-of-workplaces','number-of-employees','added-value','value-produced'];
  public M2_ids:Array<string>=['e','e','av','vp'];

  public M3_names:Array<any> = ['industry','profession','sector'];
  public M3_ids:Array<any> = ['i','p','s'];

  public T1_names:Array<any> = ['territories-3','territories-4','territories-7'];
  public T1_ids:Array<any> = ['3','4','7'];



  //////////////////////////////////////////////
  public onDataUpdate:EventEmitter<string> = new EventEmitter<string>();
  public onLanguageUpdate:EventEmitter<string> = new EventEmitter<string>();
  public onRouteUpdate:EventEmitter<string> = new EventEmitter<string>();
  public onModelReady:EventEmitter<string> = new EventEmitter<string>();
  public onResizeUpdate:EventEmitter<string> = new EventEmitter<string>();

  public routeURL:string='none';
  private initialURL:string='';
  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  private translationsURL:string = 'assets/config/translations.json';
  private configURL:string = 'assets/config/config.json';
  //////////////////////////////////////////////////////
  private valid_views:Array<string>=[
    'ext-map-territory',
    'ext-map-viz',
    'ext-percentage-bar',
    'ext-percentage-list',
    'ext-pie-chart',
    'ext-lines-chart',
    'ext-flow-chart',
    'ext-scatter-plot'
  ];

  ////////////////////////////////////////////////////
  public oldRoute:RouteVO;
  public route:RouteVO = new RouteVO('landing','lv');
  public dataIsNotComplete:boolean = false;
  public parentWinDomID:string='';

  constructor(
    private http: HttpClient,
    private router:Router,
    public window: WindowRefService,
    public dom:DomElementsInfo,
    public statsService:StatsService,
    public meta:MetaUpdateService,
    public routeService:RouteService
  ) {
    this.id = uuidv4();
    this.config = new Config();
    this.translations = new Translations();
    this.DPI = window.nativeWindow.devicePixelRatio || 1;

    dom.document.querySelector('meta[property=\'js:version\']').setAttribute('content',environment.appVersion);


    this.meta.initialize(this);
    this.statsService.initialize(this,this.meta);
    this.routeService.initialize(this);

    ////////////////////////////////////////
    // optional environment params goes here..
    ///////////////////////////////////////
    this.parseURLParams();

    // NavigationEnd
    // NavigationCancel
    // NavigationError
    // RoutesRecognized
    this.router.events.forEach((evt) => {
      if (this.readyCount === 0) {
        this.initialize();
      }
      if(evt instanceof ActivationEnd) {
        const url:string = evt.snapshot.url+'';
        if(url!=='' && this.READY===true){
          this.parseURL(url);
        }else{
          this.initialURL = url;
        }
      }
      if(evt instanceof NavigationEnd) {
          const url: string = evt.urlAfterRedirects + '';
          this.routeService.saveRouteURL(url);
      }
    });

  }
  private onDomUpdate=(e:DomElementsInfo):void=>{
    this.onResizeUpdate.emit('update');
  }
  ngOnDestroy():void{}
  ////////////////////////////////////////
  // PUBLIC
  ////////////////////////////////////////
  public setRouteValues(route:RouteVO):void{
    const isDirty:boolean = !this.route.isEqual(route);
    if(isDirty===false) { return;}

    let url:string;
    switch (route.view) {

      case 'ext-scatter-plot':

        url = '/' + route.lang + '/'+route.view+'/' + route.year + '/' + this.M1_getRouteNameFromID(route.M1) + '/' + this.M2_getRouteNameFromID(route.M2, route.M1)+'/'+ this.T1_getRouteNameFromID(route.T1) + '/' + route.T2 + '/' + this.M3_getRouteNameFromID(route.M3) + '/' + route.M4+'/'+route.SX+'/'+route.SY;
        break;

      case 'ext-pie-chart':

        url = '/' + route.lang + '/'+route.view+'/' + route.year + '/' + this.M1_getRouteNameFromID(route.M1) + '/' + this.M2_getRouteNameFromID(route.M2, route.M1)+'/'+ this.T1_getRouteNameFromID(route.T1) + '/' + route.T2 + '/' + this.M3_getRouteNameFromID(route.M3) + '/' + route.M4+'/'+route.direction;
        break;

      default:
        url = '/' + route.lang + '/'+route.view+'/' + route.year + '/' + this.M1_getRouteNameFromID(route.M1) + '/' + this.M2_getRouteNameFromID(route.M2, route.M1) + '/' + this.T1_getRouteNameFromID(route.T1) + '/' + route.T2 + '/' + this.M3_getRouteNameFromID(route.M3) + '/' + route.M4;
        break;
    }
    this.router.navigateByUrl(url);
  }
  public M1_getRouteNameFromID(id:string):string{
    if(id=='none'){ return id;}
    const index:number = this.M1_ids.indexOf(id);
    if(index==-1){
      this.routeParamsNotValidError();/**/
    }
    const value:string = this.M1_names[index];
    return value;
  }
  public M2_getRouteNameFromID(m2_id:string,m1_id:string):string{
    let name:string;
    if(m2_id=='e'){
      if(m1_id=='w'){
        name = this.M2_names[0];
      }else if(m1_id=='h'){
        name = this.M2_names[1];
      }
    }else{
      const index:number = this.M2_ids.indexOf(m2_id);
      name = this.M2_names[index];
    }
    return name;
  }
  public M3_getRouteNameFromID(id:string):string{
    if(id=='none'){ return id;}
    const index:number = this.M3_ids.indexOf(id);
    if(index==-1){
      this.routeParamsNotValidError();
    }
    return this.M3_names[index];
  }
  public T1_getRouteNameFromID(id:string):string{
    const index:number = this.T1_ids.indexOf(id);
    if(index==-1){
      this.routeParamsNotValidError();
    }
    return this.T1_names[index];
  }
  public getYearFromRoute(id:string):number{
    return parseInt(id);
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
      this.routeParamsNotValidError();
      return null;
    }
  }
  public getRoute():RouteVO{
    return this.route.clone();
  }
  public routeParamsNotValidError=():void=>{
    console.log('**************************');
    console.log('MINI-MODEL.routeParamsNotValidError');
    console.log('**************************');
    console.log('path:' +this.window.nativeWindow.location.href);
    console.log('**************************');
  }


  ////////////////////////////////////////
  // services callbacks
  ////////////////////////////////////////

  private loadTranslations():void{
    if(this.config.translationsFrom==='json'){
      this.loadTranslationsJSON();
    }else{
      this.loadTranslationsDB();
    }
  }
  private loadTranslationsJSON():void{
    this.http.get(this.translationsURL).subscribe((data:any) => this.loadTranslationsJSONComplete({...data}));
  }
  private loadTranslationsJSONComplete(data:any):void{
    this.translations.initializeJSON(data,this.route.lang);
    this.loadTranslationsComplete();
  }
  private loadTranslationsDB():void{
    this.http.get(this.config.serviceURL+'?db=translations').subscribe((data:any) => this.loadTranslationsDBComplete({...data}));
  }
  private loadTranslationsDBComplete(data:any):void{
    if(data.info==='ok') {
      this.translations.initializeDB(data.data, this.route.lang);
      this.loadTranslationsComplete();
    }else{
      throwError('MINI-Model.loadTranslationsDB - translations not loaded..');
    }
  }
  private loadTranslationsComplete():void{
    this.parseURL(this.initialURL);
    this.readyCount++;
    this.loadTerritories(this.route.T1);
  }   // ready - 3

  private loadConfig():void{
    this.http.get(this.configURL).subscribe((data:any) => this.loadConfigComplete({...data}));
  }
  private loadConfigComplete=(data:any):void=>{
    this.config.serviceURL = data.serviceURL;
    this.config.hostURL = data.hostURL;
    this.config.hostName = data.hostURL;
    this.config.externalComponentsURL = data.externalComponentsURL;
    this.config.geoServerTilesURL = data.geoServerTilesURL;
    this.config.osmTilesURL = data.osmTilesURL;
    this.config.ortoTilesURL = data.ortoTilesURL;

    this.config.mapBoxLayer_1 = data.mapBoxLayer_1;
    this.config.mapBoxLayer_3 = data.mapBoxLayer_3;
    this.config.mapBoxLayer_4 = data.mapBoxLayer_4;
    this.config.mapBoxLayer_7 = data.mapBoxLayer_7;


    this.config.mapColors.initialize(data.mapColors);
    this.config.configViz.initialize(data.configViz);

    this.config.home_color = data.home_color;
    this.config.work_color = data.work_color;

    this.config.colorCategories = new ColorCategories(data.color_categories);
    this.config.translationsFrom = data.translationsFrom;

    this.config.stats_id = data.stats_id;

    this.readyCount++;
    this.loadTranslations();
  } // ready - 2

  private loadTerritories(id:string):void{
    this.http.get(this.config.serviceURL+'?db=menu-territories&level='+id+'&year='+this.route.year).subscribe((data:any) => this.onLoadTerritoriesDone(id,{...data}));
  }
  private onLoadTerritoriesDone=(id:string,data:any):void=>{
    const t2_data:Array<ControlValueVO> = [];
    t2_data.push(new ControlValueVO('all',this.translations.item('territories-all')));

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

      ///////////////////////
      if (this.route.T2!=='none') {
        this.selectedRegion = this.getRegionbyCode(this.route.T2);
      }else{
        this.selectedRegion = null;
      }
      this.loadSelectedRegionName();

      ///////////////////////

      this.readyCount++;
      this.checkReady();

    }else{
      console.error('dataT2 - load error..');
    }

  } //ready  - 4
  ////////////////////////////////////////

  private parseURLParams():void{
    const hasParams:boolean = this.router.url.split('?').length>1;
    let param_arr:Array<string>;
    let param:string='';
    let value:string='';

    if(hasParams===true){
      const params:Array<string> = this.router.url.split('?')[1].split('&');

      params.forEach((item:string)=>{
        param_arr = item.split('=');
        if(param_arr.length===2){
          param = item.split('=')[0];
          value = item.split('=')[1];
          if(param == 'dom'){
            this.parentWinDomID = value;
          }

        }
      });
    }
  }
  private parseURL=(url:string):void=>{
    this.parseURLParams();
    if(this.routeURL === url){
      return;
    }
    this.oldRoute = this.route.clone();
    const arr:Array<string>=url.split(',');
    this.routeURL = url;

    const lang:string = arr[0]==='lv'?'lv':'en';
    const view:string = arr[1];
    const valid_view:boolean = this.valid_views.indexOf(view)!==-1;
    const year:number = this.getYearFromRoute(arr[2]);

    if(valid_view==false){
      this.routeParamsNotValidError(); return;
    }

    if(year==-1){
      console.error('year is not valid!!! year:'+year);
      this.routeParamsNotValidError(); return;
    }

    if(view == 'ext-scatter-plot' && arr.length==12){

        // :lang/:view/:year/:M1/:M2/:T1/:T2/:M3/:M4/:SX/:SY/:axisType',
        const m1:string = arr[3];
        const m2:string = arr[4];

        const t1:string = arr[5];
        const t2:string = arr[6];
        const m3:string = arr[7];
        const m4:string = arr[8];

        const sx:string = arr[9];
        const sy:string = arr[10];

        const axisType:string = arr[11];

        const M1 = this.M1_ids[this.M1_names.indexOf(m1)];
        const M2 = this.M2_ids[this.M2_names.indexOf(m2)];

        const T1 = this.T1_ids[this.T1_names.indexOf(t1)];
        const T2 = t2;
        const M3 = m3==='none'?'none':this.M3_ids[this.M3_names.indexOf(m3)];
        const M4 = m4;

        const SX = sx;
        const SY = sy;


        this.route = new RouteVO(view,lang,M1, M2, M3, M4, T1, T2, year, SX, SY,'',axisType);

    }else if(view == 'ext-pie-chart' && arr.length==10){

      // :lang/:view/:year/:M1/:M2/:T1/:T2/:M3/:M4/:direction',
      const m1:string = arr[3];
      const m2:string = arr[4];

      const t1:string = arr[5];
      const t2:string = arr[6];
      const m3:string = arr[7];
      const m4:string = arr[8];

      const direction:string = arr[9];


      const M1 = this.M1_ids[this.M1_names.indexOf(m1)];
      const M2 = this.M2_ids[this.M2_names.indexOf(m2)];

      const T1 = this.T1_ids[this.T1_names.indexOf(t1)];
      const T2 = t2;
      const M3 = m3==='none'?'none':this.M3_ids[this.M3_names.indexOf(m3)];
      const M4 = m4;


      this.route = new RouteVO(view,lang,M1, M2, M3, M4, T1, T2, year, '','',direction);

      /* if (T2!=='none') {
         this.selectedRegion = this.getRegionbyCode(this.route.T2);
       }else{
         this.selectedRegion = null;
       }
       this.loadSelectedRegionName();*/

    }else if(arr.length==9){
        // :lang/:view/:year/:M1/:M2/:T1/:T2/:M3/:M4',
        const m1:string = arr[3];
        const m2:string = arr[4];
        const t1:string = arr[5];
        const t2:string = arr[6];
        const m3:string = arr[7];
        const m4:string = arr[8];

        const M1 = this.M1_ids[this.M1_names.indexOf(m1)];
        const M2 = this.M2_ids[this.M2_names.indexOf(m2)];
        const T1 = this.T1_ids[this.T1_names.indexOf(t1)];
        const T2 = t2;
        const M3 = m3==='none'?'none':this.M3_ids[this.M3_names.indexOf(m3)];
        const M4 = m4;


        this.route = new RouteVO(view,lang,M1, M2, M3, M4, T1, T2, year);

  /*      if (T2!=='none') {
          this.selectedRegion = this.getRegionbyCode(this.route.T2);
        }else{
          this.selectedRegion = null;
        }
        this.loadSelectedRegionName();*/
    }else{
      this.routeParamsNotValidError();
    }


    if(this.route.isLangChangedOnly(this.oldRoute)==true){
      this.languageHasBeenUpdated();
    }else{
      this.routeHasBeenUpdated();
      this.translations.lang = this.route.lang;
    }
  }

  private initialize():void{
    this.readyCount++;
    this.loadConfig();
  } // ready - 1
  private checkReady():void{
    if(this.readyCount === 4){
      this.READY = true;
      this.onModelReady.emit();
    }
  }

  private loadSelectedRegionName():void{
    if(this.route.T2==='all'){
      this.selectedRegion = null;
      return;
    }
    const url:string = this.config.serviceURL+'?db=menu-territory-name&level='+this.route.T1+'&code='+this.route.T2+'&year='+this.route.year;
    this.http.get(url).subscribe((data:any) => this.loadSelectedRegionDone({...data}));
  }
  private loadSelectedRegionDone=(ob:any):void=>{
    if(ob.data && ob.info==='ok'){
      const item:any = ob.data[0];
      this.selectedRegion = new RegionNameVO(
        item.code,
        new TranslationVO(item.code,item.name_lv,item.name_en),
        new TranslationVO(item.code,item.name_lv_short,item.name_en_short)
      );
    }else{
      this.selectedRegion = null;
    }
  }
  private routeHasBeenUpdated():void{
    this.onRouteUpdate.emit('update');
    this.statsService.sendStats();
  }
  private languageHasBeenUpdated():void{
    this.translations.lang = this.route.lang;
    this.onLanguageUpdate.emit('update');
  }


}
