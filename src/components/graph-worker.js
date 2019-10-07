import TSNE from 'tsne-js';

import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceLink,
} from 'd3-force';
import {scaleLinear} from 'd3-scale';
import {
  WAFFLE_WIDTH,
  WAFFLE_HEIGHT,
  CHART_MARGIN,
  COLORS_FOR_LEGEND,
} from '../constants';
import {computeDomain} from '../utils';

/**
 * Hueristic technique for seperating the clusters
 */
function applyHueristicPreposition(nodes) {
  let ticker = 0;
  const colorOrder = nodes.reduce((acc, node) => {
    const key = JSON.stringify(node.colors);
    if (acc[key]) {
      return acc;
    }
    acc[key] = ticker;
    ticker += 1;
    return acc;
  }, {});

  nodes.forEach(node => {
    const key = JSON.stringify(node.colors);
    const angle = ((Math.PI * colorOrder[key]) / ticker) * 2;
    node.x = (WAFFLE_WIDTH / 2) * Math.cos(angle);
    node.y = (WAFFLE_WIDTH / 2) * Math.sin(angle);
  });
}

/**
 * Numerical seperation technique
 */
function prepositionNodesWithTSNE(nodes) {
  nodes.forEach(node => {
    const presentColors = node.colors.reduce((acc, row) => {
      acc[row] = true;
      return acc;
    }, {});

    node.featureVector = COLORS_FOR_LEGEND.map(({color}) => {
      return presentColors[color] ? 1 : 0;
    });
  });
  const model = new TSNE({
    dim: 2,
    perplexity: 10.0,
    earlyExaggeration: 10.0,
    learningRate: 100.0,
    nIter: 200,
    metric: 'dice',
  });
  model.on('progressIter', ([iter, rror, gradNorm]) => {
    postMessage({type: 'tick', progress: (iter / 200) * 0.5});
    // data: [iter, error, gradNorm]
    // postMessage({
    //   type: 'PROGRESS_ITER',
    //   data: iter
    // });
  });
  model.init({
    data: nodes.map(({featureVector}) => featureVector),
    type: 'dense',
  });
  const [error, iter] = model.run();
  console.log(error, iter);

  const xScale = scaleLinear()
    .domain([-1, 1])
    .range([CHART_MARGIN.left, WAFFLE_WIDTH - CHART_MARGIN.right]);
  const yScale = scaleLinear()
    .domain([-1, 1])
    .range([CHART_MARGIN.top, WAFFLE_HEIGHT - CHART_MARGIN.bottom]);
  const output = model
    .getOutputScaled()
    .map(([x, y]) => [xScale(x), yScale(y)]);
  nodes.forEach((node, idx) => {
    node.x = output[idx][0];
    node.y = output[idx][1];
  });
}

function prepareSimulation(nodes, links) {
  const linkForce = forceLink()
    .distance(8)
    .links(links)
    .id(d => d.sentenceIdx);
  const collideForce = forceCollide()
    .radius(d => 8)
    .iterations(2);
  return forceSimulation(nodes)
    .force('link', linkForce)
    .force('center', forceCenter(WAFFLE_WIDTH / 2, WAFFLE_HEIGHT / 2))
    .force('collide', collideForce)
    .force('charge', forceManyBody().strength(-40))
    .stop();
}

function executeSimulation(simulation) {
  const numSteps = Math.ceil(
    Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay()),
  );
  // const numSteps = 1000;
  for (let i = 0, n = numSteps; i < n; ++i) {
    postMessage({type: 'tick', progress: i / n + 0.5});
    simulation.tick();
  }
}

addEventListener('message', event => {
  const {
    data: {nodes, links},
  } = event;

  // applyHueristicPreposition(nodes);
  prepositionNodesWithTSNE(nodes);

  const simulation = prepareSimulation(nodes, links);
  executeSimulation(simulation);

  // send results back
  postMessage({type: 'end', nodes});

  // use off screen drawing to add the lines
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
