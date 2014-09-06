var ObjectId = require('mongodb').ObjectID;

function Locations(ds) {
    this.db = ds.db;
    this.ds = ds;
    this.collection = this.db.collection('locations');
    this.GetLocations = function (stateId, callBack) {
        this.ds._Get(this.collection, function(err, locations) { 
            callBack(locations); 
        },{stateId:ObjectId(stateId)});
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
    this.GetPost = function(id, callBack) {
        this.ds._Get(this.collection, function(err, resp) {
            callBack(resp[0]);
            }, { _id : ObjectId(id)});
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
                   console.log("retrieved " + items);
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
            callBack(err,coll);
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