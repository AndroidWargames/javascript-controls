// creates a knob object (requires jquery)
// id will be id of the div of the knob, html id naming rules apply
// there will be a parent div prefixed by 'box' and a child div prefixed by 'pointer'.
// callback function should have one argument, which will be the knob value
// cont is whether or not the knob is continuous
// knob.html must be added somewhere to the html body before running knob.init()
// the continuous variable will default to false
function knob(id, callback, continuous) {
  //declare default values
  var parent = this;
  this.callback = callback;
  this.knobLvl = 0;
  this.id = id;
  this.knobIncrementAmt = (continuous ? 2 : 3);
  this.knobMin = 0;
  this.knobMax = 100;
  this.continuous = continuous || false;

  //creates html for div
  this.html = "<div id='box" + id + "'>"
  this.html += "<div id='" + id + "'>"
  this.html += "<div id='pointer" + id + "'></div></div></div>"

  //define CSS for attributes, scales pretty
  this.applyCSS = function(size) {
    var id = parent.id;
    var pid = '#pointer' + id;
    $('#box' + id).css("user-select","false");
    $("#" + id).css("cursor","pointer");
    $("#" + id).css("width",String(size) + 'px');
    $("#" + id).css("height",String(size) + 'px');
    $("#" + id).css("border-radius","50%");
    $("#" + id).css("position","relative");
    $("#" + id).css("background","#252525");
    $("#" + id).css("margin", String(size/8 + 1) + 'px auto');
    $(pid).css('position', 'absolute');
    $(pid).css('top', String(size/8 + 1) + 'px');
    $(pid).css('left', String(size/2 - size/40) + 'px');
    $(pid).css("border-radius",String(size/20));
    $(pid).css('background', '#EEE');
    $(pid).css('width', String(size/20) + 'px');
    $(pid).css('height', String(size/5) + 'px');
    parent.updateKnob(parent.id);
  }

  this.init = function(size) {

    //updates knob and executes callback;
    parent.updateKnob = function(id){
      var degs = 0;
      if (parent.continuous){
        degs = ((this.knobLvl * 3.6));
      } else {
        degs = ((this.knobLvl * 2.7) - 135);
      }
      document.getElementById(id).style.transform = "rotate(" + degs + "deg)";
      callback(this.knobLvl);
    }

    // on mouseup stop rotating the current knob
    $(document).mouseup(function() {
      $(document).off("mousemove");
    });

    $('#' + this.id).mousedown(function(e) {
      e.preventDefault;
      var mouseXinit = e.clientX;
      var mouseYinit = e.clientY;
      $(document).mousemove(function(event) {

        var mouseXnew = event.pageX,
            mouseYnew = event.pageY;

        if (parent.continuous){ //continuous
          if (mouseYnew > mouseYinit) {
            parent.knobLvl -= parent.knobIncrementAmt;
          } else {
            parent.knobLvl += parent.knobIncrementAmt;
          }
          parent.knobLvl %= parent.knobMax;
        } else { //non-coninuous
          if (mouseYnew > mouseYinit) {
            if (parent.knobLvl > parent.knobMin) {
              parent.knobLvl -= parent.knobIncrementAmt;
            }
          }
          else if (mouseYnew < mouseYinit) {
            if (parent.knobLvl < parent.knobMax) {
              parent.knobLvl += parent.knobIncrementAmt;
            }
          }
        }
        mouseYinit = mouseYnew
        if (parent.knobLvl < 0){
          parent.knobLvl += 100;
        }
        parent.updateKnob(parent.id);
      });
    });
    //build knob and update value
    parent.applyCSS(size);
    parent.updateKnob(parent.id);
  }

}
