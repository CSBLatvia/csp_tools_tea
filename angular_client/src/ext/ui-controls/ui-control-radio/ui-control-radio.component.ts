import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ControlValueVO} from '../vos/ControlValueVO';

@Component({
  selector: 'ui-control-radio',
  templateUrl: './ui-control-radio.component.html',
  styleUrls: ['./ui-control-radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class UiControlRadioComponent implements OnInit,OnChanges {

  @Input() control_id:string;
  @Input() label:string;
  @Input() lang:string;
  @Input() id:string = '';
  @Input() values:Array<ControlValueVO>=[];
  @Input() vertical:any = -1;
  @Input() horizontal:any = -1;
  public value:ControlValueVO;
  @Output() updateOnChange:EventEmitter<ControlValueVO> = new EventEmitter<ControlValueVO>();
  public interval:number = 0;


  constructor() { }

  ngOnInit() {
    this.vertical = this.vertical!==-1&&this.horizontal===-1?true:false;
    this.horizontal = this.horizontal!==-1&&this.vertical===-1?true:false;
    this.interval = <any>setInterval(this.checkIfValuesReady,50);
  }
  private checkIfValuesReady=():void=>{
    if(this.values && this.id!==''){
      clearInterval(this.interval);
      this.initialize();
    }
  }
  private initialize():void{
    this.resetAllItems();
  }
  ngOnChanges(changes: SimpleChanges): void {
  }

  public onClick=(id:string):void=>{
      this.id = id;
      this.resetAllItems();
      this.updateOnChange.emit(this.value);
  }
  private resetAllItems():void{
    this.values.forEach((item:ControlValueVO)=>{
      if(item.id===this.id){
        item.active = true;
        this.value = item;
      }else{
        item.active = false;
      }
    });
  }

}
