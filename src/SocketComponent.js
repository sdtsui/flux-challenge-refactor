class SocketComponent {
  constructor(url) {
    this._socket_url = url;
    this._location = null;
    this._location_id = null;
    this.$el = document.querySelector('.css-planet-monitor');

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
    this.$el.innerHTML = this.formatLocation(data.name);
  }
}



module.exports = SocketComponent;