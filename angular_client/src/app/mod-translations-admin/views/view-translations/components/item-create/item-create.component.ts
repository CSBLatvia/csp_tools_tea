import {
  AfterViewInit,
  Component, EventEmitter,
  Input,
  OnDestroy,
  OnInit, Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {TranslationVO} from "../../../../../model/vo/TranslationVO";


@Component({
  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.scss']
})
export class ItemCreateComponent implements OnInit,AfterViewInit, OnDestroy {

  @Input() vo:TranslationVO;
  @Input() posY:number=0;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onCancel:EventEmitter<TranslationVO> = new EventEmitter<TranslationVO>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSubmit:EventEmitter<TranslationVO> = new EventEmitter<TranslationVO>();



  public titleVO:TranslationVO = new TranslationVO('title','Izveidot jaunu tulkojumu..','Create new translation..') ;
  public saveVO:TranslationVO = new TranslationVO('save','saglabāt','save') ;
  public cancelVO:TranslationVO = new TranslationVO('cancel','atcelt','cancel') ;

  @ViewChild('id', { read: ViewContainerRef, static: true }) id:ViewContainerRef;
  @ViewChild('nameLV', { read: ViewContainerRef, static: true }) nameLV:ViewContainerRef;
  @ViewChild('nameEN', { read: ViewContainerRef, static: true }) nameEN:ViewContainerRef;

  @ViewChild('itemRef', { read: ViewContainerRef, static: true }) itemRef:ViewContainerRef;

  constructor() { }
  public onCheckBoxChange=(id:number):void=>{
    if(id===1){
      this.vo.used = !this.vo.used;
    }else if(id===2){
      this.vo.html = !this.vo.html;
    }
  }
  ngOnInit(): void {
    this.titleVO.lang='en';
    this.saveVO.lang='en';
    this.cancelVO.lang='en';
  }
  ngAfterViewInit():void {
    const element:HTMLElement = this.itemRef.element.nativeElement;
    element.style.top = this.posY+'px';
  }
  ngOnDestroy():void {}

  public onSaveClick=():void=>{
    const vo:TranslationVO = this.vo.clone();
    vo.name_lv = this.nameLV.element.nativeElement.innerText;
    vo.name_en = this.nameEN.element.nativeElement.innerText;
    vo.id = this.id.element.nativeElement.innerText;

    this.onSubmit.emit(vo);
  }
  public onCancelClick=():void=>{
    this.onCancel.emit(this.vo);
  }




}
