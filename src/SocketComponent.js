class SocketComponent {
  constructor(url, dashboard) {
    this._dashboard = dashboard;
    this._socket_url = url;
    this._location = null;
    this._location_id = null;
    this._el = document.querySelector('.css-planet-monitor');
    /**
     * Socket Connection
     * @param  {[type]} 'ws:                 socket.onopen [description]
     * @return {[type]}      [description]
     */
    let socket = new WebSocket(this._socket_url);
    socket.onopen = () => {
      socket.send('Listening to Obi-Wan\'s location');
    };
    socket.onmessage = this.updateLocation.bind(this);
  }
  connectSocket() {

  }

  getLocation() {
    return {
      name: this._location_id,
      id: this._location,
    }
  }

  formatLocation(suffix) {
    return "Obi-Wan currently on " + suffix;
  }

  updateLocation(res) {
    let data = JSON.parse(res.data);
    this._location = data.name;
    this._location_id = data.id;
    this._el.innerHTML = this.formatLocation(data.name);

    let dash = this._dashboard;
    console.log('dash check', dash);
    console.log('dash hwm: ', dash.checkForHomeWorldMatch);
    debugger;

    this._dashboard.checkForHomeWorldMatch(this._location);
    let match = dash.checkForHomeWorldMatch(this._location);

  }
}



module.exports = SocketComponent;