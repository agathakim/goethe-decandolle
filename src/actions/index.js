const buildEasyAction = type => payload => dispatch => dispatch({type, payload});
// EXAMPLE
export const setHoveredComment = buildEasyAction('set-hovered-sentence');
export const toggleLock = buildEasyAction('toggle-lock');
export const toggleWafflebookAndTimeseries = buildEasyAction('toggle-waffle-plot-and-timeseries');

// EXAMPLE
// const itemUrl = id => `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
// export const getAllItems = root => dispatch => {
//   let children = [];
//   const getChild = child => fetch(itemUrl(child)).then(response => response.json());
//   let depth = 0;
//   const doGeneration = generation =>
//     Promise.all(generation.map(child => getChild(child)))
//     .then(offspring => {
//       dispatch({
//         type: 'increase-loaded-count',
//         payload: {newCount: children.length}
//       });
//       children = children.concat(offspring.map(d => ({children: [], ...d, depth})));
//       depth += 1;
//       const newgen = offspring
//         .reduce((acc, child) => acc.concat(child && child.kids || []), []);
//       if (newgen.length) {
//         return doGeneration(newgen);
//       }
//       return children;
//     });
//
//   return Promise.resolve()
//     .then(() => doGeneration([root]))
//     .then(data => {
//       dispatch({
//         type: 'get-all-items',
//         payload: {data, root}
//       });
//     });
// };
