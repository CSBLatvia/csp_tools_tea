import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy,
  OnInit, Output, SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import mapboxgl from 'mapbox-gl';
import {PopSimpleVO} from '../pop-ups/vos/PopSimpleVO';
import {MapLegendPopComponent} from "../map-legend-pop/map-legend-pop.component";
import {MapLayersPopComponent} from "../map-layers-pop/map-layers-pop.component";
import {BackgroundDataVO} from "../../vos/BackgroundDataVO";
import {CentroidVO} from "../../vos/CentroidVO";
import {MapVizService} from "../../../../services/map-viz.service";
import {ConfigMapColors} from "../../../../../model/configs/ConfigMapColors";
import {DomElementsInfo} from "../../../../../../app/model/vo/DomElementsInfo";
import {RouteVO} from "../../../../../../app/model/vo/RouteVO";
import { TranslationVO } from 'src/app/model/vo/TranslationVO';
import {IModel} from "../../../../../../app/model/IModel";
import {LoggerService} from "../../../../../../app/model/log/logger.service";



@Component({
  selector: 'app-mapbox',
  templateUrl: './map-mapbox.component.html',
  styleUrls: ['./map-mapbox.component.scss']
})

export class MapMapBoxComponent implements OnInit,OnDestroy,OnChanges {

  @ViewChild('mapRef', { read: ViewContainerRef, static: true }) mapRef:ViewContainerRef;
  @ViewChild('popContainer', { read: ViewContainerRef, static: true }) popContainer:ViewContainerRef;
  @ViewChild('legendContainer', { read: ViewContainerRef, static: true }) legendContainer:ViewContainerRef;
  @ViewChild('layersContainer', { read: ViewContainerRef, static: true }) layersContainer:ViewContainerRef;
  @ViewChild('loaderContainer', { read: ViewContainerRef, static: true }) loaderContainer:ViewContainerRef;
  //////////////////////

  public backgroundLight:boolean = true;
  public mapLayerStyleID:string;

  @Input() visible:boolean;
  @Input() model:IModel;
  @Input() route:RouteVO;
  @Input() initialized:boolean = false;
  @Input() fullscreen:boolean;
  @Output() onFullscreenChange:EventEmitter<boolean> = new EventEmitter<boolean>();

  public mobile:boolean=false;
  public legendIsVisible:boolean = false;
  public titleVO:TranslationVO;
  //////////////////////////////////

  @Input() isEmpty:boolean = false;
  @Input() data:Array<any> = [];

  private configMapColors:ConfigMapColors;



  private appContainer:HTMLElement;
  private mapContainer:HTMLElement;
  private mapArea:HTMLElement;
  public map:mapboxgl.Map;
  private TOKEN:string = 'pk.eyJ1IjoibXVpem5pZWtzbWFwYm94MSIsImEiOiJja3R5Y254eXMxa3J1Mm9xdHE1ZWlkNXd2In0.xOef5lCtOrtQoHdm0xlytw';
  private mapCanvasElement:HTMLElement;
  /////////////////////////////
  private mapBounds:any = [[20.96211, 55.67468], [28.24150, 58.08557]];
  /////////////////////////////

  private MIN_ZOOM:number=0;
  private MAX_ZOOM:number=12;
  private CURRENT_ZOOM:number=-1;

  public ZOOM_IN_ENABLED:boolean=true;
  public ZOOM_OUT_ENABLED:boolean=false;
  public LAYERS_ENABLED:boolean=false;
  private PADDING:number = 40;

  /////////////////////////////

  private popLegendFactory:ComponentFactory<MapLegendPopComponent>;
  private popLayersFactory:ComponentFactory<MapLayersPopComponent>;

  private popLegendRef:ComponentRef<MapLegendPopComponent>;
  private popLayersRef:ComponentRef<MapLayersPopComponent>;
  ////////////////////////////

  private tileStyle:any;

  ////////////////////////
  public mouseIsDown:boolean = false;
  private mapClickCoords:any=null;
  //////////////////////////////////
  public layersOpen:boolean = false;
  //////////////////////////////////
  public mapCopyRightsVO:TranslationVO;
  //////////////////////////////////

  private request:any;
  private running:boolean = false;
  //////////////////////////////////
  public dataIsNotComplete:boolean = false;
  public DPI:number;


  ///////////////////////////////////
  public READY:boolean = false;
  private onServiceReadyListener:any;
  private onTitlesUpdateListener:any;
  private onDomUpdateListener:any;
  private onServicePickingListener:any;
  ///////////////////////////////////
  public ww:number=0;
  public hh:number=0;
  ///////////////////////////////////
  // STATES
  ///////////////////////////////////
  private mapIsInitialized:boolean = false;
  private mapStyleLoaded:boolean = false;
  private mapSourceLoaded:boolean = false;
  private mapLoaded:boolean = false;

  constructor(public service:MapVizService, private resolver: ComponentFactoryResolver, public dom:DomElementsInfo, private logger:LoggerService) {
    this.DPI = this.dom.dpi;
    this.legendIsVisible = this.dom.legendIsVisible;
    this.mobile = this.dom.isMobile;
    this.service.model = this.model;
    this.logger.enabled = true;
  }
  ngOnDestroy(){
    if(this.map){
      this.map.off('load', this.mapOnLoad);
      this.map.off('render', this.mapOnRender);
      this.map.off('dblclick', this.mapOnDoubleClick);
      this.map.off('mousemove', this.mapOnMouseMove);
      this.map.off('mouseenter', 'mapbox', this.layerOnMouseOver);
      this.map.off('mouseleave', 'mapbox', this.layerOnMouseOut);
      this.map.off('click', this.mapOnClick);
      this.map.off('mouseleave', this.mapOnMouseOut);
      this.map.off('mousedown', this.mapOnMouseDown);
      this.map.off('mouseup', this.mapOnMouseUp);
      this.map.off('wheel', this.mapOnWheel);
      this.map.off('zoomend', this.mapOnZoomEnd);
      this.map.off('zoom', this.mapOnZoom);
      this.map.off('movestart', this.mapOnMoveStart);
      this.map.off('moveend', this.mapOnMoveEnd);
      this.map.off('move', this.mapOnMove);
      this.map.off('sourcedata', this.mapOnSourceData);

      window.removeEventListener('scroll', this.onWindowScroll);
      this.map = null;
    }
    this.onServiceReadyListener.unsubscribe();
    this.onDomUpdateListener.unsubscribe();
    this.onTitlesUpdateListener.unsubscribe();
    this.mapRef.clear();
  }
  ngOnInit() {
    //console.log('MapMapBoxComponent - ngOnInit');
    this.mapRef.clear();
    this.appContainer = document.getElementById('csbApp') as HTMLElement;
    this.mapContainer = document.getElementById('mapContainer') as HTMLElement;
    this.mapArea = document.getElementById('map-area') as HTMLElement;
    this.resizeContainer();

    this.onServiceReadyListener = this.service.onServiceReady.subscribe(this.onServiceReady);
    this.onServicePickingListener = this.service.popService.onPickingDataRequestAnswer.subscribe(this.onPickingDataRequestAnswer);

    this.onDomUpdateListener = this.dom.onUpdate.subscribe(this.onDomElementsUpdate);
    this.onTitlesUpdateListener = this.service.titlesService.onServiceChange.subscribe(this.onTitlesUpdate);


    this.popLegendFactory = this.resolver.resolveComponentFactory(MapLegendPopComponent);
    this.popLayersFactory = this.resolver.resolveComponentFactory(MapLayersPopComponent);

    this.popLegendRef = this.legendContainer.createComponent(this.popLegendFactory);
    this.popLegendRef.instance.mobile = this.mobile;
    this.popLegendRef.instance.lang = 'lv';
    this.popLegendRef.instance.onClose = this.onCloseLegend;

    this.popLayersRef = this.layersContainer.createComponent(this.popLayersFactory);
    this.popLayersRef.instance.mobile = this.mobile;
    this.popLayersRef.instance.lang = 'lv';
    this.popLayersRef.instance.radio_id = this.service.MAP_POP_STYLE;
    this.popLayersRef.instance.onClose = this.onCloseLayers;
    this.popLayersRef.instance.onChange = this.onLayersChange;

    this.configMapColors = this.service.model.config.mapColors;

    this.checkLoading();
    this.updateLocalizations();
  }

  ngOnChanges(changes:SimpleChanges): void {


    if(changes['visible']){

      this.resizeContainer();

      setTimeout(() => {
        this.resizeContainer();
      }, 5);
    }
    if(changes['mobile'] ){
      if(this.popLegendRef){
        this.popLegendRef.instance.mobile = this.mobile;
        this.popLegendRef.instance.visible = this.legendIsVisible;
      }
      if(this.popLayersRef){
        this.popLayersRef.instance.mobile = this.mobile;
        this.popLayersRef.instance.visible = this.layersOpen;
      }
      this.resizeContainer();
    }
    if(changes['pop']){    }
    if(changes['legendIsVisible'] && this.popLegendRef!==undefined){
      this.popLegendRef.instance.visible = this.legendIsVisible;
    }
    if(changes['layersOpen'] && this.popLayersRef!==undefined){
      this.popLayersRef.instance.visible = this.layersOpen;
    }
    if(changes['fullscreen']){
      this.resizeContainer();
    }
    if(changes['model']){
      this.service.model = this.model;
    }
    if(changes['route']){
      this.onRouteChanges();
    }

  }

  private onRouteChanges=():void=>{
      this.READY = false;
      this.service.update(this.route);
  }
  private onServiceReady=():void=>{
    this.logger.log('MAP-BOX - onServiceReady');
    this.READY = true;
    this.redrawMap();
  }


  private updateLocalizations():void{
    if(this.initialized===false){return;}
    this.mapCopyRightsVO.lang = this.route.lang;
  }

  private redrawMap():void{

    if(this.mapIsInitialized===true) {
      this.mapStyleLoaded = false; this.checkLoading();
      this.generateMapStyle();
      this.map.setStyle(this.tileStyle);
      this.mapStyleLoaded = true; this.checkLoading();
      this.resizeContainer();
    }else if(this.mapIsInitialized===false){
      this.initializeMap();this.checkLoading();
    }
  }

  private destroyMap():void{
    if(this.map){
      this.map.off('load', this.mapOnLoad);
      this.map.off('render', this.mapOnRender);
      this.map.off('dblclick', this.mapOnDoubleClick);
      this.map.off('mousemove', this.mapOnMouseMove);
      this.map.off('mouseenter', 'mapbox', this.layerOnMouseOver);
      this.map.off('mouseleave', 'mapbox', this.layerOnMouseOut);
      this.map.off('click', this.mapOnClick);
      this.map.off('mouseleave', this.mapOnMouseOut);
      this.map.off('mousedown', this.mapOnMouseDown);
      this.map.off('mouseup', this.mapOnMouseUp);
      this.map.off('wheel', this.mapOnWheel);
      this.map.off('zoomend', this.mapOnZoomEnd);
      this.map.off('zoom', this.mapOnZoom);
      this.map.off('movestart', this.mapOnMoveStart);
      this.map.off('moveend', this.mapOnMoveEnd);
      this.map.off('move', this.mapOnMove);
      this.map.off('sourcedata', this.mapOnSourceData);

      window.removeEventListener('scroll', this.onWindowScroll);
      this.map = null;
      this.mapRef.clear();
      this.mapIsInitialized = false;
      this.mapStyleLoaded = false;
    }


  }
  private generateMapStyle():void{
    this.mapLayerStyleID = this.service.MAP_POP_STYLE;
    this.mapCopyRightsVO = this.model.translations.item(this.service.MAP_POP_STYLE+'-copyrights');
    this.mapCopyRightsVO.lang = this.route.lang;

    this.configMapColors = this.service.model.config.mapColors;

    const URL:string = this.service.model.config.geoServerTilesURL;
    let tileURL:string;
    let layerID:string;

    switch (this.route.T1) {
      case '1':
        layerID = this.service.model.config.mapBoxLayer_1;
        break;
      case '3':
        layerID = this.service.model.config.mapBoxLayer_3;
        break;
      case '4':
        layerID = this.service.model.config.mapBoxLayer_4;
        break;
      case '7':
        layerID = this.service.model.config.mapBoxLayer_7;
        break;
    }
    tileURL = URL.replace('[layer]',layerID);


  /*
      'map-light-rupucs',
      'map-dark-rupucs',
      'map-light',
      'map-dark',
      'map-osm',
      'map-orto'
  */

    if(this.service.MAP_POP_STYLE === 'map-light'){
      this.tileStyle = {
        'version': 8,
        'sources': {
          'mapbox': {
            'type': 'vector',
            'tiles': [tileURL],
            'minZoom': this.MIN_ZOOM,
            'maxZoom': this.MAX_ZOOM
          }
        },
        'layers': [
          {
            'id': 'mapbox',
            'type': 'fill',
            'source': 'mapbox',
            'source-layer': layerID,
            'filter': ['==', '$type', 'Polygon'],
            'paint': {
              'fill-color': this.colorizePolygons(),
              'fill-outline-color':this.configMapColors.borderColor(this.route.M1),
              'fill-opacity': 1
            }
          }
        ]
      };
    }else if(this.service.MAP_POP_STYLE ==='map-dark'){
      this.tileStyle = {
        'version': 8,
        'sources': {
          'mapbox': {
            'type': 'vector',
            'tiles': [tileURL],
            'minZoom': this.MIN_ZOOM,
            'maxZoom': this.MAX_ZOOM
          }
        },
        'layers': [
          {
            'id': 'mapbox',
            'type': 'fill',
            'source': 'mapbox',
            'source-layer': layerID,
            'filter': ['==', '$type', 'Polygon'],
            'paint': {
              'fill-color': this.colorizePolygons(),
              'fill-outline-color':this.configMapColors.borderColor(this.route.M1),
              'fill-opacity': 1
            }
          }
        ]
      };
    }else if(this.service.MAP_POP_STYLE === 'map-osm'){
      this.tileStyle = {
        'version': 8,
        'sources': {
          'mapbox': {
            'type': 'vector',
            'tiles': [tileURL],
            'minZoom': this.MIN_ZOOM,
            'maxZoom': this.MAX_ZOOM
          },
          'raster_bg': {
            'type': 'raster',
            'tiles': [this.service.model.config.osmTilesURL],
            'tileSize': 128
          }
        },
        'layers': [
          {
            'id': 'raster_bg',
            'type': 'raster',
            'source': 'raster_bg',
            'minZoom': this.MIN_ZOOM,
            'maxZoom': this.MAX_ZOOM
          },
          {
            'id': 'mapbox',
            'type': 'fill',
            'source': 'mapbox',
            'source-layer': layerID,
            'filter': ['==', '$type', 'Polygon'],
            'paint': {
              'fill-color': this.colorizePolygons(),
              'fill-outline-color':this.configMapColors.borderColor(this.route.M1),
              'fill-opacity': 1
            }
          }
        ]
      };
    }else if(this.service.MAP_POP_STYLE === 'map-orto'){
      this.tileStyle = {
        'version': 8,
        'sources': {
          'mapbox': {
            'type': 'vector',
            'tiles': [tileURL],
            'minZoom': this.MIN_ZOOM,
            'maxZoom': this.MAX_ZOOM
          },
          'raster_bg': {
            'type': 'raster',
            'tiles': [this.service.model.config.ortoTilesURL],
            'tileSize': 128
          }
        },
        'layers': [
          {
            'id': 'raster_bg',
            'type': 'raster',
            'source': 'raster_bg',
            'minZoom': this.MIN_ZOOM,
            'maxZoom': this.MAX_ZOOM
          },
          {
            'id': 'mapbox',
            'type': 'fill',
            'source': 'mapbox',
            'source-layer': layerID,
            'filter': ['==', '$type', 'Polygon'],
            'paint': {
              'fill-color': this.colorizePolygons(),
              'fill-outline-color':this.configMapColors.borderColor(this.route.M1),
              'fill-opacity': 1
            }
          }
        ]
      };
    }else if(this.service.MAP_POP_STYLE === 'map-light-rupucs'){
      const textColor:string = '#8c8c8c';
      const textHaloColor:string = 'rgba(255,255,255,1)';
      this.tileStyle = {
        'version': 8,
        'sources': {
          "openmaptiles": {
            "type": "vector",
            "tiles": ["https://geo.rupucs.in/api/tiles/planet/{z}/{x}/{y}"],
            "minZoom": 0,
            "maxZoom": 22
          },
          'mapbox': {
            'type': 'vector',
            'tiles': [tileURL],
            'minZoom': this.MIN_ZOOM,
            'maxZoom': this.MAX_ZOOM
          }
        },
        'sprite': 'https://openmaptiles.github.io/dark-matter-gl-style/sprite',
        'glyphs': 'https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=0g05zGjMGsi8gLPQK5ZH',
        'layers': [
          {
            "id": "background",
            "type": "background",
            "paint": {"background-color": "#ffffff"}
          },
          {
            "id": "landuse-residential",
            "type": "fill",
            "source": "openmaptiles",
            "source-layer": "landuse",
            "filter": [
              "all",
              ["==", "$type", "Polygon"],
              ["in", "class", "residential", "suburb", "neighbourhood"]
            ],
            "layout": {"visibility": "visible"},
            "paint": {"fill-color": "rgba(0,0,0,0.05)", "fill-opacity": 1}
          },
          {
            "id": "landcover_grass",
            "type": "fill",
            "source": "openmaptiles",
            "source-layer": "landcover",
            "filter": ["==", "class", "grass"],
            "paint": {"fill-opacity": 1, "fill-color": "rgba(0,0,0,0.05)"}
          },
          {
            "id": "landcover_wood",
            "type": "fill",
            "source": "openmaptiles",
            "source-layer": "landcover",
            "minzoom": 8,
            "filter": ["all", ["==", "$type", "Polygon"], ["==", "class", "wood"]],
            "layout": {"visibility": "visible"},
            "paint": {
              "fill-color": "rgba(0, 0, 0, 0.05)",
              "fill-opacity": {"base": 0.3, "stops": [[8, 0.2], [10, 0.4], [13, 0.2]]},
              "fill-translate": [0, 0]
            }
          },
          {
            "id": "water",
            "type": "fill",
            "source": "openmaptiles",
            "source-layer": "water",
            "filter": [
              "all",
              ["==", "$type", "Polygon"],
              ["!=", "intermittent", 1],
              ["!=", "brunnel", "tunnel"]
            ],
            "layout": {"visibility": "visible"},
            "paint": {"fill-color": "#bfdbfa"}
          },
          {
            "id": "landcover_sand",
            "type": "fill",
            "metadata": {},
            "source": "openmaptiles",
            "source-layer": "landcover",
            "filter": ["all", ["in", "class", "sand"]],
            "layout": {"visibility": "visible"},
            "paint": {
              "fill-antialias": false,
              "fill-color": "rgba(0,0,0,0.05)",
              "fill-opacity": 0.3
            }
          },
          {
            "id": "landuse",
            "type": "fill",
            "source": "openmaptiles",
            "source-layer": "landuse",
            "filter": ["==", "class", "agriculture"],
            "layout": {"visibility": "visible"},
            "paint": {"fill-color": "#eae0d0"}
          },
          {
            "id": "landuse_overlay_national_park",
            "type": "fill",
            "source": "openmaptiles",
            "source-layer": "landcover",
            "filter": ["==", "class", "national_park"],
            "paint": {
              "fill-color": "#E1EBB0",
              "fill-opacity": {"base": 1, "stops": [[5, 0], [9, 0.75]]}
            }
          },
          {
            "id": "waterway-tunnel",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "waterway",
            "filter": [
              "all",
              ["==", "$type", "LineString"],
              ["==", "brunnel", "tunnel"]
            ],
            "layout": {"visibility": "visible"},
            "paint": {
              "line-color": "hsl(205, 56%, 73%)",
              "line-dasharray": [3, 3],
              "line-gap-width": {"stops": [[12, 0], [20, 6]]},
              "line-opacity": 1,
              "line-width": {"base": 1.4, "stops": [[8, 1], [20, 2]]}
            }
          },
          {
            "id": "waterway",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "waterway",
            "filter": [
              "all",
              ["==", "$type", "LineString"],
              ["!in", "brunnel", "tunnel", "bridge"],
              ["!=", "intermittent", 1]
            ],
            "layout": {"visibility": "none"},
            "paint": {
              "line-color": "hsl(205, 56%, 73%)",
              "line-opacity": 1,
              "line-width": {"base": 1.4, "stops": [[8, 1], [20, 8]]}
            }
          },
          {
            "id": "waterway_intermittent",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "waterway",
            "filter": [
              "all",
              ["==", "$type", "LineString"],
              ["!in", "brunnel", "tunnel", "bridge"],
              ["==", "intermittent", 1]
            ],
            "layout": {"visibility": "visible"},
            "paint": {
              "line-color": "hsl(205, 56%, 73%)",
              "line-dasharray": [2, 1],
              "line-opacity": 1,
              "line-width": {"base": 1.4, "stops": [[8, 1], [20, 8]]}
            }
          },
          {
            "id": "tunnel_railway_transit",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "transportation",
            "minzoom": 0,
            "filter": [
              "all",
              ["==", "$type", "LineString"],
              ["==", "brunnel", "tunnel"],
              ["==", "class", "transit"]
            ],
            "layout": {"line-cap": "butt", "line-join": "miter"},
            "paint": {
              "line-color": "hsl(34, 12%, 66%)",
              "line-dasharray": [3, 3],
              "line-opacity": {"base": 1, "stops": [[11, 0], [16, 1]]}
            }
          },
          {
            "id": "building",
            "type": "fill",
            "source": "openmaptiles",
            "source-layer": "building",
            "paint": {
              "fill-antialias": true,
              "fill-color": "rgba(0,0,0,0.04)",
              "fill-opacity": {"base": 1, "stops": [[13, 0], [15, 1]]},
              "fill-outline-color": {
                "stops": [[15, "rgba(0,0,0,0.05)"], [16, "rgba(0,0,0,0.05)"]]
              }
            }
          },
          {
            "id": "road_area_pier",
            "type": "fill",
            "metadata": {},
            "source": "openmaptiles",
            "source-layer": "transportation",
            "filter": ["all", ["==", "$type", "Polygon"], ["==", "class", "pier"]],
            "layout": {"visibility": "visible"},
            "paint": {"fill-antialias": true, "fill-color": "hsl(47, 26%, 88%)"}
          },
          {
            "id": "road_pier",
            "type": "line",
            "metadata": {},
            "source": "openmaptiles",
            "source-layer": "transportation",
            "filter": ["all", ["==", "$type", "LineString"], ["in", "class", "pier"]],
            "layout": {"line-cap": "round", "line-join": "round"},
            "paint": {
              "line-color": "#81b9e4",
              "line-width": {"base": 1.2, "stops": [[15, 1], [17, 4]]}
            }
          },
          {
            "id": "road_bridge_area",
            "type": "fill",
            "source": "openmaptiles",
            "source-layer": "transportation",
            "filter": [
              "all",
              ["==", "$type", "Polygon"],
              ["in", "brunnel", "bridge"]
            ],
            "layout": {},
            "paint": {"fill-color": "#81b9e4", "fill-opacity": 1}
          },
          {
            "id": "road_path",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "transportation",
            "filter": [
              "all",
              ["==", "$type", "LineString"],
              ["in", "class", "path", "track"]
            ],
            "layout": {"line-cap": "square", "line-join": "bevel"},
            "paint": {
              "line-color": "#81b9e4",
              "line-dasharray": [1, 1],
              "line-width": {"base": 1.55, "stops": [[4, 0.25], [20, 10]]}
            }
          },
          {
            "id": "road_minor",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "transportation",
            "minzoom": 13,
            "filter": [
              "all",
              ["==", "$type", "LineString"],
              ["in", "class", "minor", "service"]
            ],
            "layout": {"line-cap": "round", "line-join": "round"},
            "paint": {
              "line-color": "#81b9e4",
              "line-width": {"base": 1.55, "stops": [[4, 0.2], [20, 16]]}
            }
          },
          {
            "id": "aeroway-area",
            "type": "fill",
            "metadata": {"mapbox:group": "1444849345966.4436"},
            "source": "openmaptiles",
            "source-layer": "aeroway",
            "minzoom": 4,
            "filter": [
              "all",
              ["==", "$type", "Polygon"],
              ["in", "class", "runway", "taxiway"]
            ],
            "layout": {"visibility": "visible"},
            "paint": {
              "fill-color": "rgba(255, 255, 255, 1)",
              "fill-opacity": {"base": 1, "stops": [[13, 0], [14, 1]]}
            }
          },
          {
            "id": "aeroway-taxiway",
            "type": "line",
            "metadata": {"mapbox:group": "1444849345966.4436"},
            "source": "openmaptiles",
            "source-layer": "aeroway",
            "minzoom": 12,
            "filter": [
              "all",
              ["in", "class", "taxiway"],
              ["==", "$type", "LineString"]
            ],
            "layout": {
              "line-cap": "round",
              "line-join": "round",
              "visibility": "visible"
            },
            "paint": {
              "line-color": "#81b9e4",
              "line-opacity": 1,
              "line-width": {"base": 1.5, "stops": [[12, 1], [17, 10]]}
            }
          },
          {
            "id": "aeroway-runway",
            "type": "line",
            "metadata": {"mapbox:group": "1444849345966.4436"},
            "source": "openmaptiles",
            "source-layer": "aeroway",
            "minzoom": 4,
            "filter": [
              "all",
              ["in", "class", "runway"],
              ["==", "$type", "LineString"]
            ],
            "layout": {
              "line-cap": "round",
              "line-join": "round",
              "visibility": "visible"
            },
            "paint": {
              "line-color": "#81b9e4",
              "line-opacity": 1,
              "line-width": {"base": 1.5, "stops": [[11, 4], [17, 50]]}
            }
          },
          {
            "id": "road_trunk_primary",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "transportation",
            "filter": [
              "all",
              ["==", "$type", "LineString"],
              ["in", "class", "trunk", "primary"]
            ],
            "layout": {"line-cap": "round", "line-join": "round"},
            "paint": {
              "line-color": "rgba(0,0,0,0.08)",
              "line-width": {"base": 1.4, "stops": [[6, 0.5], [20, 30]]}
            }
          },
          {
            "id": "road_secondary_tertiary",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "transportation",
            "filter": [
              "all",
              ["==", "$type", "LineString"],
              ["in", "class", "secondary", "tertiary"]
            ],
            "layout": {"line-cap": "round", "line-join": "round"},
            "paint": {
              "line-color": "rgba(0,0,0,0.08)",
              "line-width": {"base": 1.4, "stops": [[6, 0.5], [20, 16]]}
            }
          },
          {
            "id": "road_major_motorway",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "transportation",
            "filter": [
              "all",
              ["==", "$type", "LineString"],
              ["==", "class", "motorway"]
            ],
            "layout": {"line-cap": "round", "line-join": "round"},
            "paint": {
              "line-color": "rgba(0,0,0,0.08)",
              "line-offset": 0,
              "line-width": {"base": 1.4, "stops": [[8, 0.6], [16, 10]]}
            }
          },
          {
            "id": "railway-transit",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "transportation",
            "filter": [
              "all",
              ["==", "class", "transit"],
              ["!=", "brunnel", "tunnel"]
            ],
            "layout": {"visibility": "visible"},
            "paint": {
              "line-color": "rgba(0,0,0,0.08)",
              "line-opacity": {"base": 1, "stops": [[11, 0], [16, 1]]}
            }
          },
          {
            "id": "railway",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "transportation",
            "filter": ["==", "class", "rail"],
            "layout": {"visibility": "visible"},
            "paint": {
              "line-color": "#ffffff",
              "line-opacity": {"base": 1, "stops": [[11, 0], [16, 1]]}
            }
          },
          {
            "id": "waterway-bridge-case",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "waterway",
            "filter": [
              "all",
              ["==", "$type", "LineString"],
              ["==", "brunnel", "bridge"]
            ],
            "layout": {"line-cap": "butt", "line-join": "miter"},
            "paint": {
              "line-color": "#bbbbbb",
              "line-gap-width": {"base": 1.55, "stops": [[4, 0.25], [20, 30]]},
              "line-width": {"base": 1.6, "stops": [[12, 0.5], [20, 10]]}
            }
          },
          {
            "id": "waterway-bridge",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "waterway",
            "filter": [
              "all",
              ["==", "$type", "LineString"],
              ["==", "brunnel", "bridge"]
            ],
            "layout": {"line-cap": "round", "line-join": "round"},
            "paint": {
              "line-color": "hsl(205, 56%, 73%)",
              "line-width": {"base": 1.55, "stops": [[4, 0.25], [20, 30]]}
            }
          },
          {
            "id": "bridge_minor case",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "transportation",
            "filter": [
              "all",
              ["==", "$type", "LineString"],
              ["==", "brunnel", "bridge"],
              ["==", "class", "minor_road"]
            ],
            "layout": {"line-cap": "butt", "line-join": "miter"},
            "paint": {
              "line-color": "#dedede",
              "line-gap-width": {"base": 1.55, "stops": [[4, 0.25], [20, 30]]},
              "line-width": {"base": 1.6, "stops": [[12, 0.5], [20, 10]]}
            }
          },
          {
            "id": "bridge_major case",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "transportation",
            "filter": [
              "all",
              ["==", "$type", "LineString"],
              ["==", "brunnel", "bridge"],
              ["in", "class", "primary", "secondary", "tertiary", "trunk"]
            ],
            "layout": {"line-cap": "butt", "line-join": "miter"},
            "paint": {
              "line-color": "#81b9e4",
              "line-gap-width": {"base": 1.55, "stops": [[4, 0.25], [20, 30]]},
              "line-width": {"base": 1.6, "stops": [[12, 0.5], [20, 10]]}
            }
          },
          {
            "id": "bridge_minor",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "transportation",
            "filter": [
              "all",
              ["==", "$type", "LineString"],
              ["==", "brunnel", "bridge"],
              ["==", "class", "minor_road"]
            ],
            "layout": {"line-cap": "round", "line-join": "round"},
            "paint": {
              "line-color": "#efefef",
              "line-width": {"base": 1.55, "stops": [[4, 0.25], [20, 30]]}
            }
          },
          {
            "id": "bridge_major",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "transportation",
            "filter": [
              "all",
              ["==", "$type", "LineString"],
              ["==", "brunnel", "bridge"],
              ["in", "class", "primary", "secondary", "tertiary", "trunk"]
            ],
            "layout": {"line-cap": "round", "line-join": "round"},
            "paint": {
              "line-color": "#81b9e4",
              "line-width": {"base": 1.4, "stops": [[6, 0.5], [20, 30]]}
            }
          },
          {
            "id": "admin_sub",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "boundary",
            "filter": ["in", "admin_level", 4, 6, 8],
            "layout": {"visibility": "none"},
            "paint": {"line-color": "hsla(0, 0%, 60%, 0.5)", "line-dasharray": [2, 1]}
          },
          {
            "id": "place_other",
            "type": "symbol",
            "metadata": {"mapbox:group": "101da9f13b64a08fa4b6ac1168e89e5f"},
            "source": "openmaptiles",
            "source-layer": "place",
            "maxzoom": 14,
            "filter": [
              "all",
              ["==", "$type", "Point"],
              ["in", "class", "hamlet", "isolated_dwelling", "neighbourhood"]
            ],
            "layout": {
              "text-anchor": "center",
              "text-field": "{name:latin}\n{name:nonlatin}",
              "text-font": ["Roboto Condensed Bold", "Noto Sans Regular"],
              "text-justify": "center",
              "text-offset": [0.5, 0],
              "text-size": 10,
              "text-transform": "uppercase",
              "visibility": "visible"
            },
            "paint": {
              "text-color": textColor,
              "text-halo-color": textHaloColor,
              "text-halo-blur": 1,
              "text-halo-width": 1
            }
          },
          {
            "id": "place_suburb",
            "type": "symbol",
            "metadata": {"mapbox:group": "101da9f13b64a08fa4b6ac1168e89e5f"},
            "source": "openmaptiles",
            "source-layer": "place",
            "maxzoom": 15,
            "filter": ["all", ["==", "$type", "Point"], ["==", "class", "suburb"]],
            "layout": {
              "text-anchor": "center",
              "text-field": "{name:latin}\n{name:nonlatin}",
              "text-font": ["Roboto Condensed Bold", "Noto Sans Regular"],
              "text-justify": "center",
              "text-offset": [0.5, 0],
              "text-size": 10,
              "text-transform": "uppercase",
              "visibility": "visible"
            },
            "paint": {
              "text-color": textColor,
              "text-halo-color": textHaloColor,
              "text-halo-blur": 1,
              "text-halo-width": 1
            }
          },
          {
            "id": "place_village",
            "type": "symbol",
            "metadata": {"mapbox:group": "101da9f13b64a08fa4b6ac1168e89e5f"},
            "source": "openmaptiles",
            "source-layer": "place",
            "maxzoom": 14,
            "filter": ["all", ["==", "$type", "Point"], ["==", "class", "village"]],
            "layout": {
              "icon-size": 0.4,
              "text-anchor": "left",
              "text-field": "{name:latin}\n{name:nonlatin}",
              "text-font": ["Roboto Condensed Bold", "Noto Sans Regular"],
              "text-justify": "left",
              "text-offset": [0.5, 0.2],
              "text-size": 10,
              "text-transform": "uppercase",
              "visibility": "visible"
            },
            "paint": {
              "icon-opacity": 0.7,
              "text-color": textColor,
              "text-halo-color": textHaloColor,
              "text-halo-blur": 1,
              "text-halo-width": 1
            }
          },
          {
            "id": "place_town",
            "type": "symbol",
            "metadata": {"mapbox:group": "101da9f13b64a08fa4b6ac1168e89e5f"},
            "source": "openmaptiles",
            "source-layer": "place",
            "maxzoom": 15,
            "filter": ["all", ["==", "$type", "Point"], ["==", "class", "town"]],
            "layout": {
              "icon-image": {"base": 1, "stops": [[0, "circle-11"], [9, ""]]},
              "icon-size": 0.4,
              "text-anchor": {"base": 1, "stops": [[0, "left"], [8, "center"]]},
              "text-field": "{name:latin}\n{name:nonlatin}",
              "text-font": ["Roboto Condensed Bold", "Noto Sans Regular"],
              "text-justify": "left",
              "text-offset": [0.5, 0.2],
              "text-size": 10,
              "text-transform": "uppercase",
              "visibility": "visible"
            },
            "paint": {
              "icon-opacity": 0.7,
              "text-color": textColor,
              "text-halo-color": textHaloColor,
              "text-halo-blur": 1,
              "text-halo-width": 1
            }
          },
          {
            "id": "place_city",
            "type": "symbol",
            "metadata": {"mapbox:group": "101da9f13b64a08fa4b6ac1168e89e5f"},
            "source": "openmaptiles",
            "source-layer": "place",
            "maxzoom": 14,
            "filter": [
              "all",
              ["==", "$type", "Point"],
              ["==", "class", "city"],
              [">", "rank", 3]
            ],
            "layout": {
              "icon-image": {"base": 1, "stops": [[0, "circle-11"], [9, ""]]},
              "icon-size": 0.4,
              "text-anchor": {"base": 1, "stops": [[0, "left"], [8, "center"]]},
              "text-field": "{name:latin}\n{name:nonlatin}",
              "text-font": ["Roboto Condensed Bold", "Noto Sans Regular"],
              "text-justify": "left",
              "text-offset": [0.5, 0.2],
              "text-size": 10,
              "text-transform": "uppercase",
              "visibility": "visible"
            },
            "paint": {
              "icon-opacity": 0.7,
              "text-color": textColor,
              "text-halo-color": textHaloColor,
              "text-halo-blur": 1,
              "text-halo-width": 1
            }
          },
          {
            "id": "place_city_large",
            "type": "symbol",
            "metadata": {"mapbox:group": "101da9f13b64a08fa4b6ac1168e89e5f"},
            "source": "openmaptiles",
            "source-layer": "place",
            "maxzoom": 12,
            "filter": [
              "all",
              ["==", "$type", "Point"],
              ["<=", "rank", 3],
              ["==", "class", "city"]
            ],
            "layout": {
              "icon-image": {"base": 1, "stops": [[0, "circle-11"], [9, ""]]},
              "icon-size": 0.4,
              "text-anchor": {"base": 1, "stops": [[0, "left"], [8, "center"]]},
              "text-field": "{name:latin}\n{name:nonlatin}",
              "text-font": ["Roboto Condensed Bold", "Noto Sans Regular"],
              "text-justify": "left",
              "text-offset": [0.5, 0.2],
              "text-size": 14,
              "text-transform": "uppercase",
              "visibility": "visible"
            },
            "paint": {
              "icon-opacity": 0.7,
              "text-color": textColor,
              "text-halo-color": textHaloColor,
              "text-halo-blur": 1,
              "text-halo-width": 1
            }
          },
          {
            "id": "place_state",
            "type": "symbol",
            "metadata": {"mapbox:group": "101da9f13b64a08fa4b6ac1168e89e5f"},
            "source": "openmaptiles",
            "source-layer": "place",
            "maxzoom": 12,
            "filter": ["all", ["==", "$type", "Point"], ["==", "class", "state"]],
            "layout": {
              "text-field": "{name:latin}\n{name:nonlatin}",
              "text-font": ["Roboto Condensed Regular", "Noto Sans Regular"],
              "text-size": 10,
              "text-transform": "uppercase",
              "visibility": "visible"
            },
            "paint": {
              "text-color": textColor,
              "text-halo-color": textHaloColor,
              "text-halo-blur": 1,
              "text-halo-width": 1
            }
          },
          {
            "id": "place_country_minor",
            "type": "symbol",
            "metadata": {"mapbox:group": "101da9f13b64a08fa4b6ac1168e89e5f"},
            "source": "openmaptiles",
            "source-layer": "place",
            "maxzoom": 8,
            "filter": [
              "all",
              ["==", "$type", "Point"],
              ["==", "class", "country"],
              [">=", "rank", 2],
              ["has", "iso_a2"]
            ],
            "layout": {
              "text-field": "{name:latin}",
              "text-font": ["Roboto Condensed Bold", "Noto Sans Regular"],
              "text-size": {"base": 1, "stops": [[0, 10], [6, 12]]},
              "text-transform": "uppercase",
              "visibility": "visible"
            },
            "paint": {
              "text-color": textColor,
              "text-halo-color": textHaloColor,
              "text-halo-width": 1.4
            }
          },
          {
            "id": "place_country_major",
            "type": "symbol",
            "metadata": {"mapbox:group": "101da9f13b64a08fa4b6ac1168e89e5f"},
            "source": "openmaptiles",
            "source-layer": "place",
            "maxzoom": 6,
            "filter": [
              "all",
              ["==", "$type", "Point"],
              ["<=", "rank", 1],
              ["==", "class", "country"],
              ["has", "iso_a2"]
            ],
            "layout": {
              "text-anchor": "center",
              "text-field": "{name:latin}",
              "text-font": ["Roboto Condensed Bold", "Noto Sans Regular"],
              "text-size": {"base": 1.4, "stops": [[0, 10], [3, 12], [4, 14]]},
              "text-transform": "uppercase",
              "visibility": "visible"
            },
            "paint": {
              "text-color": textColor,
              "text-halo-color": textHaloColor,
              "text-halo-width": 1.4
            }
          },
          {
            "id": "country_label",
            "type": "symbol",
            "source": "openmaptiles",
            "source-layer": "place",
            "maxzoom": 12,
            "filter": [
              "all",
              ["==", "$type", "Point"],
              ["==", "class", "country"],
              ["has", "iso_a2"]
            ],
            "layout": {
              "text-field": "{name:latin}",
              "text-font": ["Roboto Condensed Regular"],
              "text-max-width": 10,
              "text-size": {"stops": [[3, 12], [8, 22]]},
              "visibility": "visible"
            },
            "paint": {
              "text-color": textColor,
              "text-halo-color": textHaloColor,

              "text-halo-blur": 0,
              "text-halo-width": 1,
              "icon-color": "#ffffff",
              "icon-halo-color": "rgba(0,0,0,0.6)",
              "icon-halo-width": 2,
              "icon-halo-blur": 0
            }
          },
          {
            'id': 'mapbox',
            'type': 'fill',
            'source': 'mapbox',
            'source-layer': layerID,
            'filter': ['==', '$type', 'Polygon'],
            'paint': {
              'fill-color': this.colorizePolygons(),
              'fill-outline-color':this.configMapColors.borderColor(this.route.M1),
              'fill-opacity': 1
              /*'fill-opacity': this.colorizeAlpha(),*/
            }
          }
        ]
      };
    }else if(this.service.MAP_POP_STYLE === 'map-dark-rupucs'){
      this.tileStyle = {
        "version": 8,
        "sources": {
        "osm": {
          "type": "vector",
            "tiles": ["https://geo.rupucs.in/api/tiles/planet/{z}/{x}/{y}"],
            "minZoom": 0,
            "maxZoom": 22
        },
        "satellite": {
          "tileSize": 256,
            "type": "raster",
            "url": "https://api.maptiler.com/tiles/satellite/tiles.json?key=0g05zGjMGsi8gLPQK5ZH"
        },
        'mapbox': {
            'type': 'vector',
            'tiles': [tileURL],
            'minZoom': this.MIN_ZOOM,
            'maxZoom': this.MAX_ZOOM
          }
      },
        "glyphs": "https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=0g05zGjMGsi8gLPQK5ZH",
        "layers": [
        {
          "filter": [
            "all"
          ],
          "id": "satellite",
          "layout": {
            "visibility": "visible"
          },
          "minzoom": 0,
          "paint": {
            "raster-brightness-max": 0.6,
            "raster-brightness-min": 0.02,
            "raster-opacity": 1,
            "raster-saturation": -1
          },
          "source": "satellite",
          "type": "raster"
        },
        {
          "filter": [
            "all",
            [
              "==",
              "$type",
              "LineString"
            ],
            [
              "==",
              "brunnel",
              "tunnel"
            ],
            [
              "in",
              "class",
              "motorway",
              "primary",
              "secondary",
              "tertiary",
              "trunk"
            ]
          ],
          "id": "tunnel",
          "layout": {
            "line-cap": "butt",
            "line-join": "miter"
          },
          "paint": {
            "line-color": "rgba(255, 255, 255, 0.2)",
            "line-dasharray": [
              0.28,
              0.14
            ],
            "line-width": [
              "interpolate",
              [
                "exponential",
                1.5
              ],
              [
                "zoom"
              ],
              6,
              0.5,
              20,
              30
            ]
          },
          "source": "osm",
          "source-layer": "transportation",
          "type": "line"
        },
        {
          "filter": [
            "all",
            [
              "==",
              "$type",
              "LineString"
            ],
            [
              "in",
              "class",
              "path",
              "track"
            ]
          ],
          "id": "path",
          "layout": {
            "line-cap": "square",
            "line-join": "bevel"
          },
          "paint": {
            "line-color": "rgba(247, 247, 247, 0.33)",
            "line-dasharray": [
              1,
              1
            ],
            "line-width": [
              "interpolate",
              [
                "exponential",
                1.5
              ],
              [
                "zoom"
              ],
              14,
              0.5,
              20,
              4
            ]
          },
          "source": "osm",
          "source-layer": "transportation",
          "type": "line"
        },
        {
          "filter": [
            "all",
            [
              "==",
              "$type",
              "LineString"
            ],
            [
              "!in",
              "class",
              "rail",
              "ferry",
              "path",
              "track"
            ],
            [
              "!=",
              "brunnel",
              "tunnel"
            ]
          ],
          "id": "road",
          "layout": {
            "line-cap": "butt",
            "line-join": "round"
          },
          "minzoom": 6,
          "paint": {
            "line-color": [
              "interpolate",
              [
                "linear"
              ],
              [
                "zoom"
              ],
              8,
              "rgba(255, 255, 255, 0.2)",
              14,
              "rgba(255, 255, 255, 0.3)"
            ],
            "line-width": [
              "interpolate",
              [
                "linear"
              ],
              [
                "zoom"
              ],
              5,
              [
                "match",
                [
                  "get",
                  "class"
                ],
                [
                  "motorway",
                  "motorway_link"
                ],
                1,
                0
              ],
              7,
              [
                "match",
                [
                  "get",
                  "class"
                ],
                [
                  "motorway",
                  "motorway_link"
                ],
                1.4,
                0
              ],
              8,
              [
                "match",
                [
                  "get",
                  "class"
                ],
                [
                  "motorway",
                  "motorway_link",
                  "primary",
                  "trunk"
                ],
                0.75,
                0
              ],
              9,
              [
                "match",
                [
                  "get",
                  "class"
                ],
                [
                  "secondary",
                  "tertiary"
                ],
                0.7,
                1
              ],
              10,
              [
                "match",
                [
                  "get",
                  "class"
                ],
                [
                  "motorway",
                  "motorway_link"
                ],
                1.3,
                1.3
              ],
              14,
              [
                "match",
                [
                  "get",
                  "class"
                ],
                [
                  "minor",
                  "service"
                ],
                0.5,
                2.4
              ]
            ]
          },
          "source": "osm",
          "source-layer": "transportation",
          "type": "line"
        },
        {
          "filter": [
            "==",
            "class",
            "rail"
          ],
          "id": "railway",
          "layout": {
            "visibility": "visible"
          },
          "minzoom": 11,
          "paint": {
            "line-color": "rgba(179, 170, 158, 0.2)",
            "line-opacity": [
              "interpolate",
              [
                "linear"
              ],
              [
                "zoom"
              ],
              11,
              0.5,
              16,
              1.3
            ]
          },
          "source": "osm",
          "source-layer": "transportation",
          "type": "line"
        },
        {
          "filter": [
            "in",
            "admin_level",
            4,
            6,
            8
          ],
          "id": "admin_sub",
          "layout": {
            "visibility": "none"
          },
          "paint": {
            "line-color": "rgba(194, 194, 194, 0.5)",
            "line-dasharray": [
              2,
              1
            ]
          },
          "source": "osm",
          "source-layer": "boundary",
          "type": "line"
        },
        {
          "filter": [
            "all",
            [
              "<=",
              "admin_level",
              2
            ],
            [
              "==",
              "$type",
              "LineString"
            ]
          ],
          "id": "admin_country-dark",
          "layout": {
            "line-cap": "butt",
            "line-join": "round",
            "visibility": "none"
          },
          "paint": {
            "line-color": "rgba(0, 0, 0, 0.51)",
            "line-offset": 1,
            "line-width": [
              "interpolate",
              [
                "exponential",
                1.5
              ],
              [
                "zoom"
              ],
              3,
              0.5,
              21,
              32
            ]
          },
          "source": "osm",
          "source-layer": "boundary",
          "type": "line"
        },
        {
          "filter": [
            "all",
            [
              "<=",
              "admin_level",
              2
            ],
            [
              "==",
              "$type",
              "LineString"
            ]
          ],
          "id": "admin_country",
          "layout": {
            "line-cap": "round",
            "line-join": "round",
            "visibility": "none"
          },
          "paint": {
            "line-color": "rgba(226, 226, 226, 1)",
            "line-width": [
              "interpolate",
              [
                "exponential",
                1.5
              ],
              [
                "zoom"
              ],
              3,
              0.5,
              21,
              32
            ]
          },
          "source": "osm",
          "source-layer": "boundary",
          "type": "line"
        },
        {
          "filter": [
            "==",
            "$type",
            "LineString"
          ],
          "id": "road_label",
          "layout": {
            "symbol-placement": "line",
            "text-field": "{name:latin} {name:nonlatin}",
            "text-font": [
              "Roboto Condensed Regular",
              "Noto Sans Regular"
            ],
            "text-letter-spacing": 0.1,
            "text-rotation-alignment": "map",
            "text-size": [
              "interpolate",
              [
                "cubic-bezier",
                0.75,
                1,
                0.75,
                1
              ],
              [
                "zoom"
              ],
              10,
              8,
              15,
              9
            ],
            "text-transform": "none"
          },
          "paint": {
            "text-color": "rgba(255, 255, 255, 1)",
            "text-halo-color": "rgba(43, 43, 43, 1)",
            "text-halo-width": 1
          },
          "source": "osm",
          "source-layer": "transportation_name",
          "type": "symbol"
        },
        {
          "filter": [
            "all",
            [
              "==",
              "$type",
              "Point"
            ],
            [
              "!in",
              "class",
              "country",
              "state"
            ]
          ],
          "id": "place_label",
          "layout": {
            "text-field": "{name:latin}\n{name:nonlatin}",
            "text-font": [
              "Roboto Condensed Regular",
              "Noto Sans Regular"
            ],
            "text-max-width": 10,
            "text-size": [
              "interpolate",
              [
                "cubic-bezier",
                0.5,
                1,
                0.5,
                1
              ],
              [
                "zoom"
              ],
              3,
              [
                "match",
                [
                  "get",
                  "class"
                ],
                "city",
                11,
                10
              ],
              6,
              [
                "match",
                [
                  "get",
                  "class"
                ],
                "city",
                14.5,
                11
              ],
              8,
              [
                "match",
                [
                  "get",
                  "class"
                ],
                "city",
                16,
                12
              ],
              10,
              [
                "match",
                [
                  "get",
                  "class"
                ],
                "city",
                20,
                13
              ]
            ]
          },
          "maxzoom": 16,
          "minzoom": 3,
          "paint": {
            "text-color": "rgba(255, 255, 255, 1)",
            "text-halo-blur": 0.5,
            "text-halo-color": [
              "match",
              [
                "get",
                "class"
              ],
              [
                "city"
              ],
              "rgba(0, 0, 0, 0.75)",
              "rgba(43, 43, 43, 1)"
            ],
            "text-halo-width": 1
          },
          "source": "osm",
          "source-layer": "place",
          "type": "symbol"
        },
        {
          "filter": [
            "all",
            [
              "==",
              "$type",
              "Point"
            ],
            [
              "in",
              "class",
              "country",
              "state"
            ]
          ],
          "id": "country_label",
          "layout": {
            "text-field": "{name:latin}",
            "text-font": [
              "Roboto Condensed Regular",
              "Noto Sans Bold"
            ],
            "text-max-width": 10,
            "text-size": [
              "interpolate",
              [
                "cubic-bezier",
                0.75,
                1,
                0.75,
                1
              ],
              [
                "zoom"
              ],
              1,
              [
                "step",
                [
                  "get",
                  "rank"
                ],
                13,
                1,
                12,
                2,
                12
              ],
              4,
              [
                "step",
                [
                  "get",
                  "rank"
                ],
                15,
                1,
                14,
                2,
                14
              ],
              6,
              [
                "step",
                [
                  "get",
                  "rank"
                ],
                23,
                1,
                18,
                2,
                18
              ],
              9,
              [
                "step",
                [
                  "get",
                  "rank"
                ],
                27,
                1,
                22,
                2,
                22
              ]
            ]
          },
          "maxzoom": 12,
          "paint": {
            "text-color": "rgba(255, 255, 255, 1)",
            "text-halo-blur": 1,
            "text-halo-color": "rgba(0, 0, 0, 1)",
            "text-halo-width": 1
          },
          "source": "osm",
          "source-layer": "place",
          "type": "symbol"
        },
        {
            'id': 'mapbox',
            'type': 'fill',
            'source': 'mapbox',
            'source-layer': layerID,
            'filter': ['==', '$type', 'Polygon'],
            'paint': {
              'fill-color': this.colorizePolygons(),
              'fill-outline-color':this.configMapColors.borderColor(this.route.M1),
              'fill-opacity': 1
            }
          }
      ]
      }
    }


  }
  private colorizePolygons=():any=>{
    if(this.service.dataIsNotComplete==true){
      return'#ffffff';
    }
    const all_codes:Array<string>=[];
    const arr:Array<any>=[];
    arr.push('match');
    arr.push(['get', 'code']);
    //////////////////////////////////////
    // // this.logger.log('MAP-BOX - colorizePolygons ');
    // // this.logger.dir(this.service.backgroundService.data);
    let i:number=0;
    let L:number = this.service.background.data.length;
    let item:BackgroundDataVO;
    let code:string;
    let color:string;
    while(i<L){
      item = this.service.background.data[i];
      code = item.code;

      if(item.value>0){
        color = this.getColorByPercentage(item.value);
      }else if(item.value===0){
        color = this.configMapColors.map_zero_color;
      }else if(item.value===-1){
        color = this.configMapColors.map_no_value_color;
      }else{
        color = '#0078ff';  // unknown
      }

      if(all_codes.indexOf(code)===-1){
        all_codes.push(code);
        arr.push(code,color);
      }else{
        // this.logger.error('code ['+code+'] is not unique !!!');
      }
      i++;
    }
    //////////////////////////////////////
    arr.push('#ffffff');
    return arr;
  }

  private initializeMap=():void=>{
    this.popLegendRef.instance.update(this.service.background.clusters.items,this.service.background.impossibleData,this.service.background.zerroData);
    this.generateMapStyle();
    mapboxgl.accessToken = this.TOKEN;

    this.map = new mapboxgl.Map({
      container: 'map',
      antialias: true,
      style: this.tileStyle,
      zoom: this.MIN_ZOOM,
      maxZoom:this.MAX_ZOOM,
      dragPan:true,
      renderWorldCopies:false,
      bounds: this.mapBounds,
      /*maxBounds:this.mapBounds,*/
      doubleClickZoom:false,
      trackResize:true,
      boxZoom:false,
      /////////////////
      // disable pitch
      /////////////////
/*      pitchWithRotate: false,
      dragRotate: false,
      touchZoomRotate: false*/
      pitchWithRotate: true,
      dragRotate: true,
      touchZoomRotate: true
    });
    this.map.getCanvas().style.cursor = 'default';

    this.map.on('load', this.mapOnLoad);
    this.map.on('render', this.mapOnRender);
    this.map.on('dblclick', this.mapOnDoubleClick);
    this.map.on('mousemove', this.mapOnMouseMove);

    this.map.on('mouseenter', 'mapbox', this.layerOnMouseOver);
    this.map.on('mouseleave', 'mapbox', this.layerOnMouseOut);

    this.map.on('click', this.mapOnClick);
    this.map.on('mouseleave', this.mapOnMouseOut);
    this.map.on('mousedown', this.mapOnMouseDown);
    this.map.on('mouseup', this.mapOnMouseUp);
    this.map.on('wheel', this.mapOnWheel);
    this.map.on('zoomend', this.mapOnZoomEnd);
    this.map.on('zoom', this.mapOnZoom);
    this.map.on('movestart', this.mapOnMoveStart);
    this.map.on('moveend', this.mapOnMoveEnd);
    this.map.on('move', this.mapOnMove);
    this.map.on('sourcedata', this.mapOnSourceData);
    this.map.on('style.load',this.onStyleLoaded);
    this.map.on('webglcontextlost', () => {
      //console.log('A webglcontextlost event occurred.');
    });
    this.map.on('webglcontextrestored', () => {
      //console.log('A webglcontextrestored event occurred.');
    });

    window.addEventListener('scroll', this.onWindowScroll, true);

    this.mapIsInitialized = true;
    this.resizeContainer();

  }
  private onTitlesUpdate=():void=>{
    this.titleVO = new TranslationVO('',this.service.titlesService.vo.map_title,this.service.titlesService.vo.map_title);
  }
  public onControlsLayers=():void=>{
    this.layersOpen = !this.layersOpen;
    this.popLayersRef.instance.radio_id = this.service.MAP_POP_STYLE;
    this.popLayersRef.instance.visible = this.layersOpen;
  }


  private mapOnRender=(e:any):void=>{

    const loaded:boolean = this.map.loaded();
    if(loaded===false){
      return;
    }
    this.map.off('render', this.mapOnRender);
    this.resizeContainer();
  }
  private updateCentroidPositions=():void=>{
    //console.log('*******************');
    //console.log('MAP-MAPBOX.updateCentroidPositions - mapIsInitialized:'+this.mapIsInitialized);
    //console.log('*******************');
    if(this.mapIsInitialized===false){return;}

    this.getMapSizePixels();
    const data:Array<CentroidVO> = this.service.centroids.data;
    let point:any;
    let i:number = 0;
    const L:number = data.length;
    while(i<L){
      point = this.map.project([data[i].geoCoords[0],data[i].geoCoords[1]]);
      data[i].pixelCoords = [point.x,point.y];
      i++;
    }
    this.service.centroids.mapPositionUpdate();
  }
  private updateMobilePopupPosition():void{
    if(this.mapClickCoords) {
      const point: any = this.map.project(this.mapClickCoords.lngLat);
      this.positionPop(point.x, point.y);
    }
  }
  private getMapSizePixels():void{
    const p1 = this.map.project(this.mapBounds[0]);
    const p2 = this.map.project(this.mapBounds[1]);
    const xx:number = p2.x - p1.x;
    const yy:number = p2.y - p1.y;
    this.service.MAP_SIZE = Math.sqrt(xx*xx+yy*yy)/2;
    this.service.MAP_ZOOM = this.map.getZoom();
  }


  private mapOnLoad=(e:any):void=>{
    this.mapLoaded = true;
    this.mapCanvasElement = document.getElementsByClassName('mapboxgl-canvas')[0] as HTMLElement;
    this.mapCanvasElement.style.outline = 'none';
    this.map.scrollZoom.setWheelZoomRate(1/100);
    this.map.scrollZoom.setZoomRate(1/100);
    //////////////////////////////////////////////////
    this.resizeContainer();
    this.checkLoading();
  }
  private mapOnSourceData=(e:any):void=>{
    this.mapSourceLoaded = e.isSourceLoaded;
    this.checkLoading();
  }
  private onStyleLoaded=(e:any):void=>{
    this.mapStyleLoaded = true;
    this.checkLoading();
  }

  private mapOnDoubleClick=(e:any):void=>{
    this.map.setBearing(0);
    this.map.setPitch(0);
    this.map.fitBounds(this.mapBounds,{padding: this.PADDING});
  }

  private mapOnMouseMove=(e:any):void=>{
    if(this.mobile===true){ return; }
    if(this.mouseIsDown===true){ return; }

    const features:Array<any> = this.map.queryRenderedFeatures(e.point);
    if(features[0]){
      this.showPop(features[0].properties.code, features[0].properties.name,features[0].properties.name_en , e.point.x,e.point.y);
    }else{
      this.hidePop();
    }
  }

  private layerOnMouseOver=(e:any):void=>{
    if(this.mobile===true){return;}
  }
  private layerOnMouseOut=(e:any):void=>{
    if(this.mobile===true){return;}
    this.hidePop();
  }

  private onPickingDataRequestAnswer=(picking:boolean):void=>{
    if(picking===true){return;}
    const e:any =  this.mapClickCoords;
    this.service.popService.hide();
    const features: Array<any> = this.map.queryRenderedFeatures(e.point);

    if(features[0]) {
        this.showPop(features[0].properties.code, features[0].properties.name, features[0].properties.name_en, e.point.x, e.point.y);
    }
  }
  private mapOnClick=(e:any):void=>{
    if(this.mobile===true){
      this.mapClickCoords = e;
      this.service.popService.checkIfExistPickingData({x:e.point.x, y:e.point.y});
      this.updateMobilePopupPosition();
    }
  }
  private mapOnMouseOut=(e:any):void=>{
    if(this.mobile===true){return;}
    this.hidePop();
  }
  private mapOnMouseDown=(e:any):void=>{
    if(this.mobile===true){ return;}
    this.mouseIsDown = true;
    document.addEventListener('mousemove', this.onDocumentMouseMove);
  }

  private mapOnMouseUp=(e:any):void=>{
    if(this.mobile===true){return;}
    this.mouseIsDown = false;
    document.removeEventListener('mousemove', this.onDocumentMouseMove);
  }
  private mapOnWheel=(e:any):void=>{
    this.map.scrollZoom.enable();
  }
  private mapOnZoomEnd=(e:any):void=>{
    this.ZOOM_IN_ENABLED = parseFloat(this.map.getZoom().toFixed(2)+'')<this.MAX_ZOOM;
    this.ZOOM_OUT_ENABLED = parseFloat(this.map.getZoom().toFixed(2)+'')>this.MIN_ZOOM;
  }
  private mapOnZoom=(e:any):void=>{
    if(this.mobile){
      this.updateMobilePopupPosition();
    }
    this.updateCentroidPositions();
  }
  private mapOnMoveStart=(e:any):void=>{
    if(this.mobile){
      this.updateMobilePopupPosition();
    }
  }
  private mapOnMoveEnd=(e:any):void=>{
    if(this.mobile){
      this.updateMobilePopupPosition();
    }
  }
  private mapOnMove=(e:any):void=>{
    if(this.mobile){
      this.updateMobilePopupPosition();
    }
    this.updateCentroidPositions();
  }

  private onWindowScroll=():void=>{
    if(this.mobile===true){
      this.hidePop();
    }
  }


  public getColorByPercentage=(value:number):string=>{
    let color = this.service.background.clusters.getColorByValue(value);
    return color;
  }
  private resizeContainer=():void=>{
    this.mapArea = document.getElementById('map-area') as HTMLElement;
    const ww = this.mapArea.offsetWidth;
    const hh = this.mapArea.offsetHeight;

    this.ww = ww;
    this.hh = hh;


    if(!this.map){ return;}

    setTimeout(() => {
      this.map.resize();
      this.map.fitBounds(this.mapBounds,{padding: this.PADDING});
      this.MIN_ZOOM = parseFloat(this.map.getZoom().toFixed(2)+'');
      this.updateCentroidPositions();
    }, 10);

  }


  private onCloseLayers=():void=>{
    this.layersOpen = false;
  }
  private onLayersChange=(id:string):void=>{
    this.service.MAP_POP_STYLE = id;
    this.backgroundLight = this.service.MAP_POP_STYLE!== 'map-dark';
    this.generateMapStyle();
    this.map.setStyle(this.tileStyle);
  }
  private onCloseLegend=():void=>{
    this.dom.legendIsVisible = false;
    this.dom.update();
  }
  private showPop=(code:string,name_lv:string,name_en:string, x:number,y:number):void=>{
    if(this.service.popService.type!==1){
     return;
    }
    this.createMapPop(code, x,y);
  }

  private createMapPop(code:string, x:number,y:number):void{
    if(this.mapCanvasElement==undefined){return;}
    const rect = this.mapCanvasElement.getBoundingClientRect();
    if(rect==undefined){ return;}
    if(code==undefined){ return;}

    let vo:PopSimpleVO = this.service.popService.voSimple;
    if(vo===undefined || vo===null || vo.code!==code) {
      vo = this.service.popService.createPopSimpleVO(code);
      this.service.popService.show(vo,rect.left + x,rect.top + y);
    }else{
      this.service.popService.positionUpdate({x:rect.left + x,y:rect.top + y});
    }
  }

  private positionPop(x:number,y:number):void{
    // if(this.popService.type!==1){ return;}
    const rect = this.mapCanvasElement.getBoundingClientRect();
    if(!rect){ return;}
    this.service.popService.positionUpdate({x:rect.left + x,y:rect.top + y});
  }
  private hidePop=():void=>{
    if(this.service.popService.type!==1){ return; }
    this.service.popService.hide();
  }
  private checkLoading=():void=>{
    // this.logger.log('************');
    // this.logger.log('checkLoading');
    // this.logger.log('************');
    // this.logger.log(' READY:'+this.READY);
    // this.logger.log(' mapStyleLoaded:'+this.mapStyleLoaded);
    // this.logger.log(' mapIsInitialized:'+this.mapIsInitialized);
    // this.logger.log('************');
    const loaded:boolean = this.READY==true &&this.mapIsInitialized==true && this.mapLoaded==true&&this.mapStyleLoaded==true||this.mapSourceLoaded==true;
    (this.loaderContainer.element.nativeElement as HTMLElement).style.display= (loaded==false)?'block':'none';

  }


  private onDocumentMouseMove=(evt:any):void=>{
    if(this.mouseIsDown===false){
      return;
    }
    const rect = this.mapArea.getBoundingClientRect();
    const x:number =  (evt.clientX) - rect.left;
    const y:number =  (evt.clientY) - rect.top;
    this.positionPop(x,y);
  }

  @HostListener('window:resize', ['$event'])
  onHostResize(event:Event){
    this.resizeContainer();
  }

  @HostListener('window:orientationchange', ['$event'])
  onHostOrientationChange(event:Event){
    this.resizeContainer();
  }

  public onFullscreenClick=():void=>{
    this.onFullscreenChange.emit(!this.fullscreen);
  }
  public onLegendClick=(value:boolean):void=>{
    this.onLegendChange(value);
  }
  public onZoomClick=(dir:number):void=>{
    if(dir===1){
      this.map.zoomIn({animate:true,duration:1.8,easing: function (t) { return t; }});
    }else{
      this.map.zoomOut({animate:true,duration:1.8,easing: function (t) { return t; }});
    }
  }

  public onLegendChange=(value:boolean):void=>{
    this.dom.legendIsVisible = value;
    this.dom.update();
  }
  private onDomElementsUpdate=():void=>{
    this.mobile = this.dom.isMobile;
    this.legendIsVisible = this.dom.legendIsVisible;
  }
}
