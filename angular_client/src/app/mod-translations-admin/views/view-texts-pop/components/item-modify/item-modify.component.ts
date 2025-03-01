import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import {TextsPopVO} from '../../../../vos/TextsPopVO';
import {TranslationVO} from "../../../../../model/vo/TranslationVO";


@Component({
  selector: 'app-item-modify-texts-pop',
  templateUrl: './item-modify.component.html',
  styleUrls: ['./item-modify.component.scss']
})
export class ItemModifyTextsPopComponent implements OnInit,AfterViewInit {

  @Input() vo:TextsPopVO;
  @Input() posY:number=0;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onCancel:EventEmitter<TextsPopVO> = new EventEmitter<TextsPopVO>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSubmit:EventEmitter<TextsPopVO> = new EventEmitter<TextsPopVO>();



  public titleVO:TranslationVO = new TranslationVO('title','Modifizēt tulkojumu','Modify translation') ;
  public saveVO:TranslationVO = new TranslationVO('save','saglabāt','save') ;
  public cancelVO:TranslationVO = new TranslationVO('cancel','atcelt','cancel') ;


  @ViewChild('home_work', { read: ViewContainerRef, static: true }) home_work:ViewContainerRef;
  @ViewChild('indicator_type', { read: ViewContainerRef, static: true }) indicator_type:ViewContainerRef;
  @ViewChild('selected_territ', { read: ViewContainerRef, static: true }) selected_territ:ViewContainerRef;
  @ViewChild('indicator_selected', { read: ViewContainerRef, static: true }) indicator_selected:ViewContainerRef;
  @ViewChild('breakdown_selected', { read: ViewContainerRef, static: true }) breakdown_selected:ViewContainerRef;

  @ViewChild('request_type', { read: ViewContainerRef, static: true }) request_type:ViewContainerRef;
  @ViewChild('text_display_lv', { read: ViewContainerRef, static: true }) text_display_lv:ViewContainerRef;
  @ViewChild('text_display_en', { read: ViewContainerRef, static: true }) text_display_en:ViewContainerRef;
  @ViewChild('sql_string_from_join', { read: ViewContainerRef, static: true }) sql_string_from_join:ViewContainerRef;
  @ViewChild('sql_string_where', { read: ViewContainerRef, static: true }) sql_string_where:ViewContainerRef;

  @ViewChild('itemModify', { read: ViewContainerRef, static: true }) itemModify:ViewContainerRef;


  constructor() { }
  ngOnInit(): void {
    this.titleVO.lang='en';
    this.saveVO.lang='en';
    this.cancelVO.lang='en';
  }
  ngAfterViewInit():void {
    const element:HTMLElement = this.itemModify.element.nativeElement;
    element.style.top = this.posY+'px';
  }
  public onSaveClick=():void=>{
    const vo:TextsPopVO = this.vo.clone();
    vo.home_work = this.home_work.element.nativeElement.innerText;
    vo.indicator_type = this.indicator_type.element.nativeElement.innerText;
    vo.indicator_type = this.indicator_type.element.nativeElement.innerText;
    vo.selected_territ = this.selected_territ.element.nativeElement.innerText;
    vo.indicator_selected = this.indicator_selected.element.nativeElement.innerText;
    vo.breakdown_selected = this.breakdown_selected.element.nativeElement.innerText;

    vo.request_type = this.request_type.element.nativeElement.innerText;
    vo.text_display_lv = this.text_display_lv.element.nativeElement.innerText;
    vo.text_display_en = this.text_display_en.element.nativeElement.innerText;
    vo.sql_string_from_join = this.sql_string_from_join.element.nativeElement.innerText;
    vo.sql_string_where = this.sql_string_where.element.nativeElement.innerText;

    this.onSubmit.emit(vo);
  }
  public onCancelClick=():void=>{
    this.onCancel.emit(this.vo);
  }

}
