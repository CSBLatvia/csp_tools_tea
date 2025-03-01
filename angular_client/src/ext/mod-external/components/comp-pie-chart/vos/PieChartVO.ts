export class PieChartVO{
  public percentage:number = 0;
  public text:string='';
  constructor(text:string,percentage:number) {
    this.text = text;
    this.percentage = percentage;
  }
}
