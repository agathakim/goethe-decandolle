const fs = require('fs/promises');

async function main() {
  const textNames = [
    ['landing.md', 'intro'],
    ['methodology.md', 'methodology'],
    ['thanks.md', 'thanks'],
  ];
  const explanations = await fs
    .readFile('./src/texts/text-explanations.json')
    .then(x => JSON.parse(x));
  const texts = {
    texts: explanations,
    contact:
      'If you are interested in this work, please reach out! Agatha is available at agatha@uchicago.edu. Andrew is available at mcnutt@uchicago.edu',
  };
  for (let idx = 0; idx < textNames.length; idx++) {
    const [location, name] = textNames[idx];
    const text = await fs.readFile(`./src/texts/${location}`, 'utf-8');
    texts[name] = text;
  }
  fs.writeFile('./src/texts/texts.json', JSON.stringify(texts, null, 2));
}

main();
