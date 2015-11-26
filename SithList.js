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
    this.addSithAt(new Sith(__D.sidiousPath), 2);
  }
  //logic for fetching master/apprentice stays in here

  shiftList(times, dir) {
    let newIndices = {
      "0" : null,
      "1" : null,
      "2" : null,
      "3" : null,
      "4" : null,      
    };

    if (dir !== 'up' || dir !== 'down') return 
      new Error('2nd parameter must be "up" or "down"');
    
    /**
     * Tech Debt: Use mapOverIndices
     */

    for (key in this._indices) {
      let num = parseInt(key);
      let newIndex = (dir === 'up') ? num += times : num -= times;
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

  shiftListUp() {
    this.shiftList(2, 'up');
  }

  shiftListDown() {
    this.shiftList(2, 'down')
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
  addSithAt(sith, key) {
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

  getLength() {
    // var count = 0;
    // for (keys in this._indices) {
    //   count++
    // }
    // return count;
    return Object.keys(this._indices).length;
  }

  resumeFetching() {
    let first = this.getFirstSith()
    first.fillRemainingSlots(first);
  }

  /**
   * Iterates over _indices and returns the first Sith it finds.
   *
   * Used as a default param for fillRemainingSlots;
   * @return {[type]} [description]
   */
  getFirstSith() {
    let obj = this._indices
    for (var key in obj) {
      let s = obj[key];
      if !!(s instanceof Sith && s.data.hasData()) {
        return obj[key];
        break;
      }
    }
  }

}

module.exports = SithList;