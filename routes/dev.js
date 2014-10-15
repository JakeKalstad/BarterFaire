var express = require('express');
var http = require('http');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;

var states = [
    {
        "Name": "Alabama",
        "abbreviation": "AL"
    },
    {
        "Name": "Alaska",
        "abbreviation": "AK"
    },
   
    {
        "Name": "Arizona",
        "abbreviation": "AZ"
    },
    {
        "Name": "Arkansas",
        "abbreviation": "AR"
    },
    {
        "Name": "California",
        "abbreviation": "CA"
    },
    {
        "Name": "Colorado",
        "abbreviation": "CO"
    },
    {
        "Name": "Connecticut",
        "abbreviation": "CT"
    },
    {
        "Name": "Delaware",
        "abbreviation": "DE"
    },
    {
        "Name": "Florida",
        "abbreviation": "FL"
    },
    {
        "Name": "Georgia",
        "abbreviation": "GA"
    },
    {
        "Name": "Hawaii",
        "abbreviation": "HI"
    },
    {
        "Name": "Idaho",
        "abbreviation": "ID"
    },
    {
        "Name": "Illinois",
        "abbreviation": "IL"
    },
    {
        "Name": "Indiana",
        "abbreviation": "IN"
    },
    {
        "Name": "Iowa",
        "abbreviation": "IA"
    },
    {
        "Name": "Kansas",
        "abbreviation": "KS"
    },
    {
        "Name": "Kentucky",
        "abbreviation": "KY"
    },
    {
        "Name": "Louisiana",
        "abbreviation": "LA"
    },
    {
        "Name": "Maine",
        "abbreviation": "ME"
    },
    {
        "Name": "Maryland",
        "abbreviation": "MD"
    },
    {
        "Name": "Massachusetts",
        "abbreviation": "MA"
    },
    {
        "Name": "Michigan",
        "abbreviation": "MI"
    },
    {
        "Name": "Minnesota",
        "abbreviation": "MN"
    },
    {
        "Name": "Mississippi",
        "abbreviation": "MS"
    },
    {
        "Name": "Missouri",
        "abbreviation": "MO"
    },
    {
        "Name": "Montana",
        "abbreviation": "MT"
    },
    {
        "Name": "Nebraska",
        "abbreviation": "NE"
    },
    {
        "Name": "Nevada",
        "abbreviation": "NV"
    },
    {
        "Name": "New Hampshire",
        "abbreviation": "NH"
    },
    {
        "Name": "New Jersey",
        "abbreviation": "NJ"
    },
    {
        "Name": "New Mexico",
        "abbreviation": "NM"
    },
    {
        "Name": "New York",
        "abbreviation": "NY"
    },
    {
        "Name": "North Carolina",
        "abbreviation": "NC"
    },
    {
        "Name": "North Dakota",
        "abbreviation": "ND"
    },
     
    {
        "Name": "Ohio",
        "abbreviation": "OH"
    },
    {
        "Name": "Oklahoma",
        "abbreviation": "OK"
    },
    {
        "Name": "Oregon",
        "abbreviation": "OR"
    },
    {
        "Name": "Pennsylvania",
        "abbreviation": "PA"
    },
    {
        "Name": "Rhode Island",
        "abbreviation": "RI"
    },
    {
        "Name": "South Carolina",
        "abbreviation": "SC"
    },
    {
        "Name": "South Dakota",
        "abbreviation": "SD"
    },
    {
        "Name": "Tennessee",
        "abbreviation": "TN"
    },
    {
        "Name": "Texas",
        "abbreviation": "TX"
    },
    {
        "Name": "Utah",
        "abbreviation": "UT"
    },
    {
        "Name": "Vermont",
        "abbreviation": "VT"
    },
    {
        "Name": "Virginia",
        "abbreviation": "VA"
    },
    {
        "Name": "Washington",
        "abbreviation": "WA"
    },
    {
        "Name": "West Virginia",
        "abbreviation": "WV"
    },
    {
        "Name": "Wisconsin",
        "abbreviation": "WI"
    },
    {
        "Name": "Wyoming",
        "abbreviation": "WY"
    }
    /*
     * {
        "Name": "American Samoa",
        "abbreviation": "AS"
    },
    {
        "Name": "Virgin Islands",
        "abbreviation": "VI"
    },
    {
        "Name": "Federated States Of Micronesia",
        "abbreviation": "FM"
    },
    {
        "Name": "Palau",
        "abbreviation": "PW"
    },
    {
        "Name": "Puerto Rico",
        "abbreviation": "PR"
    },
    {
        "Name": "Guam",
        "abbreviation": "GU"
    },
    {
        "Name": "Marshall Islands",
        "abbreviation": "MH"
    },
    {
        "Name": "Northern Mariana Islands",
        "abbreviation": "MP"
    },
    */ 
];

var categories = [
    { Name : "Auto"},
    { Name : "Electronics"},
    { Name : "Community"},
    { Name : "Music"}
];

var popCount = 0;

function complete(res) {
    console.log(popCount);
    if(--popCount == 0)
        res.send({msg : 'complete!'});
}

function populate(coll, data, req, res, callback) {
    req.dataService._Remove(coll, {}, function(err, numberRemoved) { 
       console.log("Removed" + numberRemoved + " records from collection: " + coll);
       req.dataService._Insert(coll, data, function(result) { 
            if(callback) 
                callback(result); 
            complete(res);     
        });
    });
}

function getOption(stateAbv) {
    /*URL json example
      {
        "county_name": null,
        "description": null,
        "feat_class": "Civil",
        "feature_id": "38769",
        "fips_class": "H1",
        "fips_county_cd": "39",
        "full_county_name": null,
        "link_title": null,
        "url": "http://www.lanecounty.org/",
        "name": "Lane County",
        "primary_latitude": "43.91",
        "primary_longitude": "-122.83",
        "state_abbreviation": "OR",
        "state_name": "Oregon"
    }
    */
    return {
      host: 'http://api.sba.gov/geodata/county_links_for_state_of/' + stateAbv + ".json",
      path: '/', 
    };
}

function populateLocations(states, req, res) { 
    var urls = new Array();
    var stateCount = 0;
    var locationObjects = new Array();
    var callback = function(response, stateAbv) {
      var str = '';
      response.on('data', function (chunk) {
        str += chunk;
      });
      response.on('end', function () {
              if(str.length > 2 && str[0] != '<') {
                  stateId = 0;
                  for(var i =0; i<states.length; i++) {
                    if(states[i].abbreviation == stateAbv){                 
                           stateId = states[i]._id;
                           break;
                    }
                  }
                  
                  var obj = JSON.parse(str);
                  obj.forEach(function(itm) {
                  locationObjects.push({
                          stateId : stateId,
                          Name : itm.name, 
                          fips_class : itm.fips_class, 
                          lat : itm.primary_latitude,
                          lng : itm.primary_longitude,
                          feat_class : itm.feat_class
                      }); 
                  });
              }
              if(--stateCount == 0) {  
                  if(locationObjects.length > 0){
                      console.log("LOCATION OBJECT SHIT:::");
                      console.log(locationObjects[0]); 
                      console.log(":::LOCATION OBJECT SHIT");
                      req.dataService.Locations.Insert(locationObjects, function(err1, result) {
                                complete(res); 
                        });
                    }
                  else {
                      complete(res);
                  }
              }
      });
    };
    
    states.forEach(function(itm) {
        stateCount++;
        var option = getOption(itm.abbreviation);  
        var req = http.request(option.host, function(response) { 
            callback(response, itm.abbreviation); 
        });
        req.end();
    });     
}

router.post('/seed_posts', function(req, res) {
    var posts = [];
    var categories = [];
    var locations = [];
    req.dataService.Categories.Select({}, {'_id': true}, function(err, results) {
        categories = results;                                                       // Oregon state ID on my box, sorry for the hax.
        req.dataService.Locations.Select({stateId : ObjectId("540be74b571ba917298fc729")}, {'_id': true}, function(err, results) {
            locations = results;
            var categoryMax = categories.length; 
            var locationsMax = locations.length;
            var catIndx = 0;
            var locIndx = 0;
            for(var i=0; i<50000; i++) {
                if(++catIndx == categoryMax)
                    catIndx = 0;
                if(++locIndx == locationsMax)
                    locIndx = 0;
                posts.push({
                    Title : "Test Post #" + i,
                    Body : "###Test Post Body ###" + i,
                    LocationId : locations[locIndx]._id,
                    categoryId : categories[catIndx]._id,
                    imageFiles : ['down.png', 'bullet.png', 'open-iconic-master/account-login.png']
                });
            }
            req.dataService.Posts.Insert(posts, function(result) {
                res.send({success:true});       
            });
        });
    });  
});

router.post('/seed', function(req,res) { 
    popCount++; 
    req.dataService.Posts.RemoveAll();
     
    req.dataService.Locations.Remove({}, function(err, numberRemoved) { 
        console.log("removed locations");
        populate(req.dataService.States.collection, states, req, res, function(result) { 
            popCount++; 
            populateLocations(result, req, res);
        });
        popCount++; 
        populate(req.dataService.Categories.collection, categories, req, res);
    });
});

module.exports = router;