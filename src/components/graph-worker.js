import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceLink,
} from 'd3-force';
import {scaleLinear} from 'd3-scale';
import {WAFFLE_WIDTH, WAFFLE_HEIGHT, CHART_MARGIN} from '../constants';
import {computeDomain} from '../utils';

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

  const {minX, maxX, minY, maxY} = computeDomain(nodes);
  const xScale = scaleLinear()
    .domain([minX, maxX])
    .range([CHART_MARGIN.left, WAFFLE_WIDTH - CHART_MARGIN.right]);
  const yScale = scaleLinear()
    .domain([minY, maxY])
    .range([CHART_MARGIN.top, WAFFLE_HEIGHT - CHART_MARGIN.bottom]);
  const ctx = event.data.canvas.getContext('2d');
  ctx.globalAlpha = 0.3;

  links.forEach(link => {
    ctx.beginPath();
    ctx.moveTo(xScale(link.source.x), yScale(link.source.y));
    ctx.lineTo(xScale(link.target.x), yScale(link.target.y));
    ctx.stroke();
    ctx.strokeStyle = link.color;
    ctx.closePath();
  });
});
