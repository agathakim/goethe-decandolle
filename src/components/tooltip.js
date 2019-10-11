import React from 'react';

export default function renderTooltip(props) {
  const {hoveredComment, getSentence, cooccuranceData} = props;
  const count = cooccuranceData[JSON.stringify(hoveredComment.node.colors)];
  const similarMessage =
    count === 1
      ? '(Unique tag set)'
      : `(${count} sentencess have this tag set)`;
  return (
    <div
      className="tooltip"
      style={{
        top: hoveredComment.offsetY + 50,
        left: hoveredComment.offsetX + 10,
        zIndex: 2,
      }}
    >
      <div className="flex">
        {hoveredComment.node.colors.map(color => {
          return (
            <div
              className="color-block"
              key={`hover-${color}`}
              style={{backgroundColor: color}}
            />
          );
        })}
        <span className="small-font">{similarMessage}</span>
      </div>
      {getSentence(hoveredComment.node.sentenceIdx)}
    </div>
  );
}
