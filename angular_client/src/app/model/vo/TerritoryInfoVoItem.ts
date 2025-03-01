export class TerritoryInfoVoItem{

  public variable:string;
  public name:string;
  public value:number;
  public valueSTR:string;

  constructor(variable:string,name:string,value:number=-1) {
    this.variable = variable;
    this.name = name;
    this.value = value;
    this.valueSTR = value!==-1?this.value.toString():'';
  }

}
