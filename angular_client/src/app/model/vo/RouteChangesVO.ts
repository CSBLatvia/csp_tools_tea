export class RouteChangesVO{

  public isLangChanged:boolean;
  public isLangChangedOnly:boolean;
  public isLevelChanged:boolean;
  public isDatesChanged:boolean;
  public isDirectionChanged:boolean;
  public isViewChanged:boolean;
  public isVizChanged:boolean;
  public isSelectedChanged:boolean;
  public isResultsChanged:boolean;



    constructor(
      isLangChanged:boolean,
      isLangChangedOnly:boolean,
      isLevelChanged:boolean,
      isDatesChanged:boolean,
      isDirectionChanged:boolean,
      isViewChanged:boolean,
      isVizChanged:boolean,
      isSelectedChanged:boolean,
      isResultsChanged:boolean
){

      this.isLangChanged = isLangChanged;
      this.isLangChangedOnly = isLangChangedOnly;
      this.isLevelChanged = isLevelChanged;
      this.isDatesChanged = isDatesChanged;
      this.isDirectionChanged = isDirectionChanged;
      this.isViewChanged = isViewChanged;
      this.isVizChanged = isVizChanged ;
      this.isSelectedChanged  = isSelectedChanged;
      this.isResultsChanged  = isResultsChanged;
    }

}
