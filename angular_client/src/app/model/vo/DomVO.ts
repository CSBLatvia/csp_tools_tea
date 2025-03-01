import {EventEmitter} from "@angular/core";

export class DomVO{

  public width:number=-1;
  public height:number=-1;
  public visible:boolean=false;
  public x:number=-1;
  public y:number=-1;
  public onUpdate:EventEmitter<DomVO> = new EventEmitter<DomVO>();

  constructor(visible:boolean = false, width:number=0,height:number=0,x:number=0,y:number=0) {

    this.width = width;
    this.height = height;
    this.visible = visible;

    this.x = x;
    this.y = y;
  }
  public update():void{
    this.onUpdate.emit(this);
  }
}
