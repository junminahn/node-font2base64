import fs from 'fs';
import { encodeToDataSrcSync, encodeToDataSrc } from 'node-font2base64';

const FONTS_DIR = '../../test/fonts';

async function main() {
  const dataUrl1 = encodeToDataSrcSync(`${FONTS_DIR}/akronim-v9-latin-regular.ttf`);
  const base64 = fs.readFileSync(`${FONTS_DIR}/akronim-v9-latin-regular.ttf.base64`, 'utf8');

  // true
  console.log(dataUrl1 === base64);

  const dataUrl2 = await encodeToDataSrc(`${FONTS_DIR}/akronim-v9-latin-regular.ttf`);

  // true
  console.log(dataUrl2 === base64);
}

main();
