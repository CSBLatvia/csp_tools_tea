import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {ModelService} from '../../model/model.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit, OnDestroy {

  @Input() containerID:string = 'csbApp';
  @Input() scrollTop:boolean = false;

  public mobile:boolean = false;
  public view:string = 'none';
  private ww:number = 0;
  private hh:number = 0;

  private onModelReadyListener:any;
  public initialized:boolean = false;

  constructor(private model:ModelService) {}

  ngOnInit() {
    this.onModelReadyListener =  this.model.onModelReady.subscribe(this.onModelReady);
    if(this.model.READY===true){
      this.initialize();
    }
  }

  ngOnDestroy() {
    this.onModelReadyListener.unsubscribe();
  }

  private onModelReady=():void=>{
    this.initialize();
  }
  initialize():void{
    if(this.initialized===true){return;}
    this.initialized = true;
    this.update();
  }

  @HostListener('window:resize', ['$event'])
  onHostResize(event:Event){
    this.update();
  }

  @HostListener('window:orientationchange', ['$event'])
  onHostOrientationChange(event:Event){
    this.update();
  }


  update() {
    if(this.initialized===false){return;}
    const win:any = window;
    this.ww = +win.innerWidth;
    this.hh = +win.innerHeight;
    this.mobile = this.ww<=this.model.MOBILE_SIZE;
    this.view = this.model.getRoute().view;

  }
}
