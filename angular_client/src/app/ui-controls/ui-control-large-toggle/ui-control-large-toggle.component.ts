import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ControlValueVO} from '../vos/ControlValueVO';
import {TranslationVO} from '../../model/vo/TranslationVO';

@Component({
  selector: 'app-ui-control-large-toggle',
  templateUrl: './ui-control-large-toggle.component.html',
  styleUrls: ['./ui-control-large-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiControlLargeToggleComponent implements OnInit,OnChanges {

  @Input() control_id:string;
  @Input() label:TranslationVO;
  @Input() lang:string;
  @Input() values:Array<ControlValueVO>=[];
  private values_ids:Array<string>=[];
  @Input() id:string = '';

  public value:ControlValueVO;

  public interval:number = 0;
  @Output() onChange:EventEmitter<ControlValueVO> = new EventEmitter<ControlValueVO>();

  constructor() { }

  ngOnInit() {
    this.interval = <any>setInterval(this.checkIfValuesReady,50);
  }
  private checkIfValuesReady=():void=>{
    if(this.values && this.id!==''){
      clearInterval(this.interval);
      this.initialize();
    }
  }
  private initialize(){
    for(let i=0;i<this.values.length;i++){
      this.values[i].name.lang = this.lang;
      if(this.values[i].id===this.id){
        this.value = this.values[i];
      }
    }
  }
  ngOnChanges(changes:SimpleChanges): void {
    if(changes['values'] && this.values.length>0){
      let i:number=0;
      const L:number = this.values.length;
      this.values_ids = [];
      while(i<L){
        this.values_ids.push(this.values[i].id);
        i++;
      }
    }
    if(changes['id']){
      if(this.id==='') {
        this.value = this.values[0];
      }else{
        const index:number =this.values_ids.indexOf(this.id);
        this.value = this.values[index];
      }
    }
    if(changes['lang']){
      this.values.forEach((item:ControlValueVO)=>{
        item.name.lang = this.lang;
      });
      if(this.value){
        this.value.name.lang = this.lang;
      }
    }
  }

  public onClick=(index:number):void=>{
    this.value = this.values[index];
    this.onChange.emit(this.value);
  }



}
