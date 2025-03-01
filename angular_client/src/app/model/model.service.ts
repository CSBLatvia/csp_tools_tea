import {EventEmitter, inject, Inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpUrlEncodingCodec} from '@angular/common/http';
import {ActivationEnd, NavigationEnd, Router} from '@angular/router';
import {Translations} from './Translations';
import {Config} from './Config';
import {DOCUMENT} from "@angular/common";
import {MetaUpdateService} from './services/meta-update/meta-update.service';
import {LoggerService} from './log/logger.service';


import {RouteVO} from './vo/RouteVO';
import {MapMaxValuesVO} from './vo/MapMaxValuesVO';
import {throwError} from 'rxjs';
import {ColorCategories} from './inc/ColorCategories';
import {RegionNameVO} from './vo/RegionNameVO';
import {TranslationVO} from './vo/TranslationVO';

import {SettingsService} from './services/settings/settings.service';

import {TitlesVO} from './vo/TitlesVO';
import {environment} from '../../environments/environment';
import {ControlValueVO} from '../ui-controls/vos/ControlValueVO';

import {ConfigMapColors} from './configs/ConfigMapColors';
import {ColorCategoriesVO} from './inc/ColorCategoriesVO';
import {DomElementsInfo} from "./vo/DomElementsInfo";
import {StatsService} from "./services/stats/stats.service";
import {WindowRefService} from "./services/window/window-ref.service";


import {BackgroundDataVO} from "../mod-map/vos/BackgroundDataVO";
import {RouteService} from "./services/route/route.service";
import {IModel} from "./IModel";
import {ScatterValueVO} from "./vo/ScatterValueVO";
import { v4 as uuidv4 } from 'uuid';


@Injectable({
  providedIn: 'root'
})

export class ModelService implements IModel{

  public id:string;
  public selectedRegion:RegionNameVO = null;

  public regionNames:Array<RegionNameVO> = [];
  public regionNames_ids:Array<string> = [];

  public config:Config;
  private readyCount:number = 0; // finished if count === 4
  public READY:boolean = false;
  public MOBILE_SIZE:number= 900;
  public DPI:number = 1;
  public translations:Translations;

  // map_light
  // map_dark
  // map_osm
  public MAP_POP_STYLE:string = 'map_light';
  //////////////////////////////////////////////

  //public M1:string = '';
  public M1_names:Array<string>=['workplace','place-of-residence'];
  public M1_ids:Array<string>=['w','h'];

  //public M2:string = '';
  public M2_names:Array<string>=['number-of-workplaces','number-of-employees','added-value','value-produced'];
  public M2_ids:Array<string>=['e','e','av','vp'];

  //public M3:string = '';
  //public M4:string = '';

  public M3_names:Array<any> = ['industry','profession','sector'];
  public M3_ids:Array<any> = ['i','p','s'];



 // public T1:string = '3'; // 3,4,7
  //public T2:string = 'all';
  public T1_names:Array<any> = ['territories-3','territories-4','territories-7'];
  public T1_ids:Array<any> = ['3','4','7'];

  public years:Array<ControlValueVO> = [];



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
  private URLencoder:HttpUrlEncodingCodec;
  //////////////////////////////////////////////////////
  public theme:number = -1;     // -1: ugly,  1:normal
  public themeSTR:string = '';

  ////////////////////////////////////////////////////
  ///////////////////////////////////////////////////
  public titlesVO:TitlesVO;
  ////////////////////////////////////////////
  public dataIsNotComplete:boolean = false;
  ////////////////////////////////////////////
  public oldRoute:RouteVO;
  public route:RouteVO = new RouteVO('landing','lv');
  ////////////////////////////////
  public parentWinDomID:string='';


  constructor(
    private http: HttpClient,
    private router:Router,
    public window: WindowRefService,
    public dom:DomElementsInfo,
    public statsService:StatsService,
    public meta:MetaUpdateService,
    public settings:SettingsService,
    public routeService:RouteService,
    private logger:LoggerService
  ) {
    this.id = uuidv4();
    this.logger.enabled = false;
    this.logger.log('**************');
    this.logger.log('MODEL - CONSTR - id:'+this.id);
    this.logger.log('**************');

    this.URLencoder = new HttpUrlEncodingCodec();
    this.config = new Config();
    this.translations = new Translations();
    this.DPI = window.nativeWindow.devicePixelRatio || 1;
    ////////////////////////////////////////

    dom.document.querySelector('meta[property=\'js:version\']').setAttribute('content',environment.appVersion);


    this.meta.initialize(this);
    this.statsService.initialize(this,this.meta);

    this.settings.initialize(this);
    this.routeService.initialize(this);



    window.nativeWindow.addEventListener("message", (event) => {
        const func:string = event.data.func;
        const id:string = event.data.id;
        const fullscreen:boolean = event.data.fullscreen;

        this.logger.log('***************');
        this.logger.log('MODEL - MESSAGE');
        this.logger.log('***************');
        this.logger.log('func: '+func);
        this.logger.log('id: '+id);
        this.logger.log('***************');


        let elem:HTMLElement = document.getElementById('comp-'+id) as HTMLElement;

        switch (func){
          case 'iframe-fullscreen':

              if(fullscreen==true){
                elem.classList.add('iframe-full');
                window.nativeWindow.dispatchEvent(new Event('resize'));
              }else{
                elem.classList.remove('iframe-full');
                window.nativeWindow.dispatchEvent(new Event('resize'));
              }
            break;

          case 'resize':

            const ww:number = event.data.width
            const hh:number = event.data.height;

            break;

        }



      },
      false,
    );


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

  ngOnDestroy():void{
    this.logger.log('**************');
    this.logger.log('MODEL - ngOnDestroy');
    this.logger.log('**************');
    alert('MODEL - ngOnDestroy');
  }
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
          if(param==='theme'){
            this.theme = value==='1'?1:-1;
            this.themeSTR = value==='1'?'?theme=1':'';
          }
        }
      });
    }
  }
  private parseURL=(url:string):void=>{
    this.parseURLParams();
    this.logger.log('**************');
    this.logger.log('Model.parseURL');
    this.logger.log('- url:' +url);
    this.logger.log('- routeURL:' +this.routeURL);

    if(this.routeURL === url){
      return;
    }
    this.oldRoute = this.route.clone();

    const arr:Array<string>=url.split(',');
    this.routeURL = url;



    let isRouteValid:boolean = true;
    const lang:string = arr[0]==='lv'?'lv':'en';
    const view:string = arr[1];

    if(view == 'about'){

        // lang/about
        this.route = new RouteVO(view,lang);
        this.route.year = this.oldRoute.year;
        if(this.oldRoute.M1==''||this.oldRoute.M2==''||this.oldRoute.T1==''||this.oldRoute.T2==''||this.oldRoute.M3==''||this.oldRoute.M4==''){
          this.route.M1='w';
          this.route.M2='e';
          this.route.T1 = '3';
          this.route.T2 = 'all';
          this.route.M3 = 'none';
          this.route.M4 = 'none';
        }

      this.logger.log('check about route...');
      this.logger.log('new:');
      this.logger.dir(this.route);
      this.logger.log('old:');
      this.logger.dir(this.oldRoute);


    }else if(view == 'api'){
      // lang/api
      this.route = new RouteVO(view,lang);
      this.route.year = this.oldRoute.year;
      if(this.oldRoute.M1==''||this.oldRoute.M2==''||this.oldRoute.T1==''||this.oldRoute.T2==''||this.oldRoute.M3==''||this.oldRoute.M4==''){
        this.route.M1='w';
        this.route.M2='e';
        this.route.T1 = '3';
        this.route.T2 = 'all';
        this.route.M3 = 'none';
        this.route.M4 = 'none';
      }

    }else if(view == 'iframe'){
      // lang/iframe
      this.route = new RouteVO(view,lang);
      this.route.year = this.oldRoute.year;
      if(this.oldRoute.M1==''||this.oldRoute.M2==''||this.oldRoute.T1==''||this.oldRoute.T2==''||this.oldRoute.M3==''||this.oldRoute.M4==''){
        this.route.M1='w';
        this.route.M2='e';
        this.route.T1 = '3';
        this.route.T2 = 'all';
        this.route.M3 = 'none';
        this.route.M4 = 'none';
      }

    }else if(view == 'compare'){

      if(arr.length==11){
        // :lang/compare/:year/:M1/:M2/:T1/:T2/:M3/:M4/:SX/:SY',

        const year:number = this.getYearFromRoute(arr[2]);
        if(year==-1){
          this.routeParamsNotValidError(); return;
        }

        const m1:string = arr[3];
        const m2:string = arr[4];
        const t1:string = arr[5];
        const t2:string = arr[6];
        const m3:string = arr[7];
        const m4:string = arr[8];
        const sx:string = arr[9];
        const sy:string = arr[10];

        const M1 = this.M1_ids[this.M1_names.indexOf(m1)];
        const M2 = this.M2_ids[this.M2_names.indexOf(m2)];

        const T1 = this.T1_ids[this.T1_names.indexOf(t1)];
        const T2 = t2;
        const M3 = m3==='none'?'none':this.M3_ids[this.M3_names.indexOf(m3)];
        const M4 = m4;
        const SX = sx;
        const SY = sy;


        this.route = new RouteVO(view,lang,M1, M2, M3, M4, T1, T2, year,SX, SY);

        if (T2!=='none') {
          this.selectedRegion = this.getRegionbyCode(this.route.T2);
        }else{
          this.selectedRegion = null;
        }
        this.loadSelectedRegionName();
      }else{
        isRouteValid = false;
      }
    }else if(view == 'landing'||'map'||'territory'){

      if(arr.length==9){
        // :lang/map/:year/:M1/:M2/:T1/:T2/:M3/:M4',

        const year:number = this.getYearFromRoute(arr[2]);
        if(year==-1){
          this.routeParamsNotValidError(); return;
        }

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

        if (T2!=='none') {
          this.selectedRegion = this.getRegionbyCode(this.route.T2);
        }else{
          this.selectedRegion = null;
        }
        this.loadSelectedRegionName();
      }else{
        isRouteValid = false;
      }
    }else{
      isRouteValid = false;
    }

    if(isRouteValid == false){
      this.routeParamsNotValidError();
    }

    this.logger.log('*************');
    this.logger.log('selectedRegion:');
    this.logger.dir(this.selectedRegion);
    this.logger.log('*************');
    this.routeHasBeenUpdated();
    this.translations.lang = this.route.lang;
  }
  public setRouteValues(route:RouteVO):void{
    const isDirty:boolean = !this.route.isEqual(route);
    if(isDirty===false) { return;}

    let url:string;
    switch (route.view) {

      case 'about':
        // :lang/about
        url = '/' + route.lang + '/' + route.view;
        break;

      case 'api':
        // :lang/api
        url = '/' + route.lang + '/' + route.view;
        break;

      case 'iframe':
        // :lang/iframe
        url = '/' + route.lang + '/' + route.view;
        break;

      case 'compare':

         url = '/' + route.lang + '/'+route.view+'/' + route.year + '/' + this.M1_getRouteNameFromID(route.M1) + '/' + this.M2_getRouteNameFromID(route.M2, route.M1)+'/'+ this.T1_getRouteNameFromID(route.T1) + '/' + route.T2 + '/' + this.M3_getRouteNameFromID(route.M3) + '/' + route.M4+'/'+route.SX+'/'+route.SY;
        break;

      default:
         url = '/' + route.lang + '/'+route.view+'/' + route.year + '/' + this.M1_getRouteNameFromID(route.M1) + '/' + this.M2_getRouteNameFromID(route.M2, route.M1) + '/' + this.T1_getRouteNameFromID(route.T1) + '/' + route.T2 + '/' + this.M3_getRouteNameFromID(route.M3) + '/' + route.M4;
        break;
    }
    this.logger.log('MODEL - setRouteValues:'+url);
    this.router.navigateByUrl(url);
  }


  private initialize():void{
    this.readyCount++;
    this.loadConfig();
  } // ready - 1
  private checkReady():void{
    if(this.readyCount === 5){
      this.READY = true;
      //this.parseURL(this.initialURL);
      this.logger.log('*****************');
      this.logger.log('MODEL - READY - 5');
      this.logger.log('*****************');
      this.logger.dir(this.route);
      this.logger.dir(this.selectedRegion);
      this.logger.log('*****************');
      this.onModelReady.emit();
    }
  }

  public loadTranslations():void{
    if(this.config.translationsFrom==='json'){
      this.loadTranslationsJSON();
    }else{
      this.loadTranslationsDB();
    }
  }
  public loadTranslationsComplete():void{

    this.logger.log('loadTranslationsComplete()  lang:'+this.translations.lang);
    this.readyCount++;
    this.loadYears();
  }   // ready - 3

  public loadTranslationsJSON():void{
    const uuid:string = uuidv4();
    this.http.get(this.translationsURL+'?id='+uuid).subscribe((data:any) => this.loadTranslationsJSONComplete({...data}));
  }
  public loadTranslationsJSONComplete(data:any):void{
    this.translations.initializeJSON(data,this.route.lang);
    this.loadTranslationsComplete();
  }

  public loadTranslationsDB():void{
    const uuid:string = uuidv4();
    this.http.get(this.config.serviceURL+'?db=translations&id='+uuid).subscribe((data:any) => this.loadTranslationsDBComplete({...data}));
  }
  public loadTranslationsDBComplete(data:any):void{
    if(data.info==='ok') {
      this.translations.initializeDB(data.data, this.route.lang);
      this.loadTranslationsComplete();
    }else{
      throwError('Model.loadTranslationsDB - translations not loaded..');
    }
  }

  public loadConfig():void{
    this.http.get(this.configURL).subscribe((data:any) => this.loadConfigComplete({...data}));
  }
  public loadConfigComplete=(data:any):void=>{
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

  public loadYears():void{
    // https://tools.csb.gov.lv/tea/api?db=menu-years
    this.logger.log('Model - loadYears');
    const url:string = this.config.serviceURL+'?db=menu-years';
    this.http.get(url).subscribe((data:any) => this.loadYearsComplete({...data}));
  }
  private loadYearsComplete=(data:any):void=>{
    this.logger.log('Model - loadYearsComplete');
    if(data.info==='ok'){
      const arr = data.data;
      const L:number = arr.length;
      let i:number=0;
      let year:number=0;
      while(i<L){
        year = arr[i].year;
        this.years.push(new ControlValueVO(year+'',new TranslationVO('year',year+'',year+'')));
        i++;
      }

      this.logger.log('************************');
      this.logger.log('MODEL-YEARS');
      this.logger.dir(this.years);
      this.logger.log('************************');
      this.route.year = parseInt(this.years[0].id);
      this.logger.dir(this.route);
      this.logger.log('************************');
      this.readyCount++;
      this.parseURL(this.initialURL);
      if(this.route.T1==''){
        this.readyCount++;this.checkReady();
      }else{
        this.loadTerritories(this.route.T1);
      }
    }else{
      throwError('Model.loadYears - years not loaded..');
    }
  } // ready - 4 -->loadTerritories

  private loadTerritories(id:string):void{
    this.logger.log('Model - loadTerritories id:'+id);
    this.http.get(this.config.serviceURL+'?db=menu-territories&level='+id+'&year='+this.route.year).subscribe((data:any) => this.onLoadTerritoriesDone(id,{...data}));
  }
  private onLoadTerritoriesDone=(id:string,data:any):void=>{
    this.logger.log('Model - onLoadTerritoriesDone id:'+id);
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
 /*       regionNames.push(
          new RegionNameVO(
            item.code,
            new TranslationVO(item.code,item.name_lv,item.name_en),
            new TranslationVO(item.code,item.name_lv_short,item.name_en_short)
          )
        );*/
        regionNames.push(
          new RegionNameVO(
            item.code,
            new TranslationVO(item.code,item.name_lv,item.name_en),
            new TranslationVO(item.code,item.name_lv_short,item.name_en_short),
            item.name_lv_dat,
            item.name_lv_gen,
            item.name_lv_loc,
            item.name_lv_short,
            item.name_lv_short_dat,
            item.name_lv_short_gen,
            item.name_lv_short_loc
          )
        );
        //////////////////////////////
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
      /* TODO - jāaizvāc?! */
      // this.loadSelectedRegionName();

      ///////////////////////

      this.readyCount++;
      this.checkReady();

    }else{
      this.logger.error('dataT2 - load error..');
    }

  } //ready  - 5
  ////////////////////////////////////////

  private loadSelectedRegionName():void{
    if(this.route.T2==='all'){
      this.selectedRegion = null;
      return;
    }
    this.logger.log('Model - loadSelectedRegionName');
    this.settings.loadTerritoryName(this.route.T2,this.route.T1,this.route.year).subscribe((data:any) => this.loadSelectedRegionDone({...data}));
  }
  private loadSelectedRegionDone=(ob:any):void=>{
    if(ob.data && ob.info==='ok'){
      this.logger.log('Model - loadSelectedRegionDone');
      const item:any = ob.data[0];
      this.selectedRegion = new RegionNameVO(
          item.code,
          new TranslationVO(item.code,item.name_lv,item.name_en),
          new TranslationVO(item.code,item.name_lv_short,item.name_en_short)
        );
      // this.logger.dir(this.selectedRegion);
    }else{
      this.selectedRegion = null;
    }
  }

  private dataHasBeenUpdated():void{
    this.onDataUpdate.emit('update');
  }
  private routeHasBeenUpdated():void{
    this.onRouteUpdate.emit('update');
    this.statsService.sendStats();
  }
  private languageHasBeenUpdated():void{
    this.logger.log('languageHasBeenUpdated() :'+this.route.lang);
    this.translations.lang = this.route.lang;
    this.onLanguageUpdate.emit('update');
  }

  /////////////////////////////////////////////////
  // setters & getters
  /////////////////////////////////////////////////

  public M1_getRouteNameFromID(id:string):string{
    if(id=='none'){ return id;}
    const index:number = this.M1_ids.indexOf(id);
    if(index==-1){
      this.routeParamsNotValidError();
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
    this.logger.log('MODEL - geatYearFromRoute: '+id);

    if(id=='latest'){

      return parseInt(this.years[0].id);

    }else {

      let i: number = 0;
      let L: number = this.years.length;
      let vo: ControlValueVO = null;
      let item: ControlValueVO = null;

      while (i < L) {
        vo = this.years[i];
        if (vo.id == id) {
          item = vo;
        }
        i++;
      }
      return item !== null ? parseInt(item.id) : -1;

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
      // // this.logger.error('getRegionbyCode('+code+') - region not found !!!');
      this.routeParamsNotValidError();
      return null;
    }
  }
  public getRoute():RouteVO{
      return this.route.clone();
  }

  public routeParamsNotValidError=():void=>{
    this.logger.log('**************************');
    this.logger.log('Model.routeParamsNotValidError');
    this.logger.log('**************************');
    //this.window.nativeWindow.location.href = this.config.hostURL+'/';
    this.logger.log('path:' +this.window.nativeWindow.location.href);
    this.logger.log('**************************');
  }
  //////////////////////////////////
  public resize():void{
    this.onResizeUpdate.emit('update');
  }




}
