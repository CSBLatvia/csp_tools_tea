import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {MapVizService} from "../../../../services/map-viz.service";
import {IModel} from "../../../../../../app/model/IModel";

@Component({
  selector: 'viz-picking',
  templateUrl: './viz-picking.component.html',
  styleUrls: ['./viz-picking.component.scss']
})
export class VizPickingComponent implements OnInit,OnDestroy {

  @Input() mobile:boolean=false;

  @ViewChild('canvasRef', { read: ViewContainerRef, static: true }) canvasRef:ViewContainerRef;
  public canvas:HTMLCanvasElement;
  public canvasContext:CanvasRenderingContext2D;

  @Input() model:IModel;
  @Input()  ww:number=5000;
  @Input()  hh:number=5000;
  @Input()  wwR:number=5000;
  @Input()  hhR:number=5000;
  @Input()  dpi:number=1;

  private color:string='';

  @Output() onHide = new EventEmitter<any>();
  @Output() onShow = new EventEmitter<any>();
  @Output() onPositionUpdate = new EventEmitter<any>();

  private pickingDataRequestListener:any;
  private mouseIsDown:boolean = false;

  constructor(private service:MapVizService) {
  }

  ngOnInit() {
    this.canvas = this.canvasRef.element.nativeElement as HTMLCanvasElement;
    this.canvasContext  = this.canvas.getContext('2d',{willReadFrequently: true}) as CanvasRenderingContext2D;
    document.addEventListener('mousemove', this.onContainerMouseMove);
    document.addEventListener('mousedown', this.mouseDown);
    document.addEventListener('mouseup', this.mouseUp);
    this.pickingDataRequestListener = this.service.popService.onPickingDataRequest.subscribe(this.onPickingDataRequest);
  }
  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.onContainerMouseMove);
    document.removeEventListener('mousedown', this.mouseDown);
    document.removeEventListener('mouseup', this.mouseUp);
    this.pickingDataRequestListener.unsubscribe();
  }
  private mouseDown=(e:any):void=>{
    this.mouseIsDown = true;
  }
  private mouseUp=(e:any):void=>{
    this.mouseIsDown = false;
  }
  public onContainerMouseMove=(evt:any):void=> {
      if(this.mobile===true||this.mouseIsDown===true){return;}
      const rect = this.canvas.getBoundingClientRect();
      const x:number =  (evt.clientX) - rect.left;
      const y:number =  (evt.clientY) - rect.top;
      const rx:number =  x * this.dpi;
      const ry:number =  y * this.dpi;
      const colorData:any = this.canvasContext.getImageData(rx, ry, 1, 1).data;

      if((colorData[0]+colorData[1]+colorData[2])===0){
        if(this.color!==''){
          this.color='';
          this.onHide.emit();
        }
      }else{
          this.color = 'rgb(' + colorData[0] + ',' + colorData[1] + ','+ colorData[2] + ')';
          this.onShow.emit({color:this.color, x: (evt.clientX), y:(evt.clientY)});
          this.onPositionUpdate.emit({x: (evt.clientX),y:(evt.clientY)});
      }
  }
  public onPickingDataRequest=(ob:any):void=> {
    const rect = this.canvas.getBoundingClientRect();
    const x:number =  (ob.x);
    const y:number =  (ob.y);
    const rx:number =  x * this.dpi;
    const ry:number =  y * this.dpi;
    const colorData:any = this.canvasContext.getImageData(rx, ry, 1, 1).data;
    let exists:boolean = false;

    if((colorData[0]+colorData[1]+colorData[2])===0){
      this.color='';
      exists = false;
    }else{
      this.color = 'rgb(' + colorData[0] + ',' + colorData[1] + ','+ colorData[2] + ')';
      this.onShow.emit({color:this.color, x: (ob.x), y:(ob.y+60)});
      this.onPositionUpdate.emit({x: (ob.x),y:(ob.y+60)});
      exists = true;
    }
    this.service.popService.emitPickingData(exists);
  }



}
