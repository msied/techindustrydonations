var shade = function(perc){
  var b = Math.round(perc * 200);
  var r = 200 - b;
  return "rgba(0,50,100," + Math.sqrt(perc / 2) + ")";
}

var _data = JSON.parse($("state_data").getAttribute("rel"))
var rendered, stateActive;

var parseDollarCommas = function(nStr){
  nStr += '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = (x[1].length > 1) ? x[1] : x[1] + "0";
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + "." + x2;
}


var renderMapColors = function(data){
  data.sort(function(a,b){return b.percent - a.percent})
  var upperBound = data[0].amount, lowerBound = data[data.length-1].amount;
  var total = 0;
  data.loopy(function(state, i){
    total += state.amount;
    data[i].pc = (state.amount - lowerBound) / upperBound;
    var elem = $(state.state);
    if (elem){
      var k = shade((data[i].pc + 0.015) * 30);
      elem.style.cursor = "pointer";
      elem.setAttribute("fill", k);
      elem.orig = k;
      for (key in state) elem[key] = state[key];
      elem.style.WebkitTransition = elem.style.transition = "0.5s all linear"
      elem.onmouseover=function(){
        this.onmousemove=function(e){
          var x = e.clientX, y = e.clientY;
          if (this !== stateActive){
            if (rendered) rendered.removeMe();
            $("state_data").dropIn({
              class : "detail",
              text : "[" + state.state + "] $" + state.amount + " (" + (Math.round(state.percent * 10000) / 100) + "%)",
              self : function(d){
                d.style.marginLeft = x - 25 + "px";
                d.style.marginTop = y - 70 + "px";
                rendered = d;
              }
            })
          } else {
            console.log(rendered)
            rendered.style.marginLeft = x - 25 + "px";
            rendered.style.marginTop = y - 70 + "px";
          }
          stateActive = this;
        }
        this.setAttribute("fill", "#222")
        this.onmouseout=function(){
       //   if (rendered) rendered.removeMe();
          this.setAttribute("fill", this.orig)
        }
      }
    }
  }, function(){
    $("amount").innerHTML = "$" + parseDollarCommas(Math.round(total * 100) / 100);
  });
}
renderMapColors(_data["2005"]);

var redata = [],
    checkyearArr = [];

for (key in _data){
  redata.push({ year : key, data : _data[key]})
}
redata.sort(function(a,b){return parseInt(a.year) - parseInt(b.year)})

var segments = redata.length;
redata.loopy(function(year, i){
  checkyearArr.push({year : year.year, min : ($("slider").offsetWidth / segments) * i, max : ($("slider").offsetWidth / segments) * (i+1)})
//  console.log("min: " + ($("slider").offsetWidth / segments) * i + ", max: " + ($("slider").offsetWidth / segments) * (i+1))
})

$("btn").onmousedown=function(){
  $("btn").onclick=function(){
    document.body.onmousemove=function(){}
  }
  document.body.onclick=function(){
    document.body.onmousemove=function(){}
  }
  document.body.onmousemove=function(e){
    var x = e.clientX - $("slider").offsetLeft - ($("btn").offsetWidth / 2);
   // x = (x < $("slider").parentNode.offsetLeft) ? $("slider").parentNode.offsetLeft : x;
    x = (x >= 0) ? x : 0;
    x = (x > $("slider").offsetWidth - $("btn").offsetWidth) ? $("slider").offsetWidth - $("btn").offsetWidth : x;
    $("btn").style.marginLeft = x + "px";
    checkyearArr.loopy(function(yearOb){
      if (x + (1/2 * $("btn").offsetWidth) >= yearOb.min && x + (1/2 * $("btn").offsetWidth) < yearOb.max){
        $("year").innerHTML = yearOb.year + "-" + (parseInt(yearOb.year) + 1);
        renderMapColors(_data[yearOb.year]);
      }
    })
    $("btn").onmouseout=function(){
      document.body.onmousemove=function(){}
    }
  }
}