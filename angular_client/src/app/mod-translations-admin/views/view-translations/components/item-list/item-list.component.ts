import {
  Component, EventEmitter,
  Input,
  OnInit, Output,
} from '@angular/core';
import {TranslationVO} from "../../../../../model/vo/TranslationVO";


@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})

export class ItemListComponent implements OnInit {

  @Input() vo:TranslationVO;
  @Input() index:number=0;
  @Input() user:string = 'admin'; // editor / admin;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onDelete:EventEmitter<TranslationVO> = new EventEmitter<TranslationVO>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onModify:EventEmitter<any> = new EventEmitter<any>();

  public editVO:TranslationVO = new TranslationVO('edit','rediģēt','modify') ;
  public deleteVO:TranslationVO = new TranslationVO('delete','dzēst','delete') ;

  constructor() { }
  ngOnInit(): void {
    this.editVO.lang='en';
    this.deleteVO.lang='en';
  }

  public onModifyClick=():void=>{
    const item:HTMLElement = document.getElementById('item-'+this.index);
    const vo:TranslationVO = this.vo.clone();
    this.onModify.emit({vo:vo,y:item.offsetTop});
  }
  public onDeleteClick=():void=>{
    const vo:TranslationVO = this.vo.clone();
    this.onDelete.emit(vo);
  }



}
