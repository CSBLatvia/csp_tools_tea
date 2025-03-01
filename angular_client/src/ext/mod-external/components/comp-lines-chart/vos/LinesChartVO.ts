export class LinesChartVO {

  public name:string;
  public series:Array<any>;
  public categories:Array<any>;

  constructor(name:string,series:Array<any>,categories:Array<any>) {
    this.name = name;
    this.series = series;
    this.categories = categories;
  }
}
