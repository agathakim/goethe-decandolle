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
  // switch (event.data.type) {
  //   case 'tick':
  //     return ticked(event.data);
  //   case 'end':
  //     return ended(event.data);
  // }
  // postMessage(calculatePi(event.data));
  const nodes = event.data.nodes;
  const links = event.data.links;

  const simulation = forceSimulation(nodes)
    .force(
      'link',
      forceLink()
        .distance(10)
        .links(links),
    )
    // .force('x', forceX().strength(0.002))
    // .force('y', forceY().strength(0.002))
    .force('center', forceCenter(WAFFLE_WIDTH / 2, WAFFLE_HEIGHT / 2))
    .force(
      'collide',
      forceCollide()
        .radius(d => 8)
        .iterations(2),
    )
    .force('charge', forceManyBody().strength(-50))
    .stop();

  // const simulation = forceSimulation(nodes)
  //   .force('charge', forceManyBody())
  //   .force(
  //     'link',
  //     forceLink(links)
  //       .distance(20)
  //       .strength(1),
  //   )
  //   .force('x', forceX())
  //   .force('y', forceY())
  //   .stop();

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
