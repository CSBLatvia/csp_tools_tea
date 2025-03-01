import {
  Component,
  EventEmitter, HostListener,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ControlValueVO} from '../vos/ControlValueVO';
import {TranslationVO} from '../../model/vo/TranslationVO';
import {NgScrollbar} from 'ngx-scrollbar';



@Component({
  selector: 'app-ui-control-dropdown',
  templateUrl: './ui-control-dropdown.component.html',
  styleUrls: ['./ui-control-dropdown.component.scss']
})
export class UiControlDropdownComponent implements OnInit,OnChanges {


  @Input() searchable:boolean = false;
  @Input() control_id:string;
  @Input() loading:boolean = false;
  @Input() empty:boolean = true;
  @Input() disabled:boolean = false;

  @Input() searchTitle:TranslationVO;
  @Input() label:TranslationVO;
  @Input() lang:string;
  @Input() values:Array<ControlValueVO>=[];
  @Input() itemSize:number=40;
  @Input() itemsMinCount:number=2;
  @Input() itemsMaxCount:number=3;
  private values_old:Array<ControlValueVO>=[];
  private values_ids:Array<string>=[];
  @Input() id:string='';

  @Input() defaultName:TranslationVO = null;
  public value:ControlValueVO;
  public index:number = 0;

  @Input() open:boolean = false;

  private interval:number=-1;
  private sizeChangeInterval:number;
  private inputHasFocus:boolean = false;
  public calculatedWidth:number=0;
  public x:number=0;
  public y:number=0;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange:EventEmitter<ControlValueVO> = new EventEmitter<ControlValueVO>();

  @ViewChild('containerRef', { read: ViewContainerRef, static: true }) containerRef:ViewContainerRef;
  @ViewChild('inputTitleRef', { read: ViewContainerRef, static: true }) inputTitleRef:ViewContainerRef;
  @ViewChild('inputSearchRef', { read: ViewContainerRef, static: true }) inputSearchRef:ViewContainerRef;
  @ViewChild(NgScrollbar, { static: true }) scroller: NgScrollbar;

  private container:HTMLElement;
  private input:HTMLElement;
  private inputSearch:HTMLInputElement;
  private searchSTR:string='';

  public inputNavigIndex:number = 0;


  constructor() {}

  ngOnInit() {
    this.input = this.inputTitleRef.element.nativeElement as HTMLElement;
    this.inputSearch = this.inputSearchRef.element.nativeElement as HTMLInputElement;
    this.container = this.containerRef.element.nativeElement as HTMLElement;
    this.interval = <any>setInterval(this.checkIfValuesReady,50);
  }

  ngOnChanges(changes:SimpleChanges): void {
    this.updateDirty();
    this.values.forEach((item:ControlValueVO)=>{
        item.name.lang = this.lang;
    });
   if(this.value){
        this.value.name.lang = this.lang;
   }
   if(this.searchTitle){
     this.searchTitle.lang = this.lang;
   }


  }
  private resetSearchValue():void{
    if(this.searchable===false){return;}
    this.searchSTR = '';
    this.inputSearch.value = this.searchTitle.name;
    this.inputNavigIndex = 0;
  }
  public onSearchClick=():void=>{
    if(this.searchSTR ===''){
      this.inputSearch.value = '';
    }
  }
  private updateDirty():void{
    this.empty = this.values.length===0;
    let i:number=0;
    const L:number = this.values.length;
    this.values_ids = [];
    while(i<L){
      this.values[i].name.lang = this.lang;
      this.values_ids.push(this.values[i].id);
      i++;
    }
    //////////// id ////////////////
    const index:number = this.id==='none'?0:this.values_ids.indexOf(this.id);
    if(index!==-1){
      this.value = this.values[index];
    }else{
      this.value = this.values[0];
    }
    this.searchSTR = '';
    this.inputNavigIndex=0;
  }

  private checkIfValuesReady=():void=>{
    if(this.values && this.values.length>0){
      clearInterval(this.interval);
      this.initialize();
    }
  }

  private initialize(){
      this.index = 0;
      for(let i=0;i<this.values.length;i++){
        this.values[i].name.lang = this.lang;
        if(this.values[i].id===this.id && this.id!==''){
          this.index = i;
        }
      }
      this.value = this.values[this.index];
  }

  private navigate(dir:number):void{
    if(dir===1){
      if(this.inputNavigIndex===this.values.length-1){
        this.inputNavigIndex = 0;
      }else {
        this.inputNavigIndex++;
      }
    }else if (dir===-1){
      if(this.inputNavigIndex<=0){
        this.inputNavigIndex = this.values.length-1;
      }else {
        this.inputNavigIndex--;
      }
    }
    ///////////////////////////
    this.scroller.scrollTo({ top: this.inputNavigIndex*this.itemSize });
  }
  public onListMouseOver=(i:number):void=>{
    this.inputNavigIndex = i;
  }
  public onListMouseOut=(i:number):void=>{
    this.inputNavigIndex = -1;
  }
  private setCaretPosition(elem:HTMLInputElement):void {
     if(elem.selectionStart) {
       elem.focus();
       elem.setSelectionRange(elem.value.length, elem.value.length);
     }
  }
  public onKeyDownCheckArrows(e:any):void{
    if(e.key === 'ArrowDown'){
      e.preventDefault();
      this.navigate(1);
      this.setCaretPosition(this.inputSearch);
      return;
    }
    if(e.key === 'ArrowUp' ){
      e.preventDefault();
      this.navigate(-1);
      this.setCaretPosition(this.inputSearch);
      return;
    }
  }
  public onSearchChange=(e:any):void=>{
    if(e.key === 'ArrowDown' || e.key === 'ArrowUp' ){
      return;
    }
    if(e.key === 'Enter'){
      this.value = this.values[this.inputNavigIndex];
      this.index = this.values_ids.indexOf(this.value.id);
      this.closeDropDown(true);
      return;
    }
    this.searchSTR = this.inputSearch.value;
    this.filterResults();
    this.inputNavigIndex = 0;
  }
  private filterResults():void{
    let index:number = 0;
    let str:string;
    const searchNormalized:string = this.searchSTR.toLowerCase().normalize('NFKD').replace(/[^\w\s.-_\/]/g, '');

    const arr:Array<ControlValueVO>=[];
    this.values_old.forEach((item:ControlValueVO)=>{
      str = item.name.name.toLowerCase().normalize('NFKD').replace(/[^\w\s.-_\/]/g, '');
      index = str.indexOf(searchNormalized);
      if(index===0){
        arr.push(item);
      }
    });
    this.values = arr; this.inputNavigIndex = 0;
  }
  public onListItemClick=(index:number):void=>{
    this.index = index;
    this.value = this.values[this.index];
    this.closeDropDown(true);
  }
  public onInputClick=():void=>{
    this.open===false?this.openDropDown():this.closeDropDown();
  }
  public onArrowClick=():void=>{
    this.open===false?this.openDropDown():this.closeDropDown();
  }
  public onInputFocus=(value:boolean):void=>{
    this.inputHasFocus = value;
  }

  private openDropDown():void{
    this.values_old = [...this.values];
    this.resetSearchValue();
    this.open = true;
    this.calculatedWidth = this.input.offsetWidth;

    this.x = this.container.getBoundingClientRect().left;
    this.y = this.container.getBoundingClientRect().top;

    this.sizeChangeInterval = <any>setInterval(this.checkPositionChange,50);
    this.scroller.scrollTo({ top: 0 });
  }
  private closeDropDown(emit:boolean = false):void{
    this.values = [...this.values_old];
    this.resetSearchValue();
    this.open = false;
    this.scroller.scrollTo({ top: 0 });
    clearInterval(this.sizeChangeInterval);
    if(emit===true){
      this.onChange.emit(this.value);
    }
  }

    /*
    TODO - not sure about this - probably must remove this check.
    */
  private checkPositionChange=():void=>{
    /*
    if(this.container.getBoundingClientRect().top!==this.y){
      this.closeDropDown();
    }
    */
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event:any): void {
    const element:HTMLElement =  event.target as HTMLElement;
    const insideClick:boolean = this.containerRef.element.nativeElement.contains(element);
    if (this.open===true && insideClick===false) {
      this.closeDropDown();
    }
  }

}
