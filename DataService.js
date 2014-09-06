function DataService(db) {
	this.db = db;
	
	function handleError(err) {
        if(!err) return;
        console.log(err);
	}
	
	this._coll = function(collection) { return this.db.collection(collection); };
	this.Insert = function(collection, obj, callBack) {
		this._coll(collection).insert(obj, function(err, result) {
            handleError(err);
        	callBack(err,result);
        	console.log("inserted " + result);
  		});
	};
	
	this.Get = function(collection, callBack, filters) {
    	   this._coll(collection).find(filters || {}).toArray(function (err, items) {
                handleError(err); 
    	       if(items) {
    	           callBack(err, items);
                   console.log("retrieved " + items);
    	       }
    	       else {
    	           console.log('no items retrieved from ' + collection);
    	           callBack(err, new Array());
    	       }
    	   });
    };
    
    this.Remove = function(collection, obj, callBack) {
        this._coll(collection).remove(obj, function(err, coll) {
            handleError(err);
            callBack(err,coll);
            console.log("removed " + coll);
        });
    };
    
    this.Update = function(collection, item, setter, callBack) {
        this._coll(collection).update(item, setter, function(err, coll) {
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