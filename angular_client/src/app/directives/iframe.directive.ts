import {Directive, Input} from '@angular/core';

@Directive({
  selector: '[iframeType]'
})
export class IframeDirective {

  @Input() type:string='';
  constructor() { }


}
