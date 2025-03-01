import {
  AfterViewInit, Component, Directive, inject,
  OnDestroy,
  OnInit
} from "@angular/core";
import {ModelService} from "./model.service";
import {RouteVO} from "./vo/RouteVO";
import {ControlValueVO} from "../ui-controls/vos/ControlValueVO";
import {DomElementsInfo} from "./vo/DomElementsInfo";

@Component({
  selector: '',
  template: ``
})
export abstract class AChooseUI implements OnInit, AfterViewInit,OnDestroy{


  public route:RouteVO;
  public visible:boolean = true;
  public lang:string;
  public initialized:boolean = false;

  private onServiceInitializedListener:any;
  private onServiceChangeListener:any;
  private onModelReadyListener:any;
  private onLanguageChangeListener:any;

  protected model:ModelService;
  protected dom:DomElementsInfo;

  constructor(model:ModelService,dom:DomElementsInfo) {
    this.model = model;
    this.dom = dom;
  }
  ngOnInit(): void {

    this.onServiceInitializedListener = this.model.settings.onServiceInitialized.subscribe(this.onServiceInitialized);
    this.onServiceChangeListener = this.model.settings.onServiceChange.subscribe(this.onServiceChange);
    this.onModelReadyListener =  this.model.onModelReady.subscribe(this.onModelReady);
    this.onLanguageChangeListener = this.model.onLanguageUpdate.subscribe(this.onLanguageChange);

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
    this.onServiceInitializedListener.unsubscribe();
    this.onServiceChangeListener.unsubscribe();
    this.onModelReadyListener.unsubscribe();
    this.onLanguageChangeListener.unsubscribe();
  }

  private onModelReady=():void=>{
    this.initialize();
  }

  initialize():void {
    if (this.initialized == true) { return; }
    this.initialized = true;
    this.onLanguageChange();
    this.onServiceChange();
  }

  private onServiceInitialized=():void=>{
    this.initialize();
  }
  private onServiceChange=():void=>{
    this.route = this.model.getRoute();
    this.lang = this.route.lang;
    this.onComponentValuesChanged();
  }
  private onLanguageChange=():void=>{
    this.route = this.model.getRoute();
    this.lang = this.route.lang;
    this.onComponentLanguageChanged();
  }
  public onComponentValuesChanged():void{
    // console.log('AChooseUI - onComponentValuesChanged() - must be overridden!!!');
  }
  public onComponentLanguageChanged():void{
    // console.log('AChooseUI - onComponentLanguageChanged() - must be overridden!!!');
  }
  public onChange(vo:ControlValueVO):void{
    // console.log('AChooseUI - onChange() - must be overridden!!!');
  }

}
