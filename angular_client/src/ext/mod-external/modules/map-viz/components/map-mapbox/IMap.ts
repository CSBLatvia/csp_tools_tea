export interface IMap {
  getMapPositionForPopUp(x:number,y:number):any;
  addPopUp(value:any):void;
  removePopUp(value:any):void;
}
