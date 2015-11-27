let SithList = require('./SithList');
let __D = require('./constants');
let Sith = require('./Sith');


class Dashboard {
  constructor(entryPoint = document.querySelector('.app-container')) {
    this.$el = entryPoint;
    this.render();
    /**
     * Tech Debt: Messy storage of nodes
     * @type {[type]}
     */
    this.el_scrollable_list = document.querySelector('css-scrollable-list');
    this.el_slots = document.querySelector('.css-slots');
    this.el_jedi = document.querySelector('.css-planet-monitor');
    this.el_top_button = document.querySelector('.css-button-up');
    this.el_btm_button = document.querySelector('.css-button-down');

    /**
     * Components:
     *   - obiwan
     *   - button controller for UI input
     *   - sithList is a SithList instance, stores Sith instances
     * @type {SithList}
     */
    this._sithlist = new SithList(this);
    this._jedi = {};//TBD

    /**
     * This object is a candidate for use of function composition.
     * It is inherently stateless.
     * @type {Object}
     */
    this._ui = {
      buttons : [this.el_top_button, this.el_btm_button],
      _frozen : false,
      topIsActive : () => {},
      btmIsActive : () => {},
      respondToClick: (event) => {
        let t = event.currentTarget;
        if (!t.classList.contains('css-button-disabled')) {
          //not disabled, so invoke shift
          let sList = this._sithlist;
          let fnKey = (t.classList.contains('css-button-up'))
            ? 'shiftListUp' : 'shiftListDown';
          sList[fnKey].bind(this._sithlist)();
        } else {
          //do nothing, button is disabled
        }
      },
      disableIfActive : (btn) => {
        if (!btn.classList.contains('css-button-disabled')) {
          btn.classList.toggle('css-button-disabled');
        }
      },
      //must bind this to dashboard
      enableIfAllowed : (btn) => {
        if (this._ui._frozen === false) {
          if (btn.classList.contains('css-button-disabled')) {
            btn.classList.toggle('css-button-disabled');
          }    
        }
        //if UI isn't frozen.
        //rules: UI is not frozen.
        //  top if top has a master
        //  bottom if bottom has a master
      },
      forEachButton : (cb) => {
        this._ui.buttons.forEach(cb);
      },
      //must bind this to dashboard
      disableAll : (target) => {
        let ui = this._ui;
        //disables all if no params past
        if (target === 'top') {
          ui.disableIfActive(ui.buttons[0]);
        } else if (target === 'btm') {
          ui.disableIfActive(ui.buttons[1]);
        } else {
          ui.forEachButton(ui.disableIfActive);          
        }
      }
      //must bind This to dashboard
    };

    this.render(this.el_slots);
    this._ui.buttons.forEach((btn) => {
      btn.addEventListener('mousedown', this._ui.respondToClick.bind(this._sithList));
    }.bind(this));

    //disable to start
    this._ui.forEachButton(this._ui.disableIfActive);

    //when events are fired that end a planet conflict, remember to re-trigger
    //'resumefetching'
  }

  /**
   * [renderList description]
   * @return {[type]} [description]
   */
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
      node.innerHTML = '';
      let m = this._sithlist._indices;
      for (var key in m) {
        let sith = m[key];
        let name = (!!sith && sith.hasData()) ? sith.data.name : "";
        let homeworld = (!!sith && sith.hasData()) ? 
          sith.data.homeworld.name : 
          "";
        let newSlot = document.createElement('li');
        newSlot.innerHTML = '<h3>' + name +'</h3><h6>'+ homeworld +'</h6>';
        newSlot.classList.toggle('css-slot');      
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
  }

}

module.exports = Dashboard;