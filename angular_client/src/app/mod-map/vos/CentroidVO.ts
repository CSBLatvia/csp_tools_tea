export class CentroidVO{

  public code:string;
  public geoCoords:Array<any>=[];
  public pixelCoords:Array<number>=[];

  constructor(code:string,coords:Array<any>){
    this.code = code.substr(0,2)==='LV'?code:'LV'+code;
    this.geoCoords = coords; // 0-lon, 1-lat
  }

}
