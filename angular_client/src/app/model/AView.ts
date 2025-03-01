import {
  AfterViewInit, Component, Directive, ElementRef, Host, inject, Input,
  OnDestroy,
  OnInit
} from "@angular/core";
import {ModelService} from "./model.service";
import {RouteVO} from "./vo/RouteVO";
import {DomElementsInfo} from "./vo/DomElementsInfo";
import {LoggerService} from "./log/logger.service";

@Directive({
  selector: '[AView]',
})

export class AView implements OnInit, AfterViewInit,OnDestroy{


  public route:RouteVO;
  public lang:string;
  public mobile:boolean = false;
  public initialized:boolean = false;

  private onRouteUpdateListener:any;
  private onModelReadyListener:any;
  private onLanguageChangeListener:any;
  private onDomUpdateListener:any;

  @Input() parent:any;

  constructor(public model:ModelService, public dom:DomElementsInfo, protected logger:LoggerService) {
    this.logger.enabled = false;
  }

  ngOnInit(): void {
    this.onRouteUpdateListener = this.model.settings.onServiceChange.subscribe(this.onRouteChanges);
    this.onModelReadyListener =  this.model.onModelReady.subscribe(this.onModelReady);
    this.onLanguageChangeListener = this.model.onLanguageUpdate.subscribe(this.onLanguageChanges);
    this.onDomUpdateListener = this.dom.onUpdate.subscribe(this.onDomChanges);

    this.logger.log('****************');
    this.logger.log('AView - ngOnInit');
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
    this.logger.log('****************');
    this.logger.log('AView - initialize');
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
/*    this.logger.log('****************');
    this.logger.log('AView - onChanges');
    this.logger.log('initialized:'+this.initialized);
    this.logger.log('parent:'+this.parent);
    this.logger.log('****************');*/

    if(this.initialized==false){return;}
    if(this.parent==undefined){return;}



    this.parent.onChanges(this);


  }

}
