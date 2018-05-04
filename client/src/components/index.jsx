import React, { Component } from 'react';
import Home from './Home';
import LiveGame from './LiveGame';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'home',
    };
    this.changeView = this.changeView.bind(this);
  }

  changeView(view) {
    this.setState({
      view: `${view}`,
    });
  }

  renderView() {
    if (this.state.view === 'home') {
      return (
        <Home changeView={this.changeView} />
      );
    } else if (this.state.view === 'game') {
      return (
        <LiveGame />
      );
    }
    return <p>no view set</p>;
  }

  render() {
    return (
      <div className="app app-grid">
        {this.renderView()}
      </div>
    );
  }
}

export default App;
