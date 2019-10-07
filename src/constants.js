export const files = [
  {name: 'Goethe', filePrefix: 'Goethe'},
  {name: 'De Candolle 1 (DC1)', filePrefix: 'DC1'},
  {name: 'De Candolle 2 (DC2)', filePrefix: 'DC2'},
  {name: 'De Candolle 3 (DC3)', filePrefix: 'DC3'},
];

// export const COLORS = {
//   Descriptive: '#7030A0',
//   Empirical: '#FFFF03',
//   'Historical, descriptive': '#660066',
//   Historical: '#660066',
//   'Classificatory definition': '#CC3399',
//   Classificatory: '#CC3399',
//   Numerical: '#CC99FF',
//
//   Characterizing: '#01B050',
//   Philosophical: '#66FFCC',
//   'Philosophical, epistemological': '#66FFCC',
//   Methodological: '#00CC99',
//   Classical: '00B318',
//   Romantic: '62ACFF',
//
//   Logical: '#FF0000',
//   'Rational, speculative': '#FFA2E1',
//   Inductive: '#BA00B4',
//   Deductive: '#80FF00',
//   Analogical: '#FF0166',
//
//   Decorative: '#FFC001',
//   Metaphorical: '#CC9900',
//   'Metaphorical, visual': '#CC9900',
//   'Agency to nature': '#FFFF02',
//   'Metaphor-AgencyNature': '#FFFF02',
//
//   Persuasive: '#0070C0',
//   'Future, utility': '#66FFFF',
//   'Future-Utility': '#66FFFF',
//   'Writing aim, direction': '#0066FF',
//   'Writing direction': '#0066FF',
// };
const USE_TABLEAU_COLORS = false;
const TABLEAU_COLORS = [
  '#1F77B4',
  '#AEC7E8',
  '#FF7F0E',
  '#FFBB78',
  '#2CA02C',
  '#98DF89',
  '#D62728',
  '#FF9896',
  '#9467BD',
  '#C5B0D5',
  '#8C564A',
  '#C49C94',
  '#E377C2',
  '#F7B6D2',
  '#7F7F7F',
  '#C7C7C7',
  '#BCBD22',
  '#DBDB8D',
  '#17BECF',
  '#9EDAE5',
];

export const COLORS_FOR_LEGEND = [
  {
    label: 'Romantic',
    tag: '(Rom)',
    color: '#62ACFF',
  },
  {
    label: 'Classical',
    tag: '(Clas)',
    color: '#00B318',
  },
  {
    label: 'Empirical',
    tag: '(Emp)',
    color: '#FFFF03',
  },
  {
    label: 'Inductive',
    tag: '(Induc)',
    color: '#BA00B4',
  },
  {
    label: 'Deductive',
    tag: '(Deduc)',
    color: '#80FF00',
  },
  {
    label: 'Rational/Speculative',
    tag: '(Ratio)',
    color: '#FFA2E1',
  },
  {
    label: 'Analogical',
    tag: '(Anlg)',
    color: '#FF0011',
  },
  {
    label: 'Methodological',
    tag: '(Method)',
    color: '#A9FFD2',
  },
  {
    label: 'Historical/Descriptive',
    tag: '(Hist)',
    color: '#1100FF',
  },
  {
    label: 'Philosophical definition',
    tag: '(Phil)',
    color: '#CC99FF',
  },
  {
    label: 'Metaphorical/Visual',
    tag: '(Metaph)',
    color: '#FFAE5C',
  },
  {
    label: 'Metaphors attributing agency to nature',
    tag: '(Agncy)',
    color: '#9F5103',
  },
  {
    label: 'Future/Utility',
    tag: '(Fut)',
    color: '#FF007F',
  },
  {
    label: 'Classificatory',
    tag: '(Clsf)',
    color: '#666600',
  },
  {
    label: 'Numerical',
    tag: '(Num)',
    color: '#000000',
  },
  {
    label: 'Writing aim/direction',
    tag: '(Wr)',
    color: '#808080',
  },
  {
    label: 'Blank statement',
    tag: '(Bl)',
    color: '#FFFFFF',
  },
].map((row, idx) =>
  USE_TABLEAU_COLORS
    ? {
        ...row,
        oldColor: row.color,
        color: TABLEAU_COLORS[idx + 1],
      }
    : row,
);

const OLD_COLORS_TO_NEW_COLORS = COLORS_FOR_LEGEND.reduce(
  (acc, {color, oldColor}) => {
    acc[oldColor] = color;
    return acc;
  },
  {},
);

const PRE_COLORS = {
  Romantic: '#62ACFF',
  Classical: '#00B318',
  Empirical: '#FFFF03',
  Inductive: '#BA00B4',
  Deductive: '#80FF00',
  'Rational/Speculative': '#FFA2E1',
  'Rational, Speculative': '#FFA2E1',
  'Rational-Speculative': '#FFA2E1',
  Analogical: '#FF0011',
  Methodological: '#A9FFD2',
  'Historical/Descriptive': '#1100FF',
  'Historical, Descriptive': '#1100FF',
  'Historical, descriptive': '#1100FF',
  Historical: '#1100FF',
  'Philosophical, epistemological': '#CC99FF',
  'Philosophical definition': '#CC99FF',
  Philosophical: '#CC99FF',
  'Metaphorical/Visual': '#FFAE5C',
  'metaphorical, visual': '#FFAE5C',
  Metaphorical: '#FFAE5C',
  'Metaphorical-Agency to nature': '#9F5103',
  'Metaphors attributing agency to nature': '#9F5103',
  'agency to nature': '#9F5103',
  'Future/Utility': '#FF007F',
  'Future, Utility': '#FF007F',
  'Future-Utility': '#FF007F',
  'Classificatory/definition': '#666600',
  'Classificatory definition': '#666600',
  Classificatory: '#666600',
  Numerical: '#000000',
  'Writing aim/direction': '#808080',
  'Writing aim, direction': '#808080',
  'Writing direction': '#808080',
  'Blank statement': '#FFFFFF',
  Blank: '#FFFFFF',
};
export const COLORS = Object.entries(PRE_COLORS).reduce((acc, [key, color]) => {
  acc[key.toLowerCase()] = USE_TABLEAU_COLORS
    ? OLD_COLORS_TO_NEW_COLORS[color]
    : color;
  return acc;
}, {});

export const categoryRelationships = [
  {cat: 'Empirical', superCat: 'Descriptive'},
  {cat: 'Historical', superCat: 'Descriptive'},
  {cat: 'Classificatory', superCat: 'Descriptive'},
  {cat: 'Numerical', superCat: 'Descriptive'},
  {cat: 'Philosophical', superCat: 'Characterizing'},
  {cat: 'Methodological', superCat: 'Characterizing'},
  {cat: 'Classical', superCat: 'Characterizing'},
  {cat: 'Romantic', superCat: 'Characterizing'},
  {cat: 'Rational-Speculative', superCat: 'Logical'},
  {cat: 'Inductive', superCat: 'Logical'},
  {cat: 'Deductive', superCat: 'Logical'},
  {cat: 'Analogical', superCat: 'Logical'},
  {cat: 'Metaphorical', superCat: 'Decorative'},
  {cat: 'Metaphorical-Agency to nature', superCat: 'Decorative'},
  {cat: 'Future-Utility', superCat: 'Persuasive'},
  {cat: 'Writing direction', superCat: 'Persuasive'},
  {cat: 'Blank', superCat: 'NA'},
].map(d => ({cat: d.cat, superCat: ''}));

// Descriptions of the botanical texts by Goethe and De Candolle
/* eslint-disable max-len */
export const DESCRIPTIONS = {
  Goethe: {
    fullName: 'Goethe, Metamorphosis of Plants',
    description: `This work was originally published in 1790, but was translated into French only in 1829. After the famous public debate between the two leading French naturalists Georges Cuvier and Étienne Geoffroy Saint-Hilaire on the theories of animal structures and the methods and philosophies behind them, Goethe’s work was put in the spotlight, and was published in a French-German edition in 1831.
    In this work, Goethe described plant growth in terms of serial homology, where a plant organ went through transformations (cotyledons, stem leaves, calyx, corolla, stamen, fruit, etc.) by alternately contracting and expanding its form. Goethe designated the leaf as the protean organ, or the Archetype of all the variations of plant forms. (The image to the right: the Archetypal plant as imagined by P. J. F. Turpin, 1837.) He considered these potential forms as equal in value—there was no hierarchy between the “regular” and “irregular” forms, which was a main disagreement between Goethe and De Candolle.`,
  },
  DC1: {
    fullName:
      'De Candolle, Essai sur les propriétés médicales des plantes (1804)',
    description: `De Candolle’s goal in this work was to assert his Theory of Analogy, which argued that there was continuity between plant forms and properties. However, this theory asked one to look beyond the immediately visible plant forms because analogous plants could produce various effects while some non-analogous plants could produce similar effects on human. Instead, one had to distinguish which plant properties and structures were normative or accidental, as well as consider the modes in which plants produced their effects.
    De Candolle promised that this theory would help get rid of the apparent anomalies and re-classify them correctly according to the natural order, which would benefit the practical uses of plant medicines, especially in the colonial world.
    Although he argued that the environment could modify plant forms and properties and create the apparent anomalies, De Candolle remained silent, unlike Goethe or Saint-Hilaire, on the historical and evolutionary implications that these anomalies could offer.`,
  },
  DC2: {
    fullName: 'De Candolle, Essai élémentaire de géographie botanique (1820)',
    description: `The topic of this text is “botanical geography,” which De Candolle defined as the “methodical study of facts relating to the distribution of plants on the globe,” and of the “general laws that can be deduced from them.” De Candolle made a firm distinction between “habitation (countries in which plants grow)” and “station (topographic nature of localities in which plants usually grow)” because he viewed the confusion between the two has prevented botanists from making the correct, natural classification of plants.
    This text is filled with empirical observations and statistical information to support De Candolle’s point that certain external factors (ex. amount of light, soil type, competition with local plants, etc.) and combinations of these factors have determined the distribution of plant species. As for the question of from where and how plants have originally spread throughout the world, he speculated that an ancient deluge must have occurred to transport species to unlikely regions, thereby implying his rejection of the idea of plant evolution from earlier species.`,
  },
  DC3: {
    fullName: 'De Candolle, Organographie végétale, Book V, Chapter II (1827)',
    description: `This is the most important text for the comparison between Goethe’s and De Candolle’s botany because it explains the key concepts of the primitive type and symmetry, which are similar to Goethe’s morphological concepts. In fact, Goethe considered this chapter important enough that he translated it into German himself.
    Unlike other two texts by De Candolle, this text hardly contains empirical information because it focuses on the concepts and the methodology, philosophy, and history behind them. His concept of symmetry, or the “non-geometrical regularity of organized bodies,” was roughly equivalent to Goethe’s concept of plant type, and served as the normative form that could undergo modifications, or “degenerations” (the term which Goethe disliked,) resulting in diverse plant forms in the present world.
    De Candolle strongly identified with René-Just Haüy’s method for crystallography. He also mentioned and acknowledged the similarity between Goethe’s and his own morphological views, but criticized Goethe’s ideas as being too general without enough facts.`,
  },
};
/* eslint-enable max-len */

export const TARGET_WIDTH = 10;
export const WAFFLE_WIDTH = 600;
export const WAFFLE_HEIGHT = 450;
export const CHART_MARGIN = {
  top: 30,
  bottom: 30,
  left: 30,
  right: 30,
};
