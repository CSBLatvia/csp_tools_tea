import {
  AfterViewInit, inject, Injectable,
  OnDestroy,
  OnInit
} from "@angular/core";
import {ModelService} from "./model.service";
import {RouteVO} from "./vo/RouteVO";
import {DomElementsInfo} from "./vo/DomElementsInfo";
import {LoggerService} from "./log/logger.service";

@Injectable()

export class AViewSecond implements OnInit, AfterViewInit,OnDestroy{


  public route:RouteVO;
  public lang:string;
  public mobile:boolean = false;
  public initialized:boolean = false;

  private onRouteUpdateListener:any;
  private onModelReadyListener:any;
  private onLanguageChangeListener:any;
  private onDomUpdateListener:any;

  protected model:ModelService = inject(ModelService);
  protected dom:DomElementsInfo = inject(DomElementsInfo);
  protected logger:LoggerService = inject(LoggerService);

  constructor() {
    this.logger.enabled = false;
  }

  ngOnInit(): void {
    this.onRouteUpdateListener = this.model.settings.onServiceChange.subscribe(this.onRouteChanges);
    this.onModelReadyListener =  this.model.onModelReady.subscribe(this.onModelReady);
    this.onLanguageChangeListener = this.model.onLanguageUpdate.subscribe(this.onLanguageChanges);
    this.onDomUpdateListener = this.dom.onUpdate.subscribe(this.onDomChanges);

    this.logger.log('****************');
    this.logger.log('AViewSecond - ngOnInit');
    this.logger.log('****************');

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
    this.onRouteUpdateListener.unsubscribe();
    this.onModelReadyListener.unsubscribe();
    this.onLanguageChangeListener.unsubscribe();
    this.onDomUpdateListener.unsubscribe();
  }

  private onModelReady=():void=>{
    this.initialize();
  }

  initialize():void {
    if (this.initialized == true) { return; }
    this.initialized = true;
    this.route = this.model.getRoute();
    this.lang = this.route.lang;
    this.mobile = this.dom.isMobile;
    this.logger.log('****************');
    this.logger.log('AViewSecond - initialize');
    this.logger.log('****************');
    this.onChanges();
  }

  private onRouteChanges=():void=>{
    this.route = this.model.getRoute();
    this.lang = this.route.lang;
    this.onChanges();
  }
  private onLanguageChanges=():void=>{
    this.route = this.model.getRoute();
    this.lang = this.route.lang;
    this.onChanges();
  }
  private onDomChanges=()=>{
    if(this.mobile!==this.dom.isMobile){
      this.mobile = this.dom.isMobile;
      this.onChanges();
    }
  }
  ////////////////////////
  public onChanges():void{
    if(this.initialized==false){return;}
  }

}
