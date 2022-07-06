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
          var X = e.feature.getGeometry().getCoordinates()[0];
          var Y = e.feature.getGeometry().getCoordinates()[1];
  
          jsPanel.create({      //jspanel is pop-upped.
              headerTitle: 'Location Panel',
              theme: '#00205c',
              contentSize: {
                  width: "30%",
                  height: "30%"
              },
              content: ' <div class="form" >'+
              '<label for="x">X: </label>'+'<input type="text" id="x" value="'+X+'" readonly/>' + 
              '<br><br>'+
              '<label for="y">Y: </label>'+'<input type="text" id="y" value="'+Y+'" readonly/>' + 
              '<br><br>'+
              '<label for="name">Name: </label>'+ '<input type="text" id="name" placeholder="Name of the place.."/>'+
              '<br><br>'+
              '<button id="addButton">Add</button>'+
              '</div>'
          }); //jspanel is created

          document.getElementById("addButton").addEventListener("click", function(){
            var name = document.getElementById("name").value; //name value

            toastr.options.closeButton = true; //close icon of toaster notification.
            toastr.options.progressBar = true; //progress bar of toastr notification.
            toastr.options.preventDuplicates = true; //prevents duplicates.

            if(name.length < 3){
              toastr.error('Name must be atleast three characters.', 'Warning!');
            }else{
              toastr.success(name +' is added successfully.', 'Success');
            }
          });//validation for name characters is done.
          
      }); //on drawend event is finished.
  
  } //init function ended
  
  //e.feature.getGeometry().getCoordinate()  ---> when listening to the interaction instead of map