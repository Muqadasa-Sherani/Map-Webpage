using Microsoft.AspNetCore.Mvc;
using postgresConnectinContext.Models;

namespace postgresConnectinContext.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LocationtController : ControllerBase
    {
        private readonly TestContext _context;
        string SuccessMessage = "The function worked successfully";
        string ErrorMessage = "The function has failed!";
        public LocationtController(TestContext context)
        {
            _context = context;
        }

        [HttpGet]
        public List<Location> GetAll()
        {
            return _context.Locations.ToList();
        }

        [HttpGet("{_id}")]
        public Response GetById(int _id)
        {
            Response _response = new Response();
            var _location = _context.Locations.Find(_id);
            if (_location != null)
            {
                _response.Status = 1;
                _response.Message = SuccessMessage;
                _response.Result = _location;
            }
            else
            {
                _response.Status = 0;
                _response.Message = ErrorMessage;
                _response.Result = null;
            }
            return _response;

        }

        [HttpPost]
        public Response Add(Location _location)
        {
            Response _response = new Response();
            //var _locationId = _context.Locations.Find(_location.Id);
            _context.Locations.Add(_location);
            _context.SaveChanges();

            _response.Status = 1;
            _response.Message = SuccessMessage;
            _response.Result = _location;

            return _response;
        }

        [HttpPut]
        public Response Update(Location _location)
        {
            var oldLocation = _context.Locations.Find(_location.Id);

            Response _response = new Response();

            if (oldLocation != null)
            {
                if (!string.IsNullOrEmpty(_location.Name)) {
                    oldLocation.Name = _location.Name;
                }

                if (_location.X != 0)
                {
                    oldLocation.X = _location.X;
                }

                if (_location.Y != 0)
                {
                    oldLocation.Y = _location.Y;
                }

                _context.Locations.Update(oldLocation);
                _context.SaveChanges();

                _response.Status = 1;
                _response.Message = SuccessMessage;
                _response.Result = oldLocation;
            }
            else
            {
                _response.Status = 0;
                _response.Message = ErrorMessage;
                _response.Result = oldLocation;
            }
            return _response;
        }


        [HttpDelete]
        public Response Delete(Location _location)
        {
            Response _response = new Response();
            //var _templocation = _context.Locations.Find(_location.Id);

            if (_location != null)
            {
                _context.Remove(_location);

                _response.Status = 1;
                _response.Message = SuccessMessage;
                _response.Result = _location;
            }
            else
            {
                _response.Status = 0;
                _response.Message = ErrorMessage;
                _response.Result = _location;
            }

            _context.SaveChanges();
            return _response;
        }

        //LINQ to SQL queries ----------------- 28.06.2022/tuesday
        //get by name
        [HttpGet("_name")]
        public Response GetByName(string _name)
        {
            Response _response = new Response();

            var queryLocation = from _location in _context.Locations where _location.Name == _name select _location;

            if (queryLocation.Count() == 0)
            {
                _response.Status = 0;
                _response.Message = "no such name exist!";
                _response.Result = null;
            }
            else
            {
                _response.Status = 1;
                _response.Message = SuccessMessage;
                _response.Result = queryLocation;
            }

            return _response;

        }

        //get by x and y values
        [HttpGet("coordinates")]
        public Response GetByXandY(double _x, double _y)
        {
            Response _response = new Response();

            var queryLocation = from _location in _context.Locations where _location.X == _x && _location.Y == _y select _location;

            if (queryLocation.Count() == 0)
            {
                _response.Status = 0;
                _response.Message = "no such coordinates exist!";
                _response.Result = null;
            }
            else
            {
                _response.Status = 1;
                _response.Message = SuccessMessage;
                _response.Result = queryLocation;
            }

            return _response;

        }

        //post attribute validation---> if name, x and y are the same of the then that location is not added.
        [HttpPost("improved")]
        public Response AddByNewValue([FromBody] Location _location)
        {
            Response _response = new Response(); 

            var queryLocationName = from _l in _context.Locations where _l.Name == _location.Name && _l.X == _location.X && _l.Y == _location.Y select _l;
            
            if (!queryLocationName.Any())
            {
                _context.Locations.Add(_location);
                _context.SaveChanges();
                _response.Status= 1;
                _response.Message= _location.Name+" is added to the database.";
                _response.Result= _location;
            }
            else
            {
                _response.Status= 0;
                _response.Message = _location.Name + " is already existing in the database.";
                _response.Result=_location;
            }

            return _response;
        }

    }
}