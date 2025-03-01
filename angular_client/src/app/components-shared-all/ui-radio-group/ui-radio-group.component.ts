import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslationVO} from "../../model/vo/TranslationVO";
import {ModelService} from "../../model/model.service";
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'ui-radio-group',
  templateUrl: './ui-radio-group.component.html',
  styleUrls: ['./ui-radio-group.component.scss']
})
export class UiRadioGroupComponent implements OnInit {

  @Input() hidden:boolean = false;
  @Input() value:any;
  @Input() variants:Array<any> = [];
  @Input() variantsTitlesIDS:Array<string> = [];
  @Input() variantsTitles:Array<TranslationVO> = [];


  @Input() titleID:string = '';
  public title:TranslationVO;

  @Input() formTitleID:string = '';
  public formTitle:TranslationVO;

  @Output() onValueChange:EventEmitter<any> = new EventEmitter<any>();



  public formName:string;
  public id:string;
  private onModelReadyListener:any;
  private initialized:boolean = false;




  constructor(private model: ModelService) { }

  ngOnDestroy(){
    this.onModelReadyListener.unsubscribe();
  }
  ngOnInit() {
    this.id = uuidv4();
    this.formName =  'ui-radio-form-'+this.id;

    this.onModelReadyListener = this.model.onModelReady.subscribe(this.onModelReady);
    if(this.model.READY===true){
      this.initialize();
    }
  }
  initialize():void{
    if(this.initialized===true){ return; }

    this.title = this.model.translations.item(this.titleID);
    this.formTitle = this.model.translations.item(this.formTitleID);


    this.variantsTitlesIDS.forEach((item:string)=>{
      this.variantsTitles.push(this.model.translations.item(item));
    })

    this.initialized = true;
  }
  private onModelReady=():void=>{
    this.initialize();
  }
  public onRadioClick(item:any):void{
    this.value = item;
    this.onValueChange.emit(this.value);
  }

}
