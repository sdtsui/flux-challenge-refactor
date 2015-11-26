let Sith = require('./Sith');
let __D = require('./constants');

class SithList {
  constructor(dashboard) {
    this._dashboard = dashboard;
    this._head = 0;
    this._tail = 4;
    this._storage = [];
    this._homeworlds = {};
    this._indices = {
      "0" : null,
      "1" : null,
      "2" : null,
      "3" : null,
      "4" : null,
    }
    this.addSithAt(__D.sidiousPath, 2);
  }
  //logic for fetching master/apprentice stays in here

  /**
   * Shifts the list `times` times in `dir` direction.
   * returns an array of removed Sith.
   * @param  {[type]} times [description]
   * @param  {[type]} dir   [description]
   * @return {[type]}       [description]
   */
  shiftList(times, dir) {
    let newIndices = {
      "0" : null,
      "1" : null,
      "2" : null,
      "3" : null,
      "4" : null,      
    };
    if (dir !== 'up' && dir !== 'down') {
      return new Error('2nd parameter must be "up" or "down"')
    };
    
    /**
     * Tech Debt: Use a mapping function.
     */
    for (var key in this._indices) {
      var maybeSith = this._indices[key];
      let num = parseInt(key);
      let newIndex = (dir === 'up') ? num += times : num -= times;
      if (num <= this._tail && num >= this._head) {
        //Is in range, we are keeping this sith.
        newIndices[num] = maybeSith;
        //must update index in maybeSith
        if (!!maybeSith) maybeSith.index = num;
      } else {
        //Is not in range, we are removing this sith.
        /**
         * Warn: Cancelling logic is coupled:: only happens here.
         */
        if(!!maybeSith){
          if (!!maybeSith.isPending()){
            maybeSith.cancel();
          }
        } else {
          //is null
        }
      }
    }
    this._indices = newIndices; //old data will be GC'd

    this._dashboard.renderList();
    this.resumeFetching();

    if(this.numberOfLoadedSith() < 1) {
      let dash = this._dashboard
      dash._ui.disableAll.bind(dash)();
    }
    /**
     * 
     */
    // Tech Debt or effective decoupling? Not returning the removed Sith.
    // return sithRemoved;
  }

  stopFetchingAll() {
    //cancellAll --- Not needed yet.
  }

  resumeFetching() {
    
    let found = this.findOneSith();
    this.fillRemainingSlots(found);
  }

  shiftListUp() {
    
    return this.shiftList(2, 'up');
  }

  shiftListDown() {
    
    return this.shiftList(2, 'down')
  }

  cancelAll() {
    this.mapOverIndices((data) => {
      data.cancel();
    });
  }

  addToTop() {

  }

  addToBottom() {

  }

  removeFromTop() {

  }

  removeFromBottom() {

  }

  hasHomeWorld(world) {
    return !!this._homeworlds[world];

  }

  mapOverIndices(cb) {
    let result = {};
    let obj = this._indices;
    for (var key in obj) {
      result[key] = cb(obj[key], key, obj);
    }
    return result;
  }

  toJSON() {
    //Warn: Not used anywhere.
    return JSON.stringify(this._indices);
  }

  //helperMethods:
  addSithAt(url, key) {
    let newSith = new Sith(url, key, this);
    this._indices[key] = newSith;
  }

  getSithAt(key) {
    return this._indices[key];
  }

  sithExistsAt(key) {
    //Warn: Not used anywhere.
    return !!(this._indices[key] instanceof Sith);
  }

  numberOfLoadedSith() {
    /**
     * tech debt: use _ filter
     * @type {Number}
     */
    let count = 0;
    let storage = this._indices;
    for (key in this._indices) {
      let maybeSith = storage[key];
      if (maybeSith instanceof Sith && maybeSith.hasData()){
        count++;
      };
    }
    return count;
  }

  resumeFetching() {
    let first = this.findOneSith();
    first.fillRemainingSlots(first);
  }

  /**
   * Iterates over _indices and returns the first Sith it finds.
   *
   * Used as a default param for fillRemainingSlots;
   * @return {[type]} [description]
   */
  findOneSith() {
    let obj = this._indices
    for (var key in obj) {
      let s = obj[key];
      if (s instanceof Sith && s.hasData()) {
        return obj[key];
        break;
      }
    }
  }

}

module.exports = SithList;