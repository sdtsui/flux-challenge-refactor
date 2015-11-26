let __D = require('./constants');


class Sith {
  constructor(url, index, sithlist) {
    if (index === undefined) return new Error('No index');
    this._sithlist = sithlist;
    this.data = undefined;
    this.url = url;
    this.pending = undefined; // not always updated correctly :(
    this.index = index;

    this.fetch(this.url, this.updateData);
  }

  fetch(url, cb) {
    this.pending = superagent.get(url)
                              .end(cb.bind(this));
  } 

  updateData(err, res) {
    if (err) return; //fail silently
    let data = this.data = JSON.parse(res.text);
    this._sithlist._homeworlds[data.homeworld.name] = this;

    /**
     * 
     */
    //Tech Debt: Refactor reaching out later:
    //Problematic...
    let dash = this._sithlist._dashboard;
    dash.renderList();
    debugger;
    dash._ui.forEachButton(dash._ui.enableIfAllowed.bind(dash));
    /**
     * 
     */

    //call fetch again, with specific params to end or do nothing
    this.fillRemainingSlots(this);
  }

  fillRemainingSlots(sith = this._sithlist.findOneSith()) {
    let maybeFetch = this.maybeFetch(sith);
    if (maybeFetch) this._sithlist.addSithAt(maybeFetch.url, maybeFetch.idx);
  }

  maybeFetch(sith) {
    let apprentice = this.maybeFetchDown(sith);
    let master = this.maybeFetchUp(sith);
    return apprentice ? apprentice : 
          master ? master : null;
  }
  // checks for what to request next: returns {url,index}, or null
  // Checks apprentices.
  maybeFetchDown(sith) {

    let next = this.next();
    let idx = sith.index;
    //base case: reach the bottom, can't fetch more
    if (idx === 4 || sith.data.apprentice.url === null) {
      console.log('hitting base case down -- Disable btn?');
      return null;
    } else if (next instanceof Sith) {
      return sith.maybeFetchDown(next);
    } else {
      //found a sith with apprentice, and not at bottom
      let fetchParams = {url: sith.data.apprentice.url, idx: sith.index+1};
      return fetchParams;
    }
  }

  // checks for what to request next: returns {url,index}, or null
  // Checks masters.
  maybeFetchUp(sith) {
    let prev = sith.prev();
    let idx = sith.index;
    //base case: reach the top, can't fetch more
    if (idx === 0 || sith.data.master.url === null) {
      console.log('hitting base case in fetchUp -- Disable btn?');
      return null;
    } else if (prev instanceof Sith) {
      return sith.maybeFetchUp(prev);
    } else {
      //found a sith with master, and not at top
      let fetchParams = {url: sith.data.master.url, idx: sith.index-1};
      return fetchParams;
    }

  }

  next() {
    return this._sithlist.getSithAt(this.index+1);
  }

  prev() {
    return this._sithlist.getSithAt(this.index-1);
  }

  cancel() {
    if (this.pending && (this.data === undefined)) this.pending.abort();
    this.pending = undefined;
  }

  //Helper Methods
  isPending() {
    //Warn: seems unnecessary
    return !!(this.pending);
  }

  hasData() {
    //Warn: seems unnecessary, but used by SithList.
    return !!(this.data !== undefined);
  }

  getHomeworld() {
    if (this.data.homeworld) return this.data.homeworld;

  }

  getName() {
    if (this.data.name) return this.data.name;
  }

  doNothing() {}
}


module.exports = Sith;