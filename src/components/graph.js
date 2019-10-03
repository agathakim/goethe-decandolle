import React from 'react';
import {WAFFLE_WIDTH, WAFFLE_HEIGHT} from '../constants';

export default class Graph extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <svg width={WAFFLE_WIDTH} height={WAFFLE_HEIGHT} />
      </div>
    );
  }
}
