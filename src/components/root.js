import React from 'react';
import ColumnVisualizations from './column';
import ColorLegend from './color-legend';
import {files} from '../constants';
import Texts from '../texts/texts.json';
import Rows from '../texts/rows.json';

import ReactMarkdown from 'react-markdown';

import {
  Routes,
  Route,
  Link,
  HashRouter,
  Outlet,
  useLocation,
} from 'react-router-dom';

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

function KeySentences() {
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

const classnames = names =>
  Object.entries(names)
    .filter(([_, x]) => x)
    .map(([x]) => x)
    .join(' ');

const dir = {
  'Project Description': '/',
  Texts: '/texts',
  Methodology: '/methodology',
  'Categories key & Example sentences': '/examples',
  'Tools for Texts Visualization and Comparison': '/vis',
  'Thanks to': '/thanks',
  Contact: '/contact',
};

function App() {
  const location = useLocation();
  const onVisPage = location.pathname.includes('vis');

  return (
    <div className={classnames({'app-container': true, 'vis-page': onVisPage})}>
      <div className="top-menu">
        <div>Textual Analysis and Comparison</div>
        {/* <div className="link-container">
          <Link to={'/'}>Project Description</Link>
          <Link to={'/vis'}>
            Visuals for Goethe-DeCandolle Text Comparisons
          </Link>
        </div> */}
      </div>
      <div className="home-page">
        <img
          src="assets/goetheDecandolle-txt.jpg"
          alt="Goethe and Candolle in front of a wall of text"
        />
        <div class="title-container">
          <h1>Textual Analysis and Comparison</h1>
          <h2>“Goethe & Candolle” - Agatha Kim and Andrew McNutt</h2>
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
        </div>
        <div className="root-links-container">
          <div className="root-links">
            {Object.entries(dir).map(([key, val]) => (
              <Link key={val} to={val}>
                {key}
              </Link>
            ))}
          </div>
        </div>
        <div className="divider"></div>
        <div className="root-content-container flex-down center">
          {onVisPage && <Outlet />}
          {!onVisPage && (
            <div>
              <Outlet />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const simpleSection = text => () => <ReactMarkdown>{text}</ReactMarkdown>;
const Home = simpleSection(Texts.intro);
const Methodology = simpleSection(Texts.methodology);
const Thanks = simpleSection(Texts.thanks);
const Contact = simpleSection(Texts.contact);

export default function Root() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="vis" element={<VisContainer />} />
          <Route path="methodology" element={<Methodology />} />
          <Route path="thanks" element={<Thanks />} />
          <Route path="contact" element={<Contact />} />
          <Route path="texts" element={<TextsPage />} />
          <Route path="examples" element={<KeySentences />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
