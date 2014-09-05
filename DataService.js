function DataService(db) {
	this.db = db;
	this.Insert = function(collection, obj, success, error) {
		db.collection(collection).insert(obj, function(err, result) {
        	res.send((err === null) ? { msg: '' } : { msg: err });
  		});
	};
}

module.exports = {
	GetDataService : function (db) {
		return new DataService(db);
	}
};