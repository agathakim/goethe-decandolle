import {
  COLORS,
  categoryRelationships,
  TARGET_WIDTH,
  COLORS_FOR_LEGEND,
} from './constants';
import {csv} from 'd3-fetch';

export function classnames(classObject) {
  return Object.keys(classObject)
    .filter(name => classObject[name])
    .join(' ');
}

const csvWithMemoize = fileUrl => {
  const cache = {};
  if (cache[fileUrl]) {
    return new Promise((resolve, reject) => resolve(cache[fileUrl]));
  }
  return csv(fileUrl).then(d => {
    cache[fileUrl] = d;
    return d;
  });
};

export const getFile = filePrefix =>
  Promise.all([
    csvWithMemoize(`./data/${filePrefix}-Numbered-sentences.csv`),
    csvWithMemoize(`./data/${filePrefix}-Reclassified.csv`),
  ]).then(([numberedSents, sentenceClassifcations]) => {
    return {
      filePrefix,
      numberedSents: numberedSents.map(({sentence}) => sentence),
      sentenceClassifcations: sentenceClassifcations.map(row =>
        Object.entries(row).reduce((acc, [key, value]) => {
          if (key === '') {
            acc.index = value;
            return acc;
          }
          acc[key] = value === '1' ? 1 : 0;
          return acc;
        }, {}),
      ),
    };
  });

export function colorSentences(data) {
  return data.map(row => {
    const colors = Object.keys(row)
      .filter(key => row[key] && key !== 'index')
      .map(key => {
        return COLORS[key.toLowerCase()];
      });
    return {...row, colors};
  });
}

export function prepBarChart(data, validColors, useInclusive) {
  const counts = data
    .filter(d => {
      if (useInclusive) {
        return d.colors.some(color => validColors[color]);
      }
      return d.colors.every(color => validColors[color]);
    })
    .reduce((acc, row) => {
      Object.keys(row).forEach(key => {
        acc[key] = (acc[key] || 0) + row[key];
      });
      return acc;
    }, {});
  delete counts.index;
  delete counts.colors;
  const colorToTag = COLORS_FOR_LEGEND.reduce((acc, row) => {
    acc[row.color] = row.tag;
    return acc;
  }, {});
  return Object.entries(counts).map(([cat, count]) => {
    return {
      cat,
      tag: colorToTag[COLORS[cat.toLowerCase()]],
      count: count || 0,
      color: COLORS[cat.toLowerCase()],
    };
  });
}

export function prepSunburst(data) {
  const countsByCat = data.reduce((acc, row) => {
    categoryRelationships.forEach(({cat}) => {
      if (!acc[cat]) {
        acc[cat] = 0;
      }
      acc[cat] += (Number(row[cat]) && Number(row[cat])) || 0;
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
        // color: COLORS[superCat],
        children: children.map(child => {
          return {
            ...child,
            children: [],
            label: child.cat,
            color: COLORS[child.cat.toLowerCase()],
          };
        }),
      };
    }),
  };
}

export function prepWaffleData(data) {
  const blocks = data.map(row => {
    return Object.entries(row)
      .filter(([key, count]) => Number(count) && key !== 'index')
      .map(([key, count]) => {
        if (!COLORS[key.toLowerCase()]) {
          /* eslint-disable no-console */
          console.log(key.toLowerCase(), COLORS[key.toLowerCase()]);
          /* eslint-enable no-console */
        }
        return COLORS[key.toLowerCase()];
      });
  });
  // greedy algorithm

  const rows = [];
  let currentRow = [];
  let idx = 0;
  while (idx < blocks.length) {
    const block = blocks[idx];
    const currentRowLength = currentRow.reduce(
      (acc, row) => acc + row.length,
      0,
    );
    if (currentRowLength + block.length > TARGET_WIDTH) {
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

export function computeDomain(nodes) {
  return nodes.reduce(
    (acc, {x, y}) => {
      return {
        minX: Math.min(acc.minX, x),
        maxX: Math.max(acc.maxX, x),
        minY: Math.min(acc.minY, y),
        maxY: Math.max(acc.maxY, y),
      };
    },
    {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity,
    },
  );
}

export function generateNodes(waffleBookData, validColors, useInclusive) {
  return waffleBookData
    .reduce((acc, row) => acc.concat(row), [])
    .filter(d => {
      const predicate = color => validColors[color];
      return useInclusive
        ? d.colors.some(predicate)
        : d.colors.every(predicate);
    });
}

export function generateGraphLinks(graphNodes) {
  const colorGroups = Object.entries(
    graphNodes.reduce((acc, row) => {
      row.colors.forEach(color => {
        acc[color] = (acc[color] || []).concat(row.sentenceIdx);
      });
      return acc;
    }, {}),
  );

  const dedupledLinks = colorGroups
    .reduce((acc, [color, colorGroup]) => {
      for (let i = 0; i < colorGroup.length; i++) {
        for (let j = i; j < colorGroup.length; j++) {
          if (i !== j) {
            acc.push({
              source: colorGroup[i],
              target: colorGroup[j],
              color,
            });
          }
        }
      }
      return acc;
    }, [])
    .reduce((acc, {source, target, color}) => {
      acc[`${source}-${target}-${color}`] = {source, target, color};
      return acc;
    }, {});

  return Object.values(dedupledLinks);
}
