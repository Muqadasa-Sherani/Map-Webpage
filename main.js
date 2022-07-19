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
          '<label class= "formLabel" for="x">X: </label>'+'<input type="text" id="x" value="'+X+'" readonly/>' + 
          '<br><br>'+
          '<label class= "formLabel" for="y">Y: </label>'+'<input type="text" id="y" value="'+Y+'" readonly/>' + 
          '<br><br>'+
          '<label class= "formLabel" for="name">Name: </label>'+ '<input type="text" id="name" placeholder="Name of the place.."/>'+
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
            headerTitle: 'Location Query',
            theme: '#00205c',
            contentSize: {
                width: "800px",
                height: "520px"
            },
            content: ' <table id="myTable"><thead><tr><th>Location ID</th><th>Location Name</th><th>X-coord</th><th>Y-coord</th></tr></thead></tbody></tbody></table>'
        }); //jspanel is created

        $(document).ready( function () {
          var table = $('#myTable').DataTable({
            data: resultString,
            columns: [
              { data: 'id' },
              { data: 'name' },
              { data: 'x' },
              { data: 'y' },
            ],
            /*columnDefs: [ //for buttons on each row. Edit and Delete buttons.
              {
                  targets: -1,
                  defaultContent: '<button>Edit</button>',
              },
              {
                targets: -1,
                defaultContent: '<button>Delete</button>',
              },
            ],*/
          });

          //on double clicking a row we pop-up another jspanel with the name and coordinates in input boxes
          $('#myTable tbody').on('dblclick', 'tr', function () {
            var data = table.row(this).data();

            //jspanel
            jsPanel.create({
              headerTitle: 'Location Data',
              theme: '#00205c',
              contentSize: {
                  width: "30%",
                  height: "30%"
              },
              content: ' <div class="form" >'+
                      '<Label class="tabelFormLabel" >Name: </Label><input type="text" name="name" id="name" value="'+table.row(this).data().name+'">'+
                      '<br><br>'+
                      '<Label class="tabelFormLabel" >X-coordinates: </Label><input type="number" name="x" id="x"value="'+table.row(this).data().x+'">'+
                      '<br><br>'+
                      '<Label class="tabelFormLabel" >Y-coordinates: </Label><input type="number" name="y" id="y"value="'+table.row(this).data().y+'">'+
                      '<br><br>'+
                      '<button id="editButton">Edit</button>'+
                      '<button id="deleteButton">Delete</button>'+
                      '</div>'
            });//jspanel finish.

            //////////////////////////////////////////////////////this onclick function does not work.
            /*$('#myTable').on('click', '#deleteButton', function () {
              jsPanel.create({
                headerTitle: 'Location Delete',
                theme: '#00205c',
                content: '<h2>Are you sure you want to delete location?</h2>'+
                '<button id="yes">Yes, I am sure.</button>'+
                '<button id="no">No, I am not sure.</button>'
              });
          });*/

          document.getElementById("deleteButton").addEventListener('click', function(){ //delete button on click
            //a jspanel to validate the deletion of a location.
             jsPanel.create({
              id: "deleteButtonPanel",
              headerTitle: 'Location Delete',
              theme: '#00205c',
              content: '<h2>Are you sure you want to delete location?</h2>'+
              '<button id="yes">Yes, I am sure.</button>'+
              '<button id="no">No, I am not sure.</button>'
            });

            //if yes is clicked.
            document.getElementById("deleteButton").addEventListener('click', function(){ //location is deleted.
              //Delete fetch
              fetch("https://localhost:7031/Locationt", {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              })
              .then((response) => response.json())
              .then((response) => {
                if(!response.status){
                  //warning, not found
                  toastr.warning('The location that you are deleting does not exist.', 'Warning');
                }
                else{
                  toastr.success('Location is deleted successfully.', 'Success');
                  table.row(this).delete(); //the row clicked on is deleted from the datattable.
                }
                
              })
              .catch((error) => {
                //error, unexpected error happened.
                toastr.error('Unexpected error occurred.', 'Error');
              });
              deleteButtonPanel.close(); //after the button is clicked the panel is closed.
            });

          });

          ////////////////////////////////////////////////////////////

          });//double click finish.

          /////////////////////////////////////////////////////////////this does not work, if the onclick for delete is here.
          /*$('#myTable').on('click', '#deleteButton', function () {
            jsPanel.create({
              headerTitle: 'Location Delete',
              theme: '#00205c',
              content: '<h2>Are you sure you want to delete location?</h2>'+
              '<button id="yes">Yes, I am sure.</button>'+
              '<button id="no">No, I am not sure.</button>'
            });
        });*/
        ////////////////////////////////////////////////////////////////

        });//datatable finish

      })
      .catch((error) => {
        //error, unexpected error happened.
        toastr.error('Unexpected error occurred.', 'Error');
      });// GET fetch finished

      ///////////////////////////////////////////////////this does not work, if the onclick for delete is here.
      /*document.getElementById("deleteButton").addEventListener('click', function(){ //delete button on click
        jsPanel.create({
          headerTitle: 'Location Delete',
          theme: '#00205c',
          content: '<h2>Are you sure you want to delete location?</h2>'+
          '<button id="yes">Yes, I am sure.</button>'+
          '<button id="no">No, I am not sure.</button>'
        });
      });*/
      ////////////////////////////////////////////////

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

  delete from table ---> delete from point map
  modify interaction:
  edit button--> panel button "modify"-->onclick--->drag on map is active.

  august start email cc daniel ask if there is any empty place.


  */