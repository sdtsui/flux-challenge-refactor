(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var SithList = require('./SithList');
var __D = require('./constants');
var Sith = require('./Sith');

var Dashboard = (function () {
  function Dashboard() {
    var entryPoint = arguments.length <= 0 || arguments[0] === undefined ? document.querySelector('.app-container') : arguments[0];

    _classCallCheck(this, Dashboard);

    this.$el = entryPoint;
    this.render();
    this.el_scrollable_list = document.querySelector('css-scrollable-list');
    this.el_slots = document.querySelector('.css-slots');
    this.el_obiwan = document.querySelector('.css-planet-monitor');
    this.el_top_button = document.querySelector('.css-button-up');
    this.el_btm_button = document.querySelector('.css-button-down');
    console.log("FIRST RENDER");

    this.sithlist = new SithList(this);
    this.obiwan = {}; //TBD

    console.log("PASSING IN", this.el_slots);
    console.log("PASSING IN", this.el_slots === this.el_slots);
    console.log("ESCOND RENDER");

    this.render(this.el_slots);

    //when events are fired that end a planet conflict, remember to re-trigger
    //'resumefetching'
  }

  _createClass(Dashboard, [{
    key: 'renderList',
    value: function renderList() {
      var fn = this.render.bind(this, this.el_slots);
      fn();
    }
  }, {
    key: 'renderObi',
    value: function renderObi() {
      var fn = this.render.bind(this, this.el_obiwan);
      fn();
    }
  }, {
    key: 'render',
    value: function render(node) {
      var templateString = undefined;
      var _HTML = undefined;
      if (node === undefined) {
        templateString = '<div class="css-root">\n        <h1 class="css-planet-monitor"></h1>\n        <section class="css-scrollable-list">\n          <ul class="css-slots">\n          </ul>\n          <div class="css-scroll-buttons">\n            <button class="css-button-up"></button>\n            <button class="css-button-down"></button>\n          </div>\n        </section>\n      </div>';
        document.querySelector('.app-container').innerHTML = templateString;
      } else if (node === this.el_slots) {
        //Tech Debt: May not always iterate in correct order.
        //May need to convert into an array and sort by index first.
        // let m = mappedData = this.sithlist.mapOverIndices((maybeSith) => {
        //   if (maybeSith && maybeSith instanceof Sith) {
        //     let hasData = maybeSith.hasData();
        //     let n = (hasData) ? maybeSith.data.name : '';
        //     let h = (hasData) ? 'Homeworld: ' + maybeSith.data.homeworld.name : '';
        //     return {
        //       n : n,
        //       h : h,
        //     };
        //   }
        // });
        //
        node.innerHTML = '';
        var m = this.sithlist._indices;
        for (var key in m) {
          var sith = m[key];
          var _name = !!sith && sith.hasData() ? sith.data.name : "";
          var homeworld = !!sith && sith.hasData() ? sith.data.homeworld.name : "";
          var newSlot = document.createElement('li');
          newSlot.innerHTML = '<h3>' + _name + '</h3><h6>' + homeworld + '</h6>';
          newSlot.classList.toggle('css-slot');
          console.log('appending data from key : ', key);
          node.appendChild(newSlot);
          // Tech Debt : Why wasn't this working?
          // _HTML += ('<li class="css-slot"><h3>' +
          //   name +
          //   '</h3><h6>' +
          //   homeworld +
          //   '</h6></li>');
        }
      } else if (node === this.el_obiwan) {} else if (node === this.el_top_button || node === this.el_btm_button) {}
      //render template onto DOM
      //case - node is el_sithList, rerender based on SithList
      //case - node is el_obiwan, rerender based on obiwan tracker
      //case - buttons --> toggle?
    }
  }]);

  return Dashboard;
})();

module.exports = Dashboard;

},{"./Sith":2,"./SithList":3,"./constants":5}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var __D = require('./constants');

var Sith = (function () {
  function Sith(url, index, sithlist) {
    _classCallCheck(this, Sith);

    if (index === undefined) return new Error('No index');
    this._sithlist = sithlist;
    this.data = undefined;
    this.url = url;
    this.pending = undefined;
    this.index = index;

    this.fetch(this.url, this.updateData);
  }

  _createClass(Sith, [{
    key: 'fetch',
    value: function fetch(url, cb) {
      this.pending = superagent.get(url).end(cb.bind(this));
    }
  }, {
    key: 'updateData',
    value: function updateData(err, res) {
      if (err) return; //fail silently
      var data = this.data = JSON.parse(res.text);
      console.log('DATA HAS ARRIVED');
      this._sithlist._homeworlds[data.homeworld.name] = this;
      //Tech Debt: Refactor reaching out later:
      //Problematic...
      var dash = this._sithlist._dashboard;
      dash.render(dash.el_slots);

      //call fetch again, with specific params to end or do nothing
      this.fillRemainingSlots(this);
    }
  }, {
    key: 'fillRemainingSlots',
    value: function fillRemainingSlots() {
      var sith = arguments.length <= 0 || arguments[0] === undefined ? this._sithlist.getFirstSith() : arguments[0];

      var maybeFetch = this.maybeFetch(sith);
      if (maybeFetch) this._sithlist.addSithAt(maybeFetch.url, maybeFetch.idx);
    }
  }, {
    key: 'maybeFetch',
    value: function maybeFetch(sith) {
      var apprentice = this.maybeFetchDown(sith);
      var master = this.maybeFetchUp(sith);
      return apprentice ? apprentice : master ? master : null;
    }

    // checks for what to request next: url+index, or null
  }, {
    key: 'maybeFetchDown',
    value: function maybeFetchDown(sith) {
      var next = this.next();
      var idx = sith.index;
      //base case: reach the bottom, can't fetch more
      if (idx === 4 || sith.data.master === null) {
        console.log('hitting base case down');
        return null;
      } else if (next instanceof Sith) {
        return sith.maybeFetchDown(next);
      } else {
        //found a sith with master, and not at bottom
        var fetchParams = { url: sith.data.master.url, idx: sith.index + 1 };
        return fetchParams;
      }
    }
  }, {
    key: 'maybeFetchUp',
    value: function maybeFetchUp(sith) {
      var prev = sith.prev();
      var idx = sith.index;
      //base case: reach the top, can't fetch more
      if (idx === 0 || sith.apprentice === null) {
        console.log('hitting base case down');
        return null;
      } else if (prev instanceof Sith) {
        return sith.maybeFetchUp(prev);
      } else {
        //found a sith with apprentice, and not at top
        var fetchParams = { url: sith.data.apprentice.url, idx: sith.index - 1 };
        return fetchParams;
      }
    }
  }, {
    key: 'next',
    value: function next() {
      return this._sithlist.getSithAt(this.index + 1);
    }
  }, {
    key: 'prev',
    value: function prev() {
      return this._sithlist.getSithAt(this.index - 1);
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      if (this.pending && this.data === undefined) this.pending.abort();
      this.pending = undefined;
    }

    //Helper Methods
  }, {
    key: 'isPending',
    value: function isPending() {
      //Warn: seems unnecessary
      return !!(this.data === undefined);
    }
  }, {
    key: 'hasData',
    value: function hasData() {
      //Warn: seems unnecessary, but used by SithList.
      return !!(this.data !== undefined);
    }
  }, {
    key: 'getHomeworld',
    value: function getHomeworld() {
      if (this.data.homeworld) return this.data.homeworld;
    }
  }, {
    key: 'getName',
    value: function getName() {
      if (this.data.name) return this.data.name;
    }
  }, {
    key: 'doNothing',
    value: function doNothing() {}
  }]);

  return Sith;
})();

module.exports = Sith;

},{"./constants":5}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Sith = require('./Sith');
var __D = require('./constants');

var SithList = (function () {
  function SithList(dashboard) {
    _classCallCheck(this, SithList);

    this._dashboard = dashboard;
    this._head = 0;
    this._tail = 4;
    this._storage = [];
    this._homeworlds = {};
    this._indices = {
      "0": null,
      "1": null,
      "2": null,
      "3": null,
      "4": null
    };
    this.addSithAt(__D.sidiousPath, 2);
  }

  //logic for fetching master/apprentice stays in here

  _createClass(SithList, [{
    key: 'shiftList',
    value: function shiftList(times, dir) {
      var newIndices = {
        "0": null,
        "1": null,
        "2": null,
        "3": null,
        "4": null
      };

      if (dir !== 'up' || dir !== 'down') return;
      new Error('2nd parameter must be "up" or "down"');

      /**
       * Tech Debt: Use mapOverIndices
       */

      for (key in this._indices) {
        var num = parseInt(key);
        var newIndex = dir === 'up' ? num += times : num -= times;
        if (num <= this._tail && num >= this._head) {
          newIndices[num] = this._indices[key];
          //must update index in Sith
          this._indices[key].index = num;
        } else {

          /**
           * Warn: Cancelling logic is closely coupled.
           */
          this._indices[key].cancel();
        }
      }

      this._indices = newIndices; //old data will be GC'd
    }
  }, {
    key: 'shiftListUp',
    value: function shiftListUp() {
      this.shiftList(2, 'up');
    }
  }, {
    key: 'shiftListDown',
    value: function shiftListDown() {
      this.shiftList(2, 'down');
    }
  }, {
    key: 'cancelAll',
    value: function cancelAll() {
      this.mapOverIndices(function (data) {
        data.cancel();
      });
    }
  }, {
    key: 'addToTop',
    value: function addToTop() {}
  }, {
    key: 'addToBottom',
    value: function addToBottom() {}
  }, {
    key: 'removeFromTop',
    value: function removeFromTop() {}
  }, {
    key: 'removeFromBottom',
    value: function removeFromBottom() {}
  }, {
    key: 'hasHomeWorld',
    value: function hasHomeWorld(world) {
      return !!this._homeworlds[world];
    }
  }, {
    key: 'mapOverIndices',
    value: function mapOverIndices(cb) {
      var result = {};
      var obj = this._indices;
      for (var key in obj) {
        result[key] = cb(obj[key], key, obj);
      }
      return result;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      //Warn: Not used anywhere.
      return JSON.stringify(this._indices);
    }

    //helperMethods:
  }, {
    key: 'addSithAt',
    value: function addSithAt(url, key) {
      var newSith = new Sith(url, key, this);
      this._indices[key] = newSith;
    }
  }, {
    key: 'getSithAt',
    value: function getSithAt(key) {
      return this._indices[key];
    }
  }, {
    key: 'sithExistsAt',
    value: function sithExistsAt(key) {
      //Warn: Not used anywhere.
      return !!(this._indices[key] instanceof Sith);
    }
  }, {
    key: 'getLength',
    value: function getLength() {
      // var count = 0;
      // for (keys in this._indices) {
      //   count++
      // }
      // return count;
      return Object.keys(this._indices).length;
    }
  }, {
    key: 'resumeFetching',
    value: function resumeFetching() {
      var first = this.getFirstSith();
      first.fillRemainingSlots(first);
    }

    /**
     * Iterates over _indices and returns the first Sith it finds.
     *
     * Used as a default param for fillRemainingSlots;
     * @return {[type]} [description]
     */
  }, {
    key: 'getFirstSith',
    value: function getFirstSith() {
      var obj = this._indices;
      for (var key in obj) {
        var s = obj[key];
        if (s instanceof Sith && s.data.hasData()) {
          return obj[key];
          break;
        }
      }
    }
  }]);

  return SithList;
})();

module.exports = SithList;

},{"./Sith":2,"./constants":5}],4:[function(require,module,exports){
'use strict';
// import * as __D from './constants';
// import * as Dashboard from './Dashboard';
// import Sith from './Sith';
// import SithList from './SithList';

var Dashboard = require('./Dashboard');
var Sith = require('./Sith');
var SithList = require('./SithList');
var __D = require('./constants');

var appContainer = document.querySelector('.app-container');
var dash = new Dashboard(appContainer);

},{"./Dashboard":1,"./Sith":2,"./SithList":3,"./constants":5}],5:[function(require,module,exports){
"use strict";

var __D = {
  sidiousPath: "http://localhost:3000/dark-jedis/3616",
  socketHost: "ws://localhost:4000"
};

module.exports = __D;

},{}]},{},[4])


//# sourceMappingURL=app.js.map
