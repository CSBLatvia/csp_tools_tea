import {
  AfterViewInit, Component, inject, Input,
  OnDestroy,
  OnInit
} from "@angular/core";
import {ModelService} from "./model.service";
import {RouteVO} from "./vo/RouteVO";
import {DomElementsInfo} from "./vo/DomElementsInfo";
import { environment } from '../../environments/environment';
import { v4 as uuidv4 } from 'uuid';
import {LoggerService} from "./log/logger.service";
import {Router} from "@angular/router";
import {TranslationVO} from "./vo/TranslationVO";



@Component({template: ``,})
export class ABlock implements OnInit, AfterViewInit,OnDestroy{

  public titleVO:TranslationVO;
  public subTitleVO:TranslationVO;
  public descriptionVO:TranslationVO;
  public component_link:string;
  public linkVO:TranslationVO;
  public link:string;

  public route:RouteVO;
  public oldRoute:RouteVO;
  public lang:string;
  public open:boolean = false;
  public mobile:boolean = false;
  public initialized:boolean = false;
  public id:string = uuidv4();
  public externalComponentsURL:string;

  private onRouteUpdateListener:any;
  private onModelReadyListener:any;
  private onLanguageChangeListener:any;
  private onDomUpdateListener:any;

  public model:ModelService = inject(ModelService);
  public dom:DomElementsInfo = inject(DomElementsInfo);
  public logger:LoggerService = inject(LoggerService);

  constructor() {
    this.logger.enabled = false;
  }

  ngOnInit(): void {

    this.mobile = this.dom.isMobile;
    this.open = false;

    this.onRouteUpdateListener = this.model.onRouteUpdate.subscribe(this.onRouteUpdate);
    this.onModelReadyListener =  this.model.onModelReady.subscribe(this.onModelReady);
    this.onLanguageChangeListener = this.model.onLanguageUpdate.subscribe(this.onLanguageChange);
    this.onDomUpdateListener = this.dom.onUpdate.subscribe(this.onDomUpdate);

    if(this.model.READY===true){
      this.initialize();
    }
  }
  ngAfterViewInit() {
    if(this.model.READY===true){
      this.initialize();
    }
  }
  ngOnDestroy() {
    if(this.onRouteUpdateListener!==undefined){this.onRouteUpdateListener.unsubscribe(); }
    if(this.onModelReadyListener!==undefined){this.onModelReadyListener.unsubscribe(); }
    if(this.onLanguageChangeListener!==undefined){this.onLanguageChangeListener.unsubscribe(); }
    if(this.onDomUpdateListener!==undefined){ this.onDomUpdateListener.unsubscribe(); }

  }

  private onModelReady=():void=>{
    this.initialize();
  }

  initialize():void {
    if (this.initialized == true) { return; }
    this.externalComponentsURL = environment.production==true?this.model.config.externalComponentsURL:environment.externalComponentsURL;
    this.initialized = true;
    this.route = this.model.getRoute();
    this.lang = this.route.lang;
    this.mobile = this.dom.isMobile;
    this.onChanges();
  }

  private onServiceInitialized=():void=>{
    this.initialize();
  }
  private onServiceChange=():void=>{
    //if(this.route && this.route.isEqual(this.model.getRoute())==true){ return;}
    this.route = this.model.getRoute();
    this.lang = this.route.lang;
    this.onChanges();
  }
  private onRouteUpdate=():void=>{
    this.route = this.model.getRoute();
    this.lang = this.route.lang;

  /*  this.logger.log('*******************');
    this.logger.log('ABlock - onRouteUpdate()');
    this.logger.log('externalComponentsURL:'+this.externalComponentsURL);
    this.logger.log('initialized:'+this.initialized);
    this.logger.log('mobile:'+this.mobile);
    this.logger.dir(this.route);
    this.logger.log('*******************');*/

    this.onChanges();
  }
  private onLanguageChange=():void=>{
    if(this.route && this.route.isEqual(this.model.getRoute())==true){ return;}
    this.route = this.model.getRoute();
    this.lang = this.route.lang;
    this.onChanges();
  }
  private onDomUpdate=()=>{
    if(this.mobile!==this.dom.isMobile){
      this.mobile = this.dom.isMobile;
      this.onChanges();
    }
  }
  public onOpenClose():void{
    this.open = !this.open;
    this.onChanges();
  }


  ////////////////////////
  public onChanges():void{
    if(this.initialized==false){return;}

/*    this.logger.log('*******************');
    this.logger.log('ABlock - onChanges()');
    this.logger.log('initialized:'+this.initialized);
    this.logger.log('*******************');*/
  }

}
