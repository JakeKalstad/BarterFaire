var ObjectId = require('mongodb').ObjectID;

function Locations(ds) {
    this.db = ds.db;
    this.ds = ds;
    this.collection = this.db.collection('locations');
    var self = this;
    this.GetLocations = function (stateId, callBack) {
        console.log('Get Locations');
        this.ds._Get(this.collection, function(err, locations) {
            console.log('Retrieved Locations');
            self.ds.Posts.Get(function(err, posts) {  
                console.log('Retrieved Posts');              
                var countHash = new Object();
                posts.forEach(function(post) { 
                    if(countHash[post.LocationId]){
                        countHash[post.LocationId]++;
                        console.log(post.LocationId);
                    }
                    else countHash[post.LocationId] = 1;
                });
                locations.forEach(function(loc){
                    console.log(countHash[loc._id]);
                   loc.Count = countHash[loc._id] || 0; 
                });
                callBack(locations); 
            });
        }, {stateId:ObjectId(stateId)});
    };
}

function Categories(ds) {
    this.db = ds.db;
    this.ds = ds;
    this.collection = this.db.collection('categories');
}
function Users(ds) {
    this.db = ds.db;
    this.ds = ds;
    this.collection = this.db.collection('users');
} 
function States(ds) {
    this.db = ds.db;
    this.ds = ds;
    this.collection = this.db.collection('states');
}

function Posts(ds) {
    this.db = ds.db;
    this.ds = ds;
    this.collection = this.db.collection('posts');
    var self = this;
    this.RemoveAll = function() {
         this.ds._Remove(this.collection, {}, function(err, resp) {});
    };
    this.GetPost = function(id, callBack) {
        this.ds._Get(this.collection, function(err, resp) {
            callBack(resp[0]);
            }, { _id : ObjectId(id)});
    };
    
    this.GetPostPerLocation = function(id, callBack) {
        self .ds.Categories.Get(function(err, cat){
            var catHash = new Object();
            cat.forEach(function(cat) {
                catHash[cat._id] = cat.Name;
            });
            self.ds._Get(self.collection, function(err, resp) {
                resp.forEach(function(post) {
                   post.Category =  catHash[post.categoryId];
                });
                callBack(resp);
                }, { LocationId: id.toString()});
        });
    };
}

function EntityBlessing(obj) {
    obj.Index = function(indx, callBack) { obj.ds._Index(obj.collection, indx, callBack); };
    obj.Insert = function(data, callBack) { obj.ds._Insert(obj.collection, data, callBack); };
    obj.Get = function(callBack, filters) { obj.ds._Get(obj.collection, callBack, filters); };
    obj.Remove = function(data, callBack) { obj.ds._Remove(obj.collection, data, callBack); }; 
    obj.Update = function(item, setter, callBack) { obj.ds._Update(obj.collection, item, setter, callBack); };
    return obj;     
}

function DataService(db) {
	this.db = db;
	this.Locations = EntityBlessing(new Locations(this));
	this.Categories = EntityBlessing(new Categories(this));
	this.Users = EntityBlessing(new Users(this));
	this.States = EntityBlessing(new States(this));
	this.Posts = EntityBlessing(new Posts(this));
	
	function handleError(err) {
        if(!err) return;
        console.log(err);
	}
	
	this._Index = function(collection, indx, callBack) {
	       //collection.createIndex(indx, {w:1}, function(err, indexName) {callBack();});
	};
	
	this._Insert = function(collection, obj, callBack) {
		collection.insert(obj, function(err, result) {
            handleError(err);        	
        	console.log("inserted ");
        	console.log(result);
            callBack(result);
  		});
	};
	
	this._Get = function(collection, callBack, filters) {
    	   collection.find(filters).toArray(function (err, items) {
               handleError(err);  
    	       if(items && items.length > 0) {
    	           callBack(err, items);
                   console.log("retrieved ");
                   console.log(items);
    	       }
    	       else {
    	           console.log('no items retrieved from ' + collection);
    	           callBack(err, new Array());
    	       }
    	   });
    };
    
    this._Remove = function(collection, obj, callBack) {
        collection.remove(obj, function(err, coll) {
            handleError(err);
            callBack(err, coll);
            console.log("removed " + coll);
        });
    };
    
    this._Update = function(collection, item, setter, callBack) {
        collection.update(item, setter, function(err, coll) {
            handleError(err);
            callBack(err,coll); 
            console.log("updated " + coll);
        });
    };
}

module.exports = {
	GetDataService : function (db) {
		return new DataService(db);
	}
};