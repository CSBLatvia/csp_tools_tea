export class ContentItemVO{

  public name:string;
  public value:number;
  public percentage:number;

  constructor(name:string,value:number,percentage:number) {
    this.name = name;
    this.value = value;
    this.percentage = percentage;
  }
}
