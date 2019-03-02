
export const COLORS = {
  Descriptive: '#7030A0',
  Empirical: '#9933FF',
  'Historical, descriptive': '#660066',
  Historical: '#660066',
  'Classificatory definition': '#CC3399',
  Classificatory: '#CC3399',
  Numerical: '#CC99FF',

  Characterizing: '#01B050',
  Philosophical: '#66FFCC',
  'Philosophical, epistemological': '#66FFCC',
  Methodological: '#00CC99',
  Classical: '#006600',
  Romantic: '#00FF02',

  Logical: '#FF0000',
  'Rational, speculative': '#FF3301',
  Inductive: '#FF99CB',
  Deductive: '#990001',
  Analogical: '#FF0166',

  Decorative: '#FFC001',
  Metaphorical: '#CC9900',
  'Metaphorical, visual': '#CC9900',
  'Agency to nature': '#FFFF02',
  'Metaphor-AgencyNature': '#FFFF02',

  Persuasive: '#0070C0',
  'Future, utility': '#66FFFF',
  'Future-Utility': '#66FFFF',
  'Writing aim, direction': '#0066FF',
  'Writing direction': '#0066FF'
};

export const categoryRelationships = [
  {cat: 'Empirical',	superCat: 'Descriptive'},
  {cat: 'Historical',	superCat: 'Descriptive'},
  {cat: 'Classificatory',	superCat: 'Descriptive'},
  {cat: 'Numerical',	superCat: 'Descriptive'},
  {cat: 'Philosophical',	superCat: 'Characterizing'},
  {cat: 'Methodological',	superCat: 'Characterizing'},
  {cat: 'Classical',	superCat: 'Characterizing'},
  {cat: 'Romantic',	superCat: 'Characterizing'},
  {cat: 'Rational-Speculative',	superCat: 'Logical'},
  {cat: 'Inductive',	superCat: 'Logical'},
  {cat: 'Deductive',	superCat: 'Logical'},
  {cat: 'Analogical',	superCat: 'Logical'},
  {cat: 'Metaphorical',	superCat: 'Decorative'},
  {cat: 'Metaphorical-Agency to nature',	superCat: 'Decorative'},
  {cat: 'Future-Utility',	superCat: 'Persuasive'},
  {cat: 'Writing direction',	superCat: 'Persuasive'},
  {cat: 'Blank',	superCat: 'NA'}
];

export const TARGET_WIDTH = 10;
