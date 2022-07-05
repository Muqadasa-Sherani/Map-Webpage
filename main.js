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

      let draw; // global so we can remove them later
      draw = new ol.interaction.Draw({ //Point object made
          source: source,
          type: 'Point',
      });
  
      draw.setActive(false); //point on the map is inactive
  
      map.addInteraction(draw); //point object is added to the map but still hidden
  
      //Select Location Button when clicked-->>
      document.getElementById("selectLocationButton").addEventListener("click", function(){
          draw.setActive(true); //when button clicked point is activated and viewed on map
      });
  
      draw.on("drawend", (e)=>{ //when draw/point in finished we set the point to inactive
          draw.setActive(false);
  
          jsPanel.create({      //jspanel is pop-upped.
              headerTitle: 'Location Panel',
              theme: 'dark',
              contentSize: {
                  width: "30%",
                  height: "30%"
              },
              content: '<p style="text-align:center;">X:'+ e.feature.getGeometry().getCoordinates()[0] + 
              '</p>'+'<p style="text-align:center;">Y:'+ e.feature.getGeometry().getCoordinates()[1] + 
              '</p>' + '<input type="text" id="name" placeholder="Name of the place.."/>'+
              '<br><br>'+'<button id="addButton">Add Location</button>'
          });
      });
  
  } //init function ended
  
  //e.feature.getGeometry().getCoordinate()  ---> when listening to the interaction instead of map