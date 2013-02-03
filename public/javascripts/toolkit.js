var toolkit = {
	$ : function(elem){
		return (document.getElementById(elem)) ? document.getElementById(elem) : document.createElement("div");
	},
	nodeLoop : function(execThis, callBack){
		var self = this,
		    len = self.length,
		    slen = len - 1,
		     _callBack = (callBack) ? callBack : function(){};
		while (len-- || _callBack()){
	        var i = slen - len;
		    if (self[i]) execThis(self[i], i)
		}
	},
	ajaxPost : function(location, data, callBack){
		var req_ = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		req_.onreadystatechange=function(){
			if (req_.readyState==4 && req_.status==200){
				var data_ = req_.responseText.replace(/\|PF%/g, " ");
				callBack(data_);
			}
		}
		req_.open("POST", location, true)
		req_.send(data);
	},
	ajaxGet : function(location, callBack){
		if (penfm.ajaxPending) penfm.ajaxPending.abort();
		var req_ = penfm.ajaxPending = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		req_.onreadystatechange=function(){
			if (req_.readyState==4 && req_.status==200){
				penfm.ajaxPending = undefined;
				var data_ = req_.responseText.replace(/\|PF%/g, " ");
				callBack(data_);
			}
		}
		req_.open("GET", location, true)
		req_.send(null);
	},
	trimmy : function(){
		return this.replace(/^\s+|\s+$/g,"");
	},
	checkProp : function(prop, val){
		var present = false;
		this.loopy(
			function(x){
				if (x[prop] === val) present = x;
			}
		)
		return present;
	},
	orZero : function(int, option){
		return (parseInt(int) === 0) ? ((!option) ? "" : "0") : int;
	},
	_trim : function(str, len){
		if (str.length > len){
			return (str.substring(0, len) + "...")
		} else {
			return str;
		}
	},
	indexOfChild : function(elem){
		var parent = elem.parentNode,
			l =	parent.children.length;
		while (l--){
			if (parent.children[l] === elem) return l;
		}
	},
	relativeTime : function(t){
		if (t === 0) return "Never"
		var now = (new Date().getTime());
		var diff = now - t;
		var secDiff = 1000,
			minDiff = 60000,
			hrDiff = 3600000,
			dayDiff = 86400000;
		if (diff < dayDiff){
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
	},
	hideShow : {
		hideIt : function(){
			this.style.display = "none";
		},
		showIt : function(){
			this.style.display = "block";
		}
	},
	removeMe : function(callback){
			if (this.parentNode) this.parentNode.removeChild(this)
	},
	genre : function(inp){
		var mapping = {
			Fiction : 1,
			Fantasy : 2,
			Legend : 3,
			"Historical Fiction" : 4,
			Mystery : 5,
			Romance : 6,
			"Science Fiction" : 7,
			"Fan Fiction" : 8,
			"Horror" : 9,
			"Non-fiction" : 10,
			"Other" : 11
		}
		if (mapping[inp]) return mapping[inp];
		for (key in mapping){
			if (mapping[key] === inp){
				return key;
			}
		}
	},
	coverUrl : function(story_doc){
		if (story_doc.cover && story_doc.cover.custom === true){
			return (story_doc.cover.url + "/convert?w=200&crop=fit")
		} else {
			return ("/images/covers/_default_" + genre(story_doc.genre).toLowerCase().replace(/ /g,"") + ".png")
		}
	},
	dropIn : function(_json, option0, option1){
		var elem = document.createElement(_json.tag || "div");
		if (_json.class) elem.setAttribute("class", _json.class);
		if (_json.id) elem.setAttribute("id", _json.id);
		if(_json.text) elem.innerHTML = _json.text;
		if(_json.type) elem.setAttribute("type", _json.type);
		if (_json.style){
			for (key in _json.style){
				elem.style[key] = _json.style[key]
			}
		}
		if (!option0 && !option1){
			this.appendChild(elem);
		} else if (option0 && !option1){
			this.insertBefore(elem, this.children[0])
		} else if (!option0 && option1){
			this.insertBefore(elem, option1.nextSibling)
		}
		if(_json.self) _json.self(elem);
	},
	fireWrap : function(ref, callback, option){
		ref.on((!option) ? 'value' : option, function(snap){
			if (ref.active || (option)){
				callback(snap.val())
			} else {
				ref.active = true;
			}
		})
	},
	init : function(){
		Array.prototype.loopy=this.nodeLoop;
		NodeList.prototype.loopy=this.nodeLoop;
		HTMLCollection.prototype.loopy=this.nodeLoop;
		Array.prototype.checkProp=this.checkProp;
		Node.prototype.loopy=this.nodeLoop;
		String.prototype.loopy=this.nodeLoop;
		Node.prototype.hide=this.hideShow.hideIt;
		Node.prototype.show=this.hideShow.showIt;
		Node.prototype.dropIn=this.dropIn;
		String.prototype.trimmy=this.trimmy;
		Node.prototype.removeMe=this.removeMe;
		window["$"] = this["$"];
		window["relativeTime"] = this["relativeTime"];
		window["ajaxPost"] = this["ajaxPost"];
		window["ajaxGet"] = this["ajaxGet"];
		window["fireWrap"] = this["fireWrap"];
		window["orZero"] = this["orZero"];
		window["genre"] = this["genre"];
		window["coverUrl"] = this["coverUrl"];
		window["_trim"] = this["_trim"];
		window["indexOfChild"] = this["indexOfChild"];
	}
}
toolkit.init();