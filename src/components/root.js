import React, {useState} from 'react';
import ColumnVisualizations from './column';
import ColorLegend from './color-legend';
import {files} from '../constants';
import Texts from '../texts/texts.json';
import Rows from '../texts/rows.json';

import ReactMarkdown from 'react-markdown';

import {Routes, Route, Link, HashRouter, Outlet} from 'react-router-dom';

function VisContainer() {
  return (
    <div className="vis-container">
      <div className="flex">
        <ColumnVisualizations defaultSelection={files[0].filePrefix} />
        <div className="flex full-height">
          <ColorLegend />
        </div>
        {<ColumnVisualizations defaultSelection={files[1].filePrefix} />}
      </div>
    </div>
  );
}

function TextsPage() {
  return (
    <div>
      <h3>The texts involved in the project</h3>
      {Texts.texts.map((text, idx) => {
        return (
          <div key={idx} className="flex text-row center">
            <a href={text.link}>
              <img
                src={`assets/${text.image}`}
                alt="front cover of the text described here"
              />
            </a>
            <div className="flex-down">
              <h5>
                <a href={text.link}>{text.title}</a>
              </h5>
              <div>{text.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function keySentences() {
  return (
    <div>
      <div className="flex-down" style={{marginBottom: '10px'}}>
        <div>Example sentences for each category</div>
        <div>
          <b>Goethe</b>: French-German edition of Metamorphosis of Plants (1831)
        </div>
        <div>
          <b>DC1</b>: Essay on the Medical Properties of Plants (1804)
        </div>
        <div>
          <b>DC2</b>: “Elementary Essay on Botanical Geography” (1820)
        </div>
        <div>
          <b>DC3</b>: Chapter II of Organography of Plants, book V (1827)
        </div>
      </div>
      <table>
        <thead>
          <tr>
            {Object.keys(Rows[0]).map(key => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Rows.map((row, idx) => (
            <tr key={idx}>
              {Object.entries(row).map(([key, val]) => (
                <td key={`${idx}-${key}`}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const simpleSection = text => () => <ReactMarkdown>{text}</ReactMarkdown>;

const localRouter = {
  Description: simpleSection(Texts.intro),
  Texts: TextsPage,
  Methodology: simpleSection(Texts.methodology),
  'Categories Key & Example Sentences': keySentences,
  'Thanks To': simpleSection(Texts.thanks),
};

function Home() {
  const [section, setSection] = useState('Description');
  const Content = localRouter[section];
  return (
    <div className="home-page">
      <img
        src="assets/goetheDecandolle-txt.jpg"
        alt="Goethe and De Candolle in front of a wall of text"
      />
      <h1>Textual Analysis and Comparison</h1>
      <h2>“Goethe & De Candolle” - Agatha Kim</h2>
      <div className="root-links">
        {Object.keys(localRouter).map(x => (
          <div key={x} onClick={() => setSection(x)}>
            {x}
          </div>
        ))}
      </div>
      <div className="root-content-container flex-down center">
        <img
          src="assets/flower01_web.png"
          alt="an artistic rendering of a flower"
          className="left-flower"
        />
        <img
          src="assets/flower01_web.png"
          alt="an picture of a palm leaf"
          className="right-flower"
        />
        <div>
          <Content />
        </div>
      </div>
    </div>
  );
}
function App() {
  return (
    <div className="app-container">
      <div className="top-menu">
        <div>Textual Analysis and Comparison</div>
        <div className="link-container">
          <Link to={'/'}>Project Description</Link>
          <Link to={'/vis'}>
            Visuals for Goethe-DeCandolle Text Comparisons
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default function Root() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="vis" element={<VisContainer />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
