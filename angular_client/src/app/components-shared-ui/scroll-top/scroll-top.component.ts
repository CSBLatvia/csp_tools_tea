import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss']
})
export class ScrollTopComponent implements OnInit,AfterViewInit, OnDestroy {

  @Input() containerID:string = 'csbApp';
  @Input() footerID:string = 'app-footer';
  @Input() scroll:number=0;
  @Input() hasFooter:boolean=false;
  @ViewChild('scrollTop', { read: ViewContainerRef, static: true }) scrollTop:ViewContainerRef;

  private container:HTMLElement;
  private footer:HTMLElement;
  private request:any;
  private running:boolean = false;

  private observer:any;
  @Input() newY:number = -1;


  constructor() { }

  ngOnInit() {

  }
  ngAfterViewInit(): void {
    this.container = document.getElementById(this.containerID);
    this.footer = document.getElementById(this.footerID);

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        this.hasFooter = entry.intersectionRatio > 0;
      });
    });
    this.observer.observe(this.footer);
    this.startListener();
  }

  ngOnDestroy():void{
    this.stopListener();
    this.observer.unobserve(this.footer);
  }

  private startListener():void{
    if(this.running===true){return;}
    this.running = true;
    this.request = requestAnimationFrame(this.repeat);
  }
  private stopListener():void{
    if(this.running===false){return;}
    cancelAnimationFrame(this.request);
    this.running = false;
  }
  private repeat=():void=>{
    this.scroll = this.container.scrollTop;
    this.request = requestAnimationFrame(this.repeat);
  }
  public onTopClick=():void=>{
     this.container.scrollTop = 0;
     this.scroll = 0;
  }

}
