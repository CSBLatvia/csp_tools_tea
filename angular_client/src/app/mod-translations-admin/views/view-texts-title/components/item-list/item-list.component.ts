import {
  Component, EventEmitter,
  Input,
  OnInit, Output,
} from '@angular/core';

import {TextsPopVO} from '../../../../vos/TextsPopVO';
import {TextsTitleVO} from '../../../../vos/TextsTitleVO';
import {TranslationVO} from "../../../../../model/vo/TranslationVO";

@Component({
  selector: 'app-item-list-text-title',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})

export class ItemListTextTitleComponent implements OnInit {

  @Input() vo:TextsTitleVO;
  @Input() index:number=0;
  @Input() mode:string = 'admin'; // editor / admin;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onDelete:EventEmitter<TextsPopVO> = new EventEmitter<TextsPopVO>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onModify:EventEmitter<any> = new EventEmitter<any>();

  public editVO:TranslationVO = new TranslationVO('edit','rediģēt','modify') ;
  public deleteVO:TranslationVO = new TranslationVO('delete','dzēst','delete') ;

  constructor() { }
  ngOnInit(): void {
    this.editVO.lang='en';
    this.deleteVO.lang='en';
  }


  public onModifyClick=(vo:TextsTitleVO):void=>{
    const item:HTMLElement = document.getElementById('item-'+this.index);
    this.onModify.emit({vo:vo,y:item.offsetTop});
  }



}
