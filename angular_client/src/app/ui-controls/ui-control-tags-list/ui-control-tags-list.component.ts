import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TranslationVO} from "../../model/vo/TranslationVO";
import {ControlValueVO} from "../vos/ControlValueVO";

@Component({
  selector: 'app-ui-control-tags',
  templateUrl: './ui-control-tags-list.component.html',
  styleUrls: ['./ui-control-tags-list.component.scss']
})
export class UiControlTagsListComponent implements OnInit,OnChanges {


  @Input() control_id:string;
  @Input() disabled:boolean = false;
  @Input() label:TranslationVO;
  @Input() lang:string;
  @Input() values:Array<ControlValueVO>=[];
  @Input() colors:Array<string>=[];
  @Input() colorsSelected:Array<string>=[];

  @Input() id:string = '';

  public value:ControlValueVO;
  public activeIndex:number=-1;

  private interval:number=-1;
  @Output() onChange:EventEmitter<ControlValueVO> = new EventEmitter<ControlValueVO>();
  @Output() onRemove:EventEmitter<ControlValueVO> = new EventEmitter<ControlValueVO>();

  constructor() { }

  ngOnInit(): void {
    this.interval = <any>setInterval(this.checkIfValuesReady,50);
  }
  ngOnChanges(changes: SimpleChanges) {
    this.updateValues();
  }
  private checkIfValuesReady=():void=>{
    if(this.values){
      clearInterval(this.interval);
      this.initialize();
    }
  }
  private initialize(){
    this.updateValues();
  }
  private updateValues():void{
    let i:number=0;
    const L:number = this.values.length;
    this.value = null;
    this.activeIndex = -1;

    while(i<L){
      this.values[i].name.lang = this.lang;
      this.values[i].active = false;
      if(this.values[i].id===this.id){
        this.values[i].active = true;
        this.activeIndex = i;
        this.value = this.values[i];
      }
      i++;
    }
  }
  public onClick=(item:ControlValueVO):void=>{
    this.values.forEach((vo:ControlValueVO)=>{
      if(vo.id==item.id){
        vo.active = !item.active;
      }else{
        vo.active = false;
      }
    });
      this.value = item;
      this.onChange.emit(this.value);
  }
  public onClickDelete=(item:ControlValueVO):void=>{
    this.onRemove.emit(item);
  }

}
