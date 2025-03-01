import {DomVO} from "./DomVO";
import {EventEmitter, inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {WindowRefService} from "../services/window/window-ref.service";

@Injectable({
  providedIn: 'root'
})


export class DomElementsInfo{

  public header:DomVO = new DomVO();
  public footer:DomVO = new DomVO();

  //////////////////////////////////////////
  public mapIsFullScreen:boolean = false;
  public legendIsVisible:boolean = false;
  public isMobile:boolean = false;
  public embedded:boolean = false;
  public screenshot:boolean = false;
  //////////////////////////////////////////

  public ww:number;
  public hh:number;
  public dpi:number;
  public wwR:number;
  public hhR:number;


  public onUpdate:EventEmitter<DomElementsInfo> = new EventEmitter<DomElementsInfo>();
  public document: Document = inject(DOCUMENT);
  public window: WindowRefService = inject(WindowRefService);


  constructor() {
    this.window.nativeWindow.addEventListener('resize',this.onHostResize);
    this.window.nativeWindow.addEventListener('orientationchange',this.onHostOrientationChange);
    this.window.nativeWindow.addEventListener('scroll',this.onHostScroll);
    this.onResize();
  }
  public update():void{
    // let AH:number = this.hh - this.header.height - this.footer.height;
    // this.document.documentElement.style.setProperty("--AH", AH + "px");
    // this.document.documentElement.style.setProperty("--HH", this.hh + "px");
    this.onUpdate.emit(this);
  }
  private onHostResize=(event:Event):void=>{
    this.onResize();
  }
  private onHostScroll=(event:Event):void=>{
    this.onResize();
  }

  private onHostOrientationChange=(event:Event):void=>{
    this.onResize();
  }
  private onResize=():void=> {
    this.ww = this.window.nativeWindow.innerWidth;
    this.hh = this.window.nativeWindow.innerHeight;
    this.dpi = this.window.nativeWindow.devicePixelRatio || 1;

    this.isMobile = this.ww<=900?true:false;

    this.wwR = this.ww*this.dpi;
    this.hhR = this.hh*this.dpi;

    if (this.window.nativeWindow.self !== this.window.nativeWindow.top) {
      // content is loaded in iframe
      this.embedded = true;
    }else{
      // content is not loaded in iframe
      this.embedded = false;
    }

    this.update();
  }



}
