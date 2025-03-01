import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ControlValueVO} from '../vos/ControlValueVO';
import {TranslationVO} from '../../model/vo/TranslationVO';

@Component({
  selector: 'app-ui-control-combo-box',
  templateUrl: './ui-control-combo-box.component.html',
  styleUrls: ['./ui-control-combo-box.component.scss']
})
export class UiControlComboBoxComponent implements OnInit,OnChanges {

  @Input() control_id:string;
  @Input() canBeSwitchedOf:boolean = false;
  @Input() disabled:boolean = false;
  @Input() label:TranslationVO;
  @Input() lang:string;
  @Input() values:Array<ControlValueVO>=[];
  @Input() id:string = '';

  public value:ControlValueVO;
  public activeIndex:number=-1;

  private interval:number=-1;
  @Output() onChange:EventEmitter<ControlValueVO> = new EventEmitter<ControlValueVO>();

  constructor() { }

  ngOnInit() {
    this.interval = <any>setInterval(this.checkIfValuesReady,50);
  }
  ngOnChanges(changes:SimpleChanges): void {
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
  public onClick=(id:string):void=>{
    if(this.disabled==true){return;}

    const active_values:Array<ControlValueVO> = [];
    let i:number=0;
    const L:number = this.values.length;
    let index:number = -1;
    this.activeIndex = -1;
    if(this.canBeSwitchedOf===true) {

          while(i<L){
              if(this.values[i].id!==id && this.values[i].active===true){
                active_values.push(this.values[i]);
              }
              if(this.values[i].id===id){
                index = i;
              }
              i++;
          }
          active_values.forEach((item: ControlValueVO) => {
            item.active = false;
          })
          this.values[index].active = !this.values[index].active;
          this.value = this.values[index];
          if(this.value.active===false){
            this.activeIndex = -1;
          }else{
            this.activeIndex = index;
          }
          this.onChange.emit(this.value);

    }else{

              while(i<L){
                if(this.values[i].id===id){
                  this.activeIndex = i;
                }
                if(this.values[i].id===id && this.values[i].active===false){
                  index = i;this.activeIndex = i;
                }
                i++;
              }
              if(index===-1){return;}
              this.values[index].active =  !this.values[index].active;
              this.value = this.values[index];
              this.onChange.emit(this.value);
    }

  }

}
