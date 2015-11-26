let SithList = require('./SithList');
let __D = require('./constants');
let Sith = require('./Sith');


class Dashboard {
  constructor(entryPoint = document.querySelector('.app-container')) {
    this.$el = entryPoint;
    this.render();
    this.el_scrollable_list = document.querySelector('css-scrollable-list');
    this.el_slots = document.querySelector('.css-slots');
    this.el_obiwan = document.querySelector('.css-planet-monitor');
    this.el_top_button = document.querySelector('.css-button-up');
    this.el_btm_button = document.querySelector('.css-button-down');
    console.log("FIRST RENDER");

    this.sithlist = new SithList(this);
    this.obiwan = {};//TBD

    console.log("PASSING IN", this.el_slots);
    console.log("PASSING IN", this.el_slots === this.el_slots);
    console.log("ESCOND RENDER");

    this.render(this.el_slots);

    //when events are fired that end a planet conflict, remember to re-trigger
    //'resumefetching'
  }

  renderList() {
    let fn = this.render.bind(this, this.el_slots);
    fn();
  }

  renderObi() {
    let fn = this.render.bind(this, this.el_obiwan);
    fn();
  }

  render(node) {
    let templateString
    let _HTML;
    if (node === undefined) {
      templateString =       
      `<div class="css-root">
        <h1 class="css-planet-monitor"></h1>
        <section class="css-scrollable-list">
          <ul class="css-slots">
          </ul>
          <div class="css-scroll-buttons">
            <button class="css-button-up"></button>
            <button class="css-button-down"></button>
          </div>
        </section>
      </div>`;
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
      let m = this.sithlist._indices;
      for (var key in m) {
        let sith = m[key];
        let name = (!!sith && sith.hasData()) ? sith.data.name : "";
        let homeworld = (!!sith && sith.hasData()) ? 
          sith.data.homeworld.name : 
          "";
        let newSlot = document.createElement('li');
        newSlot.innerHTML = '<h3>' + name +'</h3><h6>'+ homeworld +'</h6>';
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
    } else if (node === this.el_obiwan) {

    } else if (node === this.el_top_button || 
      node === this.el_btm_button) {

    }
    //render template onto DOM
    //case - node is el_sithList, rerender based on SithList
    //case - node is el_obiwan, rerender based on obiwan tracker
    //case - buttons --> toggle?
  }

}

module.exports = Dashboard;