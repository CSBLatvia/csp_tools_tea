import {AfterViewInit, Directive, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[trapFocus]'
})
export class TrapFocusDirective implements AfterViewInit,OnChanges {
  @Input() trapFocusItems:Array<any> = [];
  @Input() trapFocusIf:boolean = false;

  constructor(private element: ElementRef) { }

  ngAfterViewInit() {}

  public trapFocus=(element):void=> {

    const focusableElements = element.querySelectorAll(this.trapFocusItems.join(','))
    const allItems = Array.from(focusableElements)
      .filter( (el: any) => !el.disabled);

    const focusableItemFirst: any = allItems[0];
    const focusableItemLast: any = allItems[allItems.length - 1];
    element.addEventListener('keydown', (e)=>{
      var isTabPressed = e.keyCode === 9; // isTabPressed
      if (!isTabPressed) return;
      if(!this.trapFocusIf){return;}

      if ( e.shiftKey ) /* shift + tab */ {
        if (document.activeElement === focusableItemFirst) {
          focusableItemLast.focus();
          e.preventDefault();
        }
      } else /* tab */ {
        if (document.activeElement === focusableItemLast) {
          focusableItemFirst.focus();
          e.preventDefault();
        }
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes['trapFocusIf']){
      if(this.trapFocusIf==false){return;}
        this.trapFocus(this.element.nativeElement);
    }
  }
}
