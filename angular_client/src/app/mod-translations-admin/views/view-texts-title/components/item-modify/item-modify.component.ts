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

import {TextsTitleVO} from '../../../../vos/TextsTitleVO';
import {TranslationVO} from "../../../../../model/vo/TranslationVO";



@Component({
  selector: 'app-item-modify-texts-title',
  templateUrl: './item-modify.component.html',
  styleUrls: ['./item-modify.component.scss']
})
export class ItemModifyTextsTitleComponent implements OnInit,AfterViewInit {

  @Input() vo:TextsTitleVO;
  @Input() posY:number=0;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onCancel:EventEmitter<TextsTitleVO> = new EventEmitter<TextsTitleVO>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSubmit:EventEmitter<TextsTitleVO> = new EventEmitter<TextsTitleVO>();



  public titleVO:TranslationVO = new TranslationVO('title','Modifizēt tulkojumu','Modify translation') ;
  public saveVO:TranslationVO = new TranslationVO('save','saglabāt','save') ;
  public cancelVO:TranslationVO = new TranslationVO('cancel','atcelt','cancel') ;

  @ViewChild('home_work', { read: ViewContainerRef, static: true }) home_work:ViewContainerRef;
  @ViewChild('indicator_type', { read: ViewContainerRef, static: true }) indicator_type:ViewContainerRef;
  @ViewChild('selected_territ', { read: ViewContainerRef, static: true }) selected_territ:ViewContainerRef;
  @ViewChild('indicator_selected', { read: ViewContainerRef, static: true }) indicator_selected:ViewContainerRef;
  @ViewChild('breakdown_selected', { read: ViewContainerRef, static: true }) breakdown_selected:ViewContainerRef;
  @ViewChild('meta_title_main_lv', { read: ViewContainerRef, static: true }) meta_title_main_lv:ViewContainerRef;
  @ViewChild('meta_title_main_en', { read: ViewContainerRef, static: true }) meta_title_main_en:ViewContainerRef;
  @ViewChild('map_title_lv', { read: ViewContainerRef, static: true }) map_title_lv:ViewContainerRef;
  @ViewChild('map_title_en', { read: ViewContainerRef, static: true }) map_title_en:ViewContainerRef;
  @ViewChild('table_title_lv', { read: ViewContainerRef, static: true }) table_title_lv:ViewContainerRef;
  @ViewChild('table_title_en', { read: ViewContainerRef, static: true }) table_title_en:ViewContainerRef;
  @ViewChild('legend_clusters_title_lv', { read: ViewContainerRef, static: true }) legend_clusters_title_lv:ViewContainerRef;
  @ViewChild('legend_clusters_title_en', { read: ViewContainerRef, static: true }) legend_clusters_title_en:ViewContainerRef;
  @ViewChild('legend_sizes_title_lv', { read: ViewContainerRef, static: true }) legend_sizes_title_lv:ViewContainerRef;
  @ViewChild('legend_sizes_title_en', { read: ViewContainerRef, static: true }) legend_sizes_title_en:ViewContainerRef;
  @ViewChild('legend_circles_title_lv', { read: ViewContainerRef, static: true }) legend_circles_title_lv:ViewContainerRef;
  @ViewChild('legend_circles_title_en', { read: ViewContainerRef, static: true }) legend_circles_title_en:ViewContainerRef;
  @ViewChild('table_col_1_title_lv', { read: ViewContainerRef, static: true }) table_col_1_title_lv:ViewContainerRef;
  @ViewChild('table_col_1_title_en', { read: ViewContainerRef, static: true }) table_col_1_title_en:ViewContainerRef;
  @ViewChild('table_col_2_title_lv', { read: ViewContainerRef, static: true }) table_col_2_title_lv:ViewContainerRef;
  @ViewChild('table_col_2_title_en', { read: ViewContainerRef, static: true }) table_col_2_title_en:ViewContainerRef;
  @ViewChild('table_col_3_title_lv', { read: ViewContainerRef, static: true }) table_col_3_title_lv:ViewContainerRef;
  @ViewChild('table_col_3_title_en', { read: ViewContainerRef, static: true }) table_col_3_title_en:ViewContainerRef;
  @ViewChild('legend_list_title_lv', { read: ViewContainerRef, static: true }) legend_list_title_lv:ViewContainerRef;
  @ViewChild('legend_list_title_en', { read: ViewContainerRef, static: true }) legend_list_title_en:ViewContainerRef;
  @ViewChild('meta_description_main_lv', { read: ViewContainerRef, static: true }) meta_description_main_lv:ViewContainerRef;
  @ViewChild('meta_description_main_en', { read: ViewContainerRef, static: true }) meta_description_main_en:ViewContainerRef;








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
    const vo:TextsTitleVO = this.vo.clone();
    vo.home_work = this.home_work.element.nativeElement.innerText;
    vo.indicator_type = this.indicator_type.element.nativeElement.innerText;
    vo.selected_territ = this.selected_territ.element.nativeElement.innerText;
    vo.indicator_selected = this.indicator_selected.element.nativeElement.innerText;
    vo.breakdown_selected = this.breakdown_selected.element.nativeElement.innerText;
    vo.meta_title_main_lv = this.meta_title_main_lv.element.nativeElement.innerText;
    vo.meta_title_main_en = this.meta_title_main_en.element.nativeElement.innerText;
    vo.map_title_lv = this.map_title_lv.element.nativeElement.innerText;
    vo.map_title_en = this.map_title_en.element.nativeElement.innerText;
    vo.table_title_lv = this.table_title_lv.element.nativeElement.innerText;
    vo.table_title_en = this.table_title_en.element.nativeElement.innerText;
    vo.legend_clusters_title_lv = this.legend_clusters_title_lv.element.nativeElement.innerText;
    vo.legend_clusters_title_en = this.legend_clusters_title_en.element.nativeElement.innerText;
    vo.legend_sizes_title_lv = this.legend_sizes_title_lv.element.nativeElement.innerText;
    vo.legend_sizes_title_en = this.legend_sizes_title_en.element.nativeElement.innerText;
    vo.legend_circles_title_lv = this.legend_circles_title_lv.element.nativeElement.innerText;
    vo.legend_circles_title_en = this.legend_circles_title_en.element.nativeElement.innerText;
    vo.table_col_1_title_lv = this.table_col_1_title_lv.element.nativeElement.innerText;
    vo.table_col_1_title_en = this.table_col_1_title_en.element.nativeElement.innerText;
    vo.table_col_2_title_lv = this.table_col_2_title_lv.element.nativeElement.innerText;
    vo.table_col_2_title_en = this.table_col_2_title_en.element.nativeElement.innerText;
    vo.table_col_3_title_lv = this.table_col_3_title_lv.element.nativeElement.innerText;
    vo.table_col_3_title_en = this.table_col_3_title_en.element.nativeElement.innerText;
    vo.legend_list_title_lv = this.legend_list_title_lv.element.nativeElement.innerText;
    vo.legend_list_title_en = this.legend_list_title_en.element.nativeElement.innerText;
    vo.meta_description_main_lv = this.meta_description_main_lv.element.nativeElement.innerText;
    vo.meta_description_main_en = this.meta_description_main_en.element.nativeElement.innerText;

    this.onSubmit.emit(vo);
  }
  public onCancelClick=():void=>{
    this.onCancel.emit(this.vo);
  }

}
