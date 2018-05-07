import React, { Component } from 'react';

class SampleList extends Component {
  renderList() {
    return this.props.samples.map((sampleThing) => {
      <li key={sampleKey.id}>{sample.title}</li>
    })
  }

  render() {
    return (
      <ul>
        {this.renderList()}
      </ul>
    )
  }
}

function mapStateToProps(state) {
  // Whatever is returned here will show up as props inside of SampleList
  return {
    samples: state.samples
  };
}

export default connect(mapStateToProps)(SampleList);