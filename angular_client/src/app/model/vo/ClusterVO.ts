export class ClusterVO {

  private _borderOne:number;
  private _borderTwo:number;
  private _precision:number;

  public bordersEqual:boolean;
  public index:number=-1;
  public color:string;


  constructor(borderOne:number,borderTwo:number,index:number,color:string,precision:number=2) {
    this._borderOne = borderOne;
    this._borderTwo = borderTwo;
    this.bordersEqual = this._borderOne===this._borderTwo;
    this.index = index;
    this.color = color;
    this._precision = precision;
  }

  public get borderOne():string{
    return this._precision!==0?this._borderOne.toFixed(this._precision):parseInt(this._borderOne+'')+'';
  }
  public get borderTwo():string{
    return this._precision!==0?this._borderTwo.toFixed(this._precision):parseInt(this._borderTwo+'')+'';
  }
  public hasValueInside(value:number):boolean{
    if(value>=this._borderOne && value<=this._borderTwo){
      return true;
    }
    return false;
  }
}
