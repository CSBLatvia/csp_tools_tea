import {AfterViewInit, Component, HostListener, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ModelService} from '../../model/model.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html'
})
export class TopMenuComponent implements OnInit,AfterViewInit {

  public mobile:boolean = false;
  public view:string='none';
  private ww:number = 0;
  private hh:number = 0;

  public initialized:boolean = false;
  private onModelReadyListener:any;

  @ViewChild("header", { read: ViewContainerRef }) header: ViewContainerRef;

  constructor(private model:ModelService) {}

  ngOnInit() {
    this.onModelReadyListener = this.model.onModelReady.subscribe(this.onModelReady);
    if(this.model.READY===true){
      this.initialize();
    }
  }
  ngAfterViewInit() {
    this.model.dom.header.height = this.header.element.nativeElement.offsetHeight;
    this.model.dom.update();
  }
  private onModelReady=():void=>{
    this.initialize();
  }

  initialize():void{
    if(this.initialized===true){ return; }
    this.initialized = true;
    this.view = this.model.getRoute().view;
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onHostResize(event:Event){
    this.onResize();
  }

  @HostListener('window:orientationchange', ['$event'])
  onHostOrientationChange(event:Event){
    this.onResize();
  }


  onResize() {
    if(this.initialized==false){ return; }
    const win:any = window;
    this.ww = +win.innerWidth;
    this.hh = +win.innerHeight;
    this.mobile = this.ww<=this.model.MOBILE_SIZE;
  }

}
