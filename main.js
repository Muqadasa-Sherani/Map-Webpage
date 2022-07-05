window.onload = init;

function init(){

    const raster = new ol.layer.Tile({ //Tile layer of the map
        source: new ol.source.OSM(),
      });
      
      const source = new ol.source.Vector();

      const vector = new ol.layer.Vector({ //vector layer of the map
        source: source
      });
    
      const map = new ol.Map({ //the map object...
        layers: [raster, vector], //...with its layers
        target: 'js-map', 
        view: new ol.View({
          center: [3955818.045998468, 4724642.604322681],
          zoom:6,
        }),
      });

} //init function ended

//e.feature.getGeometry().getCoordinate()  ---> when listening to the interaction instead of map