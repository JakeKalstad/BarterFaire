var ObjectId = require('mongodb').ObjectID;

function getFilters(filters) {
    var filterSet = {};
        filters = filters || [];
        filters.forEach(function(fil) {
            if(fil.Value) {
                filterSet[fil.Field] = fil.Value;
            }
        });
        return filterSet; 
}
function Locations(ds) {
    this.db = ds.db;
    this.ds = ds;
    this.collection = this.db.collection('locations');
    var self = this;
    this.GetLocations = function (stateReq, callBack) {  
       var filter = getFilters(stateReq.filters); 
        this.ds._Get(this.collection, function(err, locations) {
                callBack(locations);
            }, {stateId:ObjectId(stateReq.id)});
    };
}
function Messages(ds) {
    this.db = ds.db;
    this.ds = ds;
    this.collection = this.db.collection('messages');
    this.GetMsg = function(id, callBack) {
          this.ds._Get(this.collection, function(err, resp) {
            callBack(resp[0]);
            }, { _id : ObjectId(id)});
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
     this.GetOne = function(userId, callBack) {
        this.ds._Get(this.collection, function(err, resp) {
            callBack(resp[0]);
            }, { _id : ObjectId(userId)});
    };
}

function States(ds) {
    this.db = ds.db;
    this.ds = ds;
    this.collection = this.db.collection('states');
    this.GetOne = function(stateId, callBack) {
        this.ds._Get(this.collection, function(err, resp) {
            callBack(resp[0]);
            }, { _id : ObjectId(stateId)});
    };
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
    
    this.GetPostPerLocation = function(id, callBack, filterParams) {
        var filters = getFilters(filterParams);
        console.log('***********');
        console.log(filters);
        filters.LocationId = id.toString();
        console.log(filters);
        console.log('***********');
        self.ds.Categories.Get(function(err, cat) {
            var catHash = new Object();
            cat.forEach(function(cat) {
                catHash[cat._id] = cat.Name;
            });
            self.ds._Get(self.collection, function(err, resp) {
                resp.forEach(function(post) {
                    console.log('found post');
                   post.Category =  catHash[post.categoryId];
                });
                callBack(resp);
                }, filters);
        });
    };
}

function EntityBlessing(obj) {
    obj.Select = function(filter, selector, callBack) { obj.ds._Select(obj.collection, filter, selector, callBack); };
    obj.Index = function(indx, callBack) { obj.ds._Index(obj.collection, indx, callBack); };
    obj.Insert = function(data, callBack) { obj.ds._Insert(obj.collection, data, callBack); };
    obj.Get = function(callBack, filters) { obj.ds._Get(obj.collection, callBack, filters); };
    obj.Remove = function(data, callBack) { obj.ds._Remove(obj.collection, data, callBack); }; 
    obj.Save = function(data, callBack) { obj.ds._Save(obj.collection, data, callBack); }; 
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
    this.Messages = EntityBlessing(new Messages(this));
	
	function handleError(err) {
        if(!err) return;
        console.log(err);
	}
	
	this._Index = function(collection, indx, callBack) {
	       //collection.createIndex(indx, {w:1}, function(err, indexName) {callBack();});
	};
	
	this._Select = function (collection, filter, selector, callBack){
	   return collection.find(filter, selector).toArray(callBack);  
	};
	
	this._Insert = function(collection, obj, callBack) {
	    var onComplete = function(err, result) {
            handleError(err);           
            console.log("inserted ");
            console.log(result);
            callBack(result);
        };
		collection.insert(obj, onComplete);
	};
	
	this._Save = function(collection, itm, callBack) {
	   collection.save(itm, function(err, res) {
	      handleError(err);  
          console.log("updated " + res);
          callBack(); 
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
        collection.update({ _id : ObjectId(item)}, setter, function(err, coll) {
            handleError(err);
            callBack(err, coll); 
            console.log("updated " + coll);
        });
    };
}

module.exports = {
	GetDataService : function (db) {
		return new DataService(db);
	}
};