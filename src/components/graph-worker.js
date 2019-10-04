import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceX,
  forceY,
  forceCollide,
  forceLink,
} from 'd3-force';
import {WAFFLE_WIDTH, WAFFLE_HEIGHT} from '../constants';

addEventListener('message', event => {
  const nodes = event.data.nodes;
  const links = event.data.links;
  const simulation = forceSimulation(nodes)
    .force(
      'link',
      forceLink()
        .distance(10)
        .links(links)
        .id(d => d.sentenceIdx),
    )
    .force('center', forceCenter(WAFFLE_WIDTH / 2, WAFFLE_HEIGHT / 2))
    .force(
      'collide',
      forceCollide()
        .radius(d => 8)
        .iterations(2),
    )
    .force('charge', forceManyBody().strength(-30))
    .stop();

  const numSteps = Math.ceil(
    Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay()),
  );
  // const numSteps = 1000;
  for (let i = 0, n = numSteps; i < n; ++i) {
    postMessage({type: 'tick', progress: i / n});
    simulation.tick();
  }

  postMessage({type: 'end', nodes, links});
});
