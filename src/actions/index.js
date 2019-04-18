import {csv} from 'd3-fetch';
const buildEasyAction = type => payload => dispatch => dispatch({type, payload});
// EXAMPLE
export const setHoveredComment = buildEasyAction('set-hovered-sentence');
export const toggleLock = buildEasyAction('toggle-lock');
export const toggleWafflebookAndTimeseries = buildEasyAction('toggle-waffle-plot-and-timeseries');

// EXAMPLE
export const getFile = filePrefix => dispatch => {
  Promise.all([
    csv(`./data/${filePrefix}-Numbered-sentences.csv`),
    csv(`./data/${filePrefix}-Reclassified.csv`)
  ])
  .then(([numberedSents, sentenceClassifcations]) => {

    dispatch({
      type: 'recieve-data',
      payload: {
        numberedSents: numberedSents.map(({sentence}) => sentence),
        sentenceClassifcations: sentenceClassifcations.map(row =>
          Object.entries(row).reduce((acc, [key, value]) => {
            if (key === '') {
              acc.index = value;
              return acc;
            }
            acc[key] = value === '1' ? 1 : 0;
            return acc;
          }, {}))
      }
    });
  });
};
