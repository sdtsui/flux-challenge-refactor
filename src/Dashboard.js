class Dashboard {
  constructor(entryPoint) {
    this.render(entryPoint);
    this.el_scrollable_list = document.querySelector('css-scrollable-list');
    this.el_slots = document.querySelector('.css-slots');
    this.el_obiwan = document.querySelector('.css-planet-monitor');
    this.el_top_button = document.querySelector('.css-button-up');
    this.el_btm_button = document.querySelector('.css-button-down');

    this.sithlist = new SithList(this);
    this.obiwan = {};//TBD

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
    let templateString, HTML;
    switch (node) {
      case (node === this.el_slots) :
        templateString = ;
        HTML = ''

        //Tech Debt: May not always iterate in correct order.
        //May need to convert into an array and sort by index first.
        this.sithlist.mapOverIndices((maybeSith) => {
          if (maybeSith && maybeSith instanceof Sith) {
            let n = maybeSith.data.name;
            let h = 'Homeworld: ' + maybeSith.data.homeworld.name;
            HTML += `
            <li class="css-slot"><h3>${n}</h3><h6>${h}</h6></li>
            `
          }
        });
        node.innerHTML = HTML;
      case (node === this.el_obiwan) :
        //do nothing
      case (node === this.el_top_button || node === this.el_btm_button) :
        //do nothing
      default :
        //first render
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

    }
    //render template onto DOM
    //
    //case - node is el_sithList, rerender based on SithList
    //case - node is el_obiwan, rerender based on obiwan tracker
    //case - buttons --> toggle?
  }

}

module.exports = Dashboard;