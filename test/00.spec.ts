import 'mocha';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { expect } from 'chai';
import { encodeToDataSrcSync, encodeToDataSrc, injectBase64Sync, injectBase64 } from '../src';

describe('Generate base64 data src', function () {
  it(`should create a eot data src`, function (done) {
    const dataSrc = encodeToDataSrcSync('fonts/akronim-v9-latin-regular.eot');
    const expected = readFileSync('fonts/akronim-v9-latin-regular.eot.base64', 'utf8');
    expect(dataSrc).to.equal(expected);
    done();
  });

  it(`should create a svg data src`, function (done) {
    const dataSrc = encodeToDataSrcSync('./fonts/akronim-v9-latin-regular.svg');
    const expected = readFileSync('./fonts/akronim-v9-latin-regular.svg.base64', 'utf8');
    expect(dataSrc).to.equal(expected);
    done();
  });

  it(`should create a ttf data src`, function (done) {
    const dataSrc = encodeToDataSrcSync('./fonts/akronim-v9-latin-regular.ttf');
    const expected = readFileSync('./fonts/akronim-v9-latin-regular.ttf.base64', 'utf8');
    expect(dataSrc).to.equal(expected);
    done();
  });

  it(`should create a woff data src`, function (done) {
    const dataSrc = encodeToDataSrcSync('./fonts/akronim-v9-latin-regular.woff');
    const expected = readFileSync('./fonts/akronim-v9-latin-regular.woff.base64', 'utf8');
    expect(dataSrc).to.equal(expected);
    done();
  });

  it(`should create a woff2 data src`, function (done) {
    const dataSrc = encodeToDataSrcSync('./fonts/akronim-v9-latin-regular.woff2');
    const expected = readFileSync('./fonts/akronim-v9-latin-regular.woff2.base64', 'utf8');
    expect(dataSrc).to.equal(expected);
    done();
  });
});

describe('Generate base64 data src asynchronously', function () {
  it(`should create a eot data src`, async function () {
    const dataSrc = await encodeToDataSrc('./fonts/akronim-v9-latin-regular.eot');
    const expected = readFileSync('./fonts/akronim-v9-latin-regular.eot.base64', 'utf8');
    expect(dataSrc).to.equal(expected);
  });

  it(`should create a svg data src`, async function () {
    const dataSrc = await encodeToDataSrc('./fonts/akronim-v9-latin-regular.svg');
    const expected = readFileSync('./fonts/akronim-v9-latin-regular.svg.base64', 'utf8');
    expect(dataSrc).to.equal(expected);
  });

  it(`should create a ttf data src`, async function () {
    const dataSrc = await encodeToDataSrc('./fonts/akronim-v9-latin-regular.ttf');
    const expected = readFileSync('./fonts/akronim-v9-latin-regular.ttf.base64', 'utf8');
    expect(dataSrc).to.equal(expected);
  });

  it(`should create a woff data src`, async function () {
    const dataSrc = await encodeToDataSrc('./fonts/akronim-v9-latin-regular.woff');
    const expected = readFileSync('./fonts/akronim-v9-latin-regular.woff.base64', 'utf8');
    expect(dataSrc).to.equal(expected);
  });

  it(`should create a woff2 data src`, async function () {
    const dataSrc = await encodeToDataSrc('./fonts/akronim-v9-latin-regular.woff2');
    const expected = readFileSync('./fonts/akronim-v9-latin-regular.woff2.base64', 'utf8');
    expect(dataSrc).to.equal(expected);
  });
});

describe('Replace font src with base64 data src', function () {
  it(`should replace src`, function (done) {
    const tmp = readFileSync('./example/example.css', 'utf8');
    writeFileSync('./example/example_tmp.css', tmp, 'utf8');

    injectBase64Sync('./fonts', './example/example_tmp.css');
    const result = readFileSync('./example/example_tmp.css', 'utf8');
    const expected = readFileSync('./example/example_2.css', 'utf8');
    unlinkSync('./example/example_tmp.css');

    expect(result).to.equal(expected);
    done();
  });

  it(`should replace src asynchronously`, async function () {
    const tmp = readFileSync('./example/example.css', 'utf8');
    writeFileSync('./example/example_tmp.css', tmp, 'utf8');

    await injectBase64('./fonts', './example/example_tmp.css');
    const result = readFileSync('./example/example_tmp.css', 'utf8');
    const expected = readFileSync('./example/example_2.css', 'utf8');
    unlinkSync('./example/example_tmp.css');

    expect(result).to.equal(expected);
  });
});

describe('Replace font src in content with base64 data src', function () {
  it(`should replace src`, function (done) {
    const content = readFileSync('./example/example.css', 'utf8');
    const result = injectBase64Sync.fromContent('./fonts', content, {
      root: './example',
      fullpathMatch: true,
    });
    const expected = readFileSync('./example/example_2.css', 'utf8');
    expect(result.content).to.equal(expected);
    done();
  });

  it(`should replace src asynchronously`, async function () {
    const content = readFileSync('./example/example.css', 'utf8');
    const result = await injectBase64.fromContent('./fonts', content, {
      root: './example',
      fullpathMatch: false,
    });
    const expected = readFileSync('./example/example_2.css', 'utf8');

    expect(result.content).to.equal(expected);
  });
});

describe('Replace font src in buffer with base64 data src', function () {
  it(`should replace src`, function (done) {
    const buffer = readFileSync('./example/example.css');
    const result = injectBase64Sync.fromBuffer('./fonts', buffer, {
      root: './example',
      fullpathMatch: false,
    });
    const expected = readFileSync('./example/example_2.css', 'utf8');

    expect(result.content).to.equal(expected);
    done();
  });

  it(`should replace src asynchronously`, async function () {
    const buffer = readFileSync('./example/example.css');
    const result = await injectBase64.fromBuffer('./fonts', buffer, {
      root: './example',
      fullpathMatch: true,
    });
    const expected = readFileSync('./example/example_2.css', 'utf8');

    expect(result.content).to.equal(expected);
  });

  it(`should replace src by comparing base names`, function (done) {
    const buffer = readFileSync('./example/example.css');
    const result = injectBase64Sync.fromBuffer('./fonts', buffer);
    const expected = readFileSync('./example/example_2.css', 'utf8');

    expect(result.content).to.equal(expected);
    done();
  });

  it(`should replace src by comparing base names asynchronously`, async function () {
    const buffer = readFileSync('./example/example.css');
    const result = await injectBase64.fromBuffer('./fonts', buffer);
    const expected = readFileSync('./example/example_2.css', 'utf8');

    expect(result.content).to.equal(expected);
  });
});

describe('Replace font src with base64 data src without resave', function () {
  it(`should replace src`, function (done) {
    const results = injectBase64Sync('./fonts', './example/example.css', { resave: false });
    const expected = readFileSync('./example/example_2.css', 'utf8');

    expect(results).to.be.an('array');
    if (Array.isArray(results)) {
      expect(results[0].modified).to.equal(true);
      expect(results[0].content).to.equal(expected);
    }

    done();
  });

  it(`should replace src asynchronously`, async function () {
    const results = await injectBase64('./fonts', './example/example.css', { resave: false });
    const expected = readFileSync('./example/example_2.css', 'utf8');

    expect(results).to.be.an('array');
    if (Array.isArray(results)) {
      expect(results[0].modified).to.equal(true);
      expect(results[0].content).to.equal(expected);
    }
  });
});
