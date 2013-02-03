module.exports=function(){

	// Syntactically friendly while-loop dressed up as a for-loop
	var nodeLoop = function(execThis, callBack){
		var self = this,
		    len = self.length,
		    slen = len - 1,
		     _callBack = (callBack) ? callBack : function(){};
		while (len-- || _callBack()){
		    (function(){
		        var i = slen - len;
			    execThis(self[i], i)
			})()
		}
	}

	global.Array.prototype.loopy=nodeLoop;
	var removeKey = function(str){
		var self = this.slice(0),
			_keys = str.split(" ");
		self.loopy(
			function(x, i){
				self[i] = JSON.parse(JSON.stringify(x));
			},
			function(){
				var removeKeys = function(x){
					_keys.loopy(function(_str){
						if (x[_str] || x[_str] == 0) delete x[_str];
					})
					for (key in x){
						if (x[key] instanceof Object) removeKeys(x[key]);
					}
				}
				self.loopy(
					function(z, y){
						removeKeys(self[y])
					}
				)
			}
		)
		if (self.length === 1){
			return self[0];
		} else {
			return self;
		}
	}
	var checkProp = function(prop, val){
		var present = false;
		this.loopy(
			function(x){
				if (x[prop] === val) present = x;
			}
		)
		return present;
	}
	global.Array.prototype.removeKey=removeKey;
	global.Array.prototype.checkProp=checkProp;

	var queryMethods = {
	// query a single document, shorthand
		justOne : function(query, execute, failure){
			var handlingThings = function(err,doc){
				if (err) throw err;
				if (doc !== null){
					execute(doc);
				} else {
					if (failure) failure();
				}
			}
			if (query instanceof Array){
				this.findOne(query[0]).select(query[1]).exec(handlingThings);
			} else if (query instanceof Object){
				this.findOne(query, handlingThings)
			}
		},
		// query multiple documents, shorthand
		moreThanOne : function(query, execute, failure){
			var handlingThings = function(err,docs){
				if (err) throw err;
				if (docs !== null && docs.length > 0){
					// if (docs.length === 1) docs = [docs]
					execute(docs)
				} else {
					if (failure) failure();
				}
			}
			if (query instanceof Array){
				this.find(query[0]).select(query[1]).exec(handlingThings);
			} else if (query instanceof Object){
				this.find(query, handlingThings)
			}
		},
		newDoc : function(blob, callback){
			var nD = new this();
			for (key in blob){
				(function(){
					var k = key;
					nD[k] = blob[k];
				})()
			}
			nD.save(function(err,doc){
				if (err){
					throw err;
				} else {
					if (callback) callback(doc);
				}
			})
		},
		changeDoc : function(query, blob, callback, option){
			this.findOne(query, function(err,doc){
				if (err) throw err;
				if (!option){
					for (key in blob){
						(function(){
							doc[key] = blob[key]
						})()
					}
				} else if (option == "addVals"){
					for (key in blob){
						(function(){
							var k = key;
							doc[k] += blob[k]
						})()
					}
				} else if (option == "addValsNested"){
					for (key in blob){
						(function(){
							var k = key.split(".");
							if (!doc[k[0]]) doc[k[0]] = 0;
							doc[k[0]][k[1]] += parseInt(blob[key])
						})()
					}
				} else {
					doc[blob["field"]].push(blob.addition)
				}
				doc.save(function(err,doc){
					if (err) throw err;
					if (callback) callback(doc)
				})
			})
		}
	}

	// queryModels function, returns mongoose models in shorthand with methods attached
	global.qM = {
	//	State : mongoose.model('State'),
	//	Donation : mongoose.model('Donation')
	}
	for (key in qM){
		qM[key].getOne=queryMethods.justOne;
		qM[key].getAll=queryMethods.moreThanOne;
		qM[key].new=queryMethods.newDoc;
		qM[key].reSave=queryMethods.changeDoc;
	}

	global.collectData = function(req, callback){
		var _data = '';
		req.on('data', function(data){
			_data += data;
		});
		req.on('end', function(){
			if (_data.substring(0,1) === "{"){
				for (var i=0,len=_data.length;i<len;i++){
					if (_data.substring(i,i+2) === "}{"){
						_data = _data.substring(0,i+1)
						break;
					}
				}
			}
			if (_data === "") callback({});
			var data = JSON.parse(_data);
			callback(data);
		});
	}

	global.sendJSON = function(res, obj){
		res.write(JSON.stringify(obj))
		res.end();
	}

	global.relativeTime = function(t, bypass){
		if (t === 0) return "Never"
		var now = (new Date().getTime());
		var diff = now - t;
		var secDiff = 1000,
			minDiff = 60000,
			hrDiff = 3600000,
			dayDiff = 86400000;
		if (diff < dayDiff && !bypass){
			if (diff < hrDiff){
				if (diff < minDiff){
					return Math.round(diff / secDiff) + "s ago"
				} else {
					return Math.round(diff / minDiff) + "m ago"
				}
			} else {
				return Math.round(diff / hrDiff) + "h ago"
			}
		} else {
			var jt = new Date(t);
			return (jt.getMonth() + 1) + '/' + jt.getDate() + '/' + jt.getFullYear()
		}
	};


	var parseXlsx = require('excel');


	//parseXlsx('./donations.xlsx', function(data) {
	//	for (var _j=1,len=data[0].length;_j<len;_j+=2){
	//		(function(){
	//		var j = _j;
	//		for (var _i=1,_len=data.length;_i<_len;_i++){
	//			(function(){
	//				var i = _i;
	//				qM['Donation'].new({
	//					year : data[0][j],
	//					amount : data[i][j],
	//					state : data[i][j-1]
	//				}, function(doc){
	//					console.log(doc)
	//				})
	//				//console.log(data[0][j] + " : " + data[i][j-1] + " : " + data[i][j])
	//			})()
	//		}
	//		})();
	//	}
	//});

}