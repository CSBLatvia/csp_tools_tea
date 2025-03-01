import {
  AfterViewInit, Component, HostListener, inject, Input, OnChanges,
  OnDestroy,
  OnInit, SimpleChanges, ViewChild, ViewContainerRef
} from "@angular/core";

import {ActivationEnd, Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {IModel} from "../../app/model/IModel";
import {ComponentServiceErrorVO} from "../mod-external/services/ComponentServiceErrorVO";
import {ComponentServiceEmptyVO} from "../mod-external/services/ComponentServiceEmptyVO";
import {DomElementsInfo} from "../../app/model/vo/DomElementsInfo";
import {RouteVO} from "../../app/model/vo/RouteVO";
import {LoggerService} from "../../app/model/log/logger.service";



@Component({template: ``,})

export abstract class AComponent implements OnInit, AfterViewInit,OnDestroy,OnChanges{

  @ViewChild('comp', { read: ViewContainerRef, static: true }) compRef:ViewContainerRef;

  @Input() public route:RouteVO = null;
  @Input() public visible:boolean = false;
  @Input() public fullscreen:boolean = false;
  @Input() public model:IModel = null;
  @Input() public URL:string='';


  public lang:string;
  public initialized:boolean = false;

  public domID:string='none';

  private HOST:string;
  private onModelReadyListener:any = null;
  private onResizeListener:any = null;


  public error:ComponentServiceErrorVO = null;
  public empty:ComponentServiceEmptyVO = null;
  private request:any;
  private running:boolean = false;
  protected logger:LoggerService = inject(LoggerService);

  constructor() {
    this.logger.enabled = true;
  }

  ngOnChanges(changes: SimpleChanges) {

    if(this.model!==null && this.URL!=='' && this.route!==null && this.initialized==false){
      this.logger.log('--constr');
      this.constr();
    }else{
      this.logger.log('--onChanges');
      if(this.model!==null&&this.route!==null&& this.URL!==''){
        this.lang = this.route.lang;
        this.onChanges();
      }

    }
  }
  private constr(){
    this.parseURLParams();
    this.model.onResizeUpdate.subscribe(this.onResize);
    this.onModelReadyListener =  this.model.onModelReady.subscribe(this.onModelReady);
    this.onResizeListener =  this.model.dom.onUpdate.subscribe(this.onResize);
    if(this.model.READY===true){
      this.initialize();
    }
    this.startListener();
  }

  private parseURLParams():void{

    const hasParams:boolean = this.URL.split('?').length>1;
    if(hasParams===true) {
      const params:Array<string> = this.URL.split('?')[1].split('&');
      let param_arr:Array<string>;
      let param:string='';
      let value:string='';
      params.forEach((item: string) => {
        param_arr = item.split('=');
        if (param_arr.length === 2) {
          param = item.split('=')[0];
          value = item.split('=')[1];
          if (param === 'dom') {
            this.domID = value;
          }
        }
      });
    }
  }
  ngOnInit(): void {
    if(this.model==undefined){ return;}
    if(this.model.READY===true){
      this.initialize();
    }
  }
  ngAfterViewInit() {
    if(this.model==undefined){ return;}
    if(this.model.READY===true){
      this.initialize();
    }
  }
  ngOnDestroy() {
    if(this.onResizeListener==null && this.onModelReadyListener==null){
      return;
    }
    this.onModelReadyListener.unsubscribe();
    this.onResizeListener.unsubscribe();
  }

  private onModelReady=():void=>{
    this.initialize();
  }

  private onResize=(e:DomElementsInfo=null):void=>{
    this.informParentAboutSize();
  }

  initialize():void {
    if (this.initialized == true) { return; }
    this.logger.log('AComponent - initialize');

    /* TODO - sis ir vai nav jaaizvāc???
        Izskatās, ka ir lieks, jo route atnāk componetei kā Input() mainīgais no ārpuses
      */
    // this.route = this.model.getRoute();


    this.initialized = true;
    this.onInitialize();
  }

  public onChanges():void{
    this.logger.log('AComponent - onChanges() - must be overridden!!!');
  }
  public onInitialize():void{
    this.logger.log('AComponent - onInitialize() - must be overridden!!!');
  }

  private startListener():void{
    if(this.running===true){return;}
    this.running = true;
    this.request = requestAnimationFrame(this.repeat);
  }
  private stopListener():void{
    if(this.running===false){return;}
    cancelAnimationFrame(this.request);
    this.running = false;
  }
  private repeat=():void=>{
    if(this.model==undefined){ return;}
    const embedded:boolean = this.model.window.nativeWindow.self !== this.model.window.nativeWindow.top;
    const container: HTMLElement = this.compRef.element.nativeElement;
    if(embedded==true && container!==undefined){
      this.stopListener();
      this.informParentAboutSize();
    }else {
      this.request = requestAnimationFrame(this.informParentAboutSize);
    }
  }
  protected informParentAboutSize=():void=>{
    if(this.model==undefined){ return;}

    const win: any = this.model.window.nativeWindow;
    const embedded: boolean = this.model.window.nativeWindow.self !== this.model.window.nativeWindow.top;
    const container: HTMLElement = this.compRef.element.nativeElement;

    if (embedded==true && container!==undefined) {
      if (win.parent) {
        win.parent.postMessage(
          {
            func: 'resize',
            height: this.compRef.element.nativeElement.offsetHeight,
            width: this.compRef.element.nativeElement.offsetWidth,
            id: this.model.parentWinDomID,
            fullscreen: this.fullscreen
          }, '*');
      }
    }else{
      win.postMessage(
        {
          func: 'resize',
          height: this.compRef.element.nativeElement.offsetHeight,
          width: this.compRef.element.nativeElement.offsetWidth,
          id: this.domID,
          fullscreen: this.fullscreen
        }, '*');
    }
  }
  protected informAboutFullscreen=():void=>{
    if(this.model==undefined){ return;}

    const win: any = this.model.window.nativeWindow;
    const embedded: boolean = this.model.window.nativeWindow.self !== this.model.window.nativeWindow.top;
    const container: HTMLElement = this.compRef.element.nativeElement;


    if (embedded==true && container!==undefined) {

      if (win.parent) {
            win.parent.postMessage(
              {
                func: 'iframe-fullscreen',
                fullscreen: this.fullscreen,
                id: this.model.parentWinDomID
              }, '*');
      }
    }else{

      win.postMessage(
        {
          func: 'iframe-fullscreen',
          fullscreen: this.fullscreen,
          id: this.domID
        }, '*');
    }
  }

  @HostListener('window:resize', ['$event'])
  onACompResize(event:Event){
    this.informParentAboutSize();
  }

  @HostListener('window:orientationchange', ['$event'])
  onACompOrientationChange(event:Event){
    this.informParentAboutSize();
  }



}
