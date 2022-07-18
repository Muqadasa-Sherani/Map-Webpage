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

    fetch("https://localhost:7031/Locationt", { //all the coordinates from the database are shown as points on the map
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json()) //converts the response/output data into json.
    .then(response=> { // response/data is added to the map.
      /***To draw points on the map:
       * 1. Create a source, in this case a vector source, with the features you want to draw.
       * 2. Create a layer, in this case a vector layer, with the source from step 1, and the style you prefer.
       * 3. Add the style you perfer.***/

      for (i = 0; i < response.length; i++) {
        let featureStyle = new ol.style.Style({ //the style of point is described
            image: new ol.style.Circle({ //the points are circle and red color
            radius: 2,
            fill: new ol.style.Fill({color: 'red'})
          })
        });
        let feature = new ol.Feature({ //feature holds all the coordinates that are saved in the database.
          geometry: new ol.geom.Point(
            [response[i].x, response[i].y])
        });

        feature.setStyle(featureStyle); //we give style to the feature (coordinates)
        source.addFeature(feature); //we add the feature to our map.
      }
      // create the source and layer for features
      /*const vectorSource = new ol.source.Vector({
        features: features
      });
      const vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
          image: new ol.style.Circle({
            radius: 2,
            fill: new ol.style.Fill({color: 'red'})
          })
        })
      });*/
      // vector layer is added to the map
      //map.addLayer(vectorLayer);
    })
    .catch((error) => {
      //error, unexpected error happened.
      toastr.error('Unexpected error occurred.', 'Error');
    });// GET fetch finished

    //Add Location Button when clicked-->>
    document.getElementById("selectLocationButton").addEventListener("click", function(){
      //check for zoom
      var mapZoomLevel = map.getView().getZoom();

      if(mapZoomLevel < 16){ 
        //error, the user is too far away they should zoom in more.
        toastr.warning("Please zoom in more.", "Warning")
      }else{
          draw.setActive(true); // when button clicked point is activated and viewed on map
      }
    });

    draw.on("drawend", (e)=>{ // when draw/point is finished we set the point to inactive and panel is popped
      draw.setActive(false);
      
      var X = e.feature.getGeometry().getCoordinates()[0];
      var Y = e.feature.getGeometry().getCoordinates()[1];

      jsPanel.create({      //jspanel is pop-upped.
          id: "addLocationPanel",
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

      

      document.getElementById("addButton").addEventListener("click", function(){ //the selected location is added to the database.
        var name = document.getElementById("name").value; //name value

        toastr.options.closeButton = true; //close icon of toaster notification.
        toastr.options.progressBar = true; //progress bar of toastr notification.
        toastr.options.preventDuplicates = false; //prevents duplicates.

        if(name.length < 3){
          toastr.warning('Name must be atleast three characters.', 'Warning!');
          return;
        }

        let data = {
          X : X,
          Y : Y,
          Name : name
        };

        //POST fetch
        fetch("https://localhost:7031/Locationt/improved", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((response) => {
          if(!response.status){
            //warning, not found
            toastr.warning('The location that you are adding is already added.', 'Warning');
          }
          else{
            toastr.success(name +' is added successfully.', 'Success');
          }
        })
        .catch((error) => {
          //error, unexpected error happened.
          toastr.error('Unexpected error occurred.', 'Error');
        });
        addLocationPanel.close(); //after the button is clicked the panel is closed.
      });//validation for name characters is done.

    }); //on drawend event is finished.

    let resultString = []; //result or response array is global.
    document.getElementById("queryLocationButton").addEventListener('click', function(){ //we fetch all the data from the databse and show on the data table.

      fetch("https://localhost:7031/Locationt", { //all the coordinates from the database are recieved
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json()) //converts the response/output data into json.
      .then(function(response){ // response/data is added to the map.

        resultString = response;
          var panel = jsPanel.create({      //jspanel is pop-upped.
            id: "tablePanel",
            headerTitle: 'Location Query',
            theme: '#00205c',
            contentSize: {
                width: "800px",
                height: "520px"
            },
            content: ' <table id="myTable"></table>'
        }); //jspanel is created

       console.log(resultString);

        $(document).ready( function () {
          $('#myTable').DataTable({
            data: resultString,
            columns: [
              { data: 'id' },
              { data: 'name' },
              { data: 'x' },
              { data: 'y' },
              /*{ title: 'id' },
              { title: 'name' },
              { title: 'x' },
              { title: 'y' }*/
            ],
          });
        });
      })
      .catch((error) => {
        //error, unexpected error happened.
        toastr.error('Unexpected error occurred.', 'Error');
      });// GET fetch finished

    });

  
  } //init function ended
  

  //e.feature.getGeometry().getCoordinate()  ---> when listening to the interaction instead of map
  /*
  API solution opened.
  post istek atacaz
  inside the submit button {
    fetch
  }
  if(negative first)else(positive)
  CORS: security port. modify/limit with, we only want post and update but not delete or get etc
  programs.cs file--> write after addswager();  --> builder.Services.Addcors(x)  --->after app.UseCors("my-policy");

  */