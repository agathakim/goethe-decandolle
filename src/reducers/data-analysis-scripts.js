import {COLORS, categoryRelationships, TARGET_WIDTH} from '../constants';
const SEPERATOR_SYMBOL = '??';
export function generateCombinationCounts(dataset) {
  const allKeys = Object.keys(dataset[0]).map(row => {
    if (!row.length) {
      return 'idx';
    }
    return row;
  }).filter(row => row !== 'index');
  const oneLevel = allKeys.map(key => [key]);
  const twoLevel = allKeys.reduce((acc, row) => {
    return acc.concat(oneLevel.map(innerRow => innerRow.concat(row)));
    // return acc;
  }, []);
  const threeLevel = allKeys.reduce((acc, row) => {
    return acc.concat(twoLevel.map(innerRow => innerRow.concat(row)));
  }, []);

  const combos = (oneLevel.concat(twoLevel).concat(threeLevel)).map(combo => {
    return Object.keys(combo.reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));
  });

  const allComboCounts = dataset.reduce((acc, row) => {
    combos.forEach(combo => {
      if (!acc[combo.join(SEPERATOR_SYMBOL)]) {
        acc[combo.join(SEPERATOR_SYMBOL)] = 0;
      }
      const isPresent = combo.every(key => row[key]);
      acc[combo.join(SEPERATOR_SYMBOL)] += (isPresent ? 1 : 0);
    });
    return acc;
  }, {});

  const reducedCounts = Object.entries(allComboCounts).reduce((acc, [key, count]) => {
    if (count) {
      acc[key] = count;
    }
    return acc;
  }, {});

  const nodes = Object.keys(reducedCounts)
    .map(name => ({name, color: COLORS[name] || 'blue'}));
  const nodeIdx = nodes.reduce((acc, {name}, idx) => {
    acc[name] = idx;
    return acc;
  }, {});
  const links = Object.entries(reducedCounts).reduce((acc, [comboString, count]) => {
    const combo = comboString.split(SEPERATOR_SYMBOL);
    if (combo.length === 1) {
      return acc;
    }
    const parentName = combo.length === 2 ? `${combo[0]}` : `${combo[0]}${SEPERATOR_SYMBOL}${combo[1]}`;
    // console.log(parentName)
    // if (!nodeIdx[parentName]) {
    //   console.log(parentName)
    // }
    return acc.concat({
      source: nodeIdx[parentName],
      target: nodeIdx[comboString],
      value: count
    });
  }, []);
  // console.log(links)
  return {nodes, links};
}

export function prepTimeSeriesData(data) {
  const cats = Object.keys(data[0]);
  const timeseries = data.reduce((acc, row) => {
    cats.forEach(cat => {
      acc[cat].push(Number(row[cat]) ? 1 : 0);
    });
    return acc;
  }, cats.reduce((acc, cat) => {
    acc[cat] = [];
    return acc;
  }, {}));
  Object.keys(timeseries).forEach(cat => {
    const series = timeseries[cat];
    let height = 0;
    timeseries[cat] = series.map((val, idx) => {
      height += val;
      return ({x: idx, y: height});
    });

    // timeseries[cat] = series.map((val, idx) => {
    //   return ({x: idx, y: Number(val) ? val : 0});
    // });
  });
  timeseries[''] = [];
  return timeseries;
}

export function prepSunburst(data) {
  const countsByCat = data.reduce((acc, row) => {
    categoryRelationships.forEach(({cat}) => {
      if (!acc[cat]) {
        acc[cat] = 0;
      }
      acc[cat] += (Number(row[cat]) && Number(row[cat]) || 0);
    });
    return acc;
  }, {});
  const groups = categoryRelationships.reduce((acc, row) => {
    if (!acc[row.superCat]) {
      acc[row.superCat] = [];
    }
    acc[row.superCat].push({...row, size: countsByCat[row.cat]});
    return acc;
  }, {});

  return {
    children: Object.entries(groups).map(([superCat, children]) => {
      return {
        label: superCat,
        color: COLORS[superCat],
        children: children.map(child => {
          return {...child, children: [], label: child.cat, color: COLORS[child.cat]};
        })
      };
    })
  };
}

export function prepWaffleData(data) {
  const blocks = data.map((row) => {
    return Object.entries(row)
      .filter(([key, count]) => Number(count) && key !== 'index')
      .map(([key, count]) => COLORS[key]);
  });
  // greedy algorithm

  const rows = [];
  let currentRow = [];
  let idx = 0;
  while (idx < blocks.length) {
    const block = blocks[idx];
    const currentRowLength = currentRow.reduce((acc, row) => acc + row.length, 0);
    if ((currentRowLength + block.length) > TARGET_WIDTH) {
      rows.push(currentRow);
      currentRow = [block];
    } else {
      currentRow.push(block);
    }
    idx += 1;
  }
  let sentenceIdx = 0;
  const offsettedRows = rows.map(row => {
    let offset = 0;
    return row.map(colors => {
      const newRow = {colors, offset, sentenceIdx};
      sentenceIdx += 1;
      offset += colors.length;
      return newRow;
    });
  });

  return offsettedRows;
}
