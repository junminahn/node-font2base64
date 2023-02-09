import 'mocha';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { expect } from 'chai';
import { encodeToDataSrcSync, encodeToDataSrc, injectBase64Sync, injectBase64 } from '../src';

const SAMPLE_DIR = `${__dirname}/sample`;
const FONTS_DIR = `${__dirname}/fonts`;

describe('Generate base64 data src', function () {
  console.log('__dirname__dirname', __dirname);
  it(`should create a eot data src`, function (done) {
    const dataSrc = encodeToDataSrcSync(`${FONTS_DIR}/akronim-v9-latin-regular.eot`);
    const expected = readFileSync(`${FONTS_DIR}/akronim-v9-latin-regular.eot.base64`, 'utf8');
    expect(dataSrc).to.equal(expected);
    done();
  });

  it(`should create a svg data src`, function (done) {
    const dataSrc = encodeToDataSrcSync(`${FONTS_DIR}/akronim-v9-latin-regular.svg`);
    const expected = readFileSync(`${FONTS_DIR}/akronim-v9-latin-regular.svg.base64`, 'utf8');
    expect(dataSrc).to.equal(expected);
    done();
  });

  it(`should create a ttf data src`, function (done) {
    const dataSrc = encodeToDataSrcSync(`${FONTS_DIR}/akronim-v9-latin-regular.ttf`);
    const expected = readFileSync(`${FONTS_DIR}/akronim-v9-latin-regular.ttf.base64`, 'utf8');
    expect(dataSrc).to.equal(expected);
    done();
  });

  it(`should create a woff data src`, function (done) {
    const dataSrc = encodeToDataSrcSync(`${FONTS_DIR}/akronim-v9-latin-regular.woff`);
    const expected = readFileSync(`${FONTS_DIR}/akronim-v9-latin-regular.woff.base64`, 'utf8');
    expect(dataSrc).to.equal(expected);
    done();
  });

  it(`should create a woff2 data src`, function (done) {
    const dataSrc = encodeToDataSrcSync(`${FONTS_DIR}/akronim-v9-latin-regular.woff2`);
    const expected = readFileSync(`${FONTS_DIR}/akronim-v9-latin-regular.woff2.base64`, 'utf8');
    expect(dataSrc).to.equal(expected);
    done();
  });
});

describe('Generate base64 data src asynchronously', function () {
  it(`should create a eot data src`, async function () {
    const dataSrc = await encodeToDataSrc(`${FONTS_DIR}/akronim-v9-latin-regular.eot`);
    const expected = readFileSync(`${FONTS_DIR}/akronim-v9-latin-regular.eot.base64`, 'utf8');
    expect(dataSrc).to.equal(expected);
  });

  it(`should create a svg data src`, async function () {
    const dataSrc = await encodeToDataSrc(`${FONTS_DIR}/akronim-v9-latin-regular.svg`);
    const expected = readFileSync(`${FONTS_DIR}/akronim-v9-latin-regular.svg.base64`, 'utf8');
    expect(dataSrc).to.equal(expected);
  });

  it(`should create a ttf data src`, async function () {
    const dataSrc = await encodeToDataSrc(`${FONTS_DIR}/akronim-v9-latin-regular.ttf`);
    const expected = readFileSync(`${FONTS_DIR}/akronim-v9-latin-regular.ttf.base64`, 'utf8');
    expect(dataSrc).to.equal(expected);
  });

  it(`should create a woff data src`, async function () {
    const dataSrc = await encodeToDataSrc(`${FONTS_DIR}/akronim-v9-latin-regular.woff`);
    const expected = readFileSync(`${FONTS_DIR}/akronim-v9-latin-regular.woff.base64`, 'utf8');
    expect(dataSrc).to.equal(expected);
  });

  it(`should create a woff2 data src`, async function () {
    const dataSrc = await encodeToDataSrc(`${FONTS_DIR}/akronim-v9-latin-regular.woff2`);
    const expected = readFileSync(`${FONTS_DIR}/akronim-v9-latin-regular.woff2.base64`, 'utf8');
    expect(dataSrc).to.equal(expected);
  });
});

describe('Replace font src with base64 data src', function () {
  it(`should replace src`, function (done) {
    const tmp = readFileSync(`${SAMPLE_DIR}/example.css`, 'utf8');
    writeFileSync(`${SAMPLE_DIR}/example_tmp.css`, tmp, 'utf8');

    injectBase64Sync(FONTS_DIR, `${SAMPLE_DIR}/example_tmp.css`);
    const result = readFileSync(`${SAMPLE_DIR}/example_tmp.css`, 'utf8');
    const expected = readFileSync(`${SAMPLE_DIR}/example_2.css`, 'utf8');
    unlinkSync(`${SAMPLE_DIR}/example_tmp.css`);

    expect(result).to.equal(expected);
    done();
  });

  it(`should replace src asynchronously`, async function () {
    const tmp = readFileSync(`${SAMPLE_DIR}/example.css`, 'utf8');
    writeFileSync(`${SAMPLE_DIR}/example_tmp.css`, tmp, 'utf8');

    await injectBase64(FONTS_DIR, `${SAMPLE_DIR}/example_tmp.css`);
    const result = readFileSync(`${SAMPLE_DIR}/example_tmp.css`, 'utf8');
    const expected = readFileSync(`${SAMPLE_DIR}/example_2.css`, 'utf8');
    unlinkSync(`${SAMPLE_DIR}/example_tmp.css`);

    expect(result).to.equal(expected);
  });
});

describe('Replace font src in content with base64 data src', function () {
  it(`should replace src`, function (done) {
    const content = readFileSync(`${SAMPLE_DIR}/example.css`, 'utf8');
    const result = injectBase64Sync.fromContent(FONTS_DIR, content, {
      root: SAMPLE_DIR,
      fullpathMatch: true,
    });
    const expected = readFileSync(`${SAMPLE_DIR}/example_2.css`, 'utf8');
    expect(result.content).to.equal(expected);
    done();
  });

  it(`should replace src asynchronously`, async function () {
    const content = readFileSync(`${SAMPLE_DIR}/example.css`, 'utf8');
    const result = await injectBase64.fromContent(FONTS_DIR, content, {
      root: SAMPLE_DIR,
      fullpathMatch: false,
    });
    const expected = readFileSync(`${SAMPLE_DIR}/example_2.css`, 'utf8');

    expect(result.content).to.equal(expected);
  });
});

describe('Replace font src in buffer with base64 data src', function () {
  it(`should replace src`, function (done) {
    const buffer = readFileSync(`${SAMPLE_DIR}/example.css`);
    const result = injectBase64Sync.fromBuffer(FONTS_DIR, buffer, {
      root: SAMPLE_DIR,
      fullpathMatch: false,
    });
    const expected = readFileSync(`${SAMPLE_DIR}/example_2.css`, 'utf8');

    expect(result.content).to.equal(expected);
    done();
  });

  it(`should replace src asynchronously`, async function () {
    const buffer = readFileSync(`${SAMPLE_DIR}/example.css`);
    const result = await injectBase64.fromBuffer(FONTS_DIR, buffer, {
      root: SAMPLE_DIR,
      fullpathMatch: true,
    });
    const expected = readFileSync(`${SAMPLE_DIR}/example_2.css`, 'utf8');

    expect(result.content).to.equal(expected);
  });

  it(`should replace src by comparing base names`, function (done) {
    const buffer = readFileSync(`${SAMPLE_DIR}/example.css`);
    const result = injectBase64Sync.fromBuffer(FONTS_DIR, buffer);
    const expected = readFileSync(`${SAMPLE_DIR}/example_2.css`, 'utf8');

    expect(result.content).to.equal(expected);
    done();
  });

  it(`should replace src by comparing base names asynchronously`, async function () {
    const buffer = readFileSync(`${SAMPLE_DIR}/example.css`);
    const result = await injectBase64.fromBuffer(FONTS_DIR, buffer);
    const expected = readFileSync(`${SAMPLE_DIR}/example_2.css`, 'utf8');

    expect(result.content).to.equal(expected);
  });
});

describe('Replace font src with base64 data src without resave', function () {
  it(`should replace src`, function (done) {
    const results = injectBase64Sync(FONTS_DIR, `${SAMPLE_DIR}/example.css`, { resave: false });
    const expected = readFileSync(`${SAMPLE_DIR}/example_2.css`, 'utf8');

    expect(results).to.be.an('array');
    if (Array.isArray(results)) {
      expect(results[0].modified).to.equal(true);
      expect(results[0].content).to.equal(expected);
    }

    done();
  });

  it(`should replace src asynchronously`, async function () {
    const results = await injectBase64(FONTS_DIR, `${SAMPLE_DIR}/example.css`, { resave: false });
    const expected = readFileSync(`${SAMPLE_DIR}/example_2.css`, 'utf8');

    expect(results).to.be.an('array');
    if (Array.isArray(results)) {
      expect(results[0].modified).to.equal(true);
      expect(results[0].content).to.equal(expected);
    }
  });
});
