import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class TableListComponent implements OnInit {

  /*TODO  - must continue here .. */
  @Input() tables:Array<string> = ['translations','texts_pop','texts_title'];
  @Input() id:number = 0;
  public value:string;
  public menuOpen:boolean = false;


  @Output() onTableChose:EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
    this.value = this.tables[this.id];
    this.onTableChose.emit(this.id);
  }
  public onMenuClick=():void=>{
    this.menuOpen = !this.menuOpen;
  }
  public onItemClick=(id:number):void=>{
    this.id = id;
    this.value = this.tables[this.id];
    this.menuOpen = false;
    this.onTableChose.emit(this.id);
  }

}
