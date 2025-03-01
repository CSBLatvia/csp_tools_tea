import {Component, Input, OnInit} from '@angular/core';
import {TableServiceTranslations} from '../../services/table.service';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit {

  @Input() filter:number = -1;  // -1, 0, 1
  @Input() service:TableServiceTranslations;

  constructor() { }

  ngOnInit(): void {
  }
  public onFilterChangeUsed=(value:number):void=>{
    this.filter = value;
    this.service.filter = value;
    this.service.filterItems();
  }
}
