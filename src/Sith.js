class Sith {
  constructor(url, index, sithlist) {
    if (index === undefined) return new Error('No index');
    this._sithlist = sithlist;
    this.data = undefined;
    this.url = url;
    this.pending = undefined;
    this.index = index;

    this.fetch(this.url, this.updateData);
  }

  fetch(url, cb) {
    this.pending = superagent.get(url)
                              .end(cb);
  } 

  updateData(err, res) {
    if (err) return; //fail silently
    let data = this.data = JSON.parse(res.text);
    sithlist.homeworlds[data.homeworld.name] = this;
    //call fetch again, with specific params to end or do nothing
    this.fillRemainingSlots(this);
  }

  fillRemainingSlots(sith = this._sithlist.getFirstSith()) {
    let maybeFetch = this.maybeFetch(sith);
    if (maybeFetch) sithlist.addAt(maybeFetch.url, maybeFetch.idx);
  }

  maybeFetch(sith) {
    let apprentice = maybeFetchDown(sith);
    let master = maybeFetchUp(sith);
    return apprentice ? apprentice : 
          master ? master : null;
  }
  // checks for what to request next: url+index, or null
  maybeFetchDown(sith) {
    let next = this.next();
    let idx = this.index;
    //base case: reach the bottom, can't fetch more
    if (idx === 4 || this.master === null) {
      return null;
    } else if (next instanceof Sith) {
      return this.maybeFetchDown(next);
    } else {
      //found a sith with master, and not at bottom
      let fetchParams = {url: this.master.url, idx: this.index+1};
      return fetchParams;
    }
  }

  maybeFetchUp(sith) {
    let prev = this.prev();
    let idx = this.index;
    //base case: reach the top, can't fetch more
    if (idx === 0 || this.apprentice === null) {
      return null;
    } else if (prev instanceof Sith) {
      return this.maybeFetchUp(prev);
    } else {
      //found a sith with apprentice, and not at top
      let fetchParams = {url: this.apprentice.url, idx: this.index-1};
      return fetchParams;
    }

  }

  next() {
    return getSithAt(this.index+1);
  }

  prev() {
    return getSithAt(this.index-1);
  }

  cancel() {
    if (this.pending && (this.data === undefined)) this.pending.abort();
    this.pending = undefined;
  }

  //Helper Methods
  isPending() {
    //Warn: seems unnecessary
    return !!(this.data === undefined);
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