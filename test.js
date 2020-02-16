const fs = require('fs');
const assert = require('assert');
const AssertionError = require('assert').AssertionError;

const font2base64 = require('./index');

describe('Generate base64 data src', function() {
  it(`should create a eot data src`, function(done) {
    const dataSrc = font2base64.encodeToDataSrcSync('./fonts/akronim-v9-latin-regular.eot');
    const expected = fs.readFileSync('./fonts/akronim-v9-latin-regular.eot.base64', 'utf8');
    assert.equal(dataSrc, expected);
    done();
  });

  it(`should create a svg data src`, function(done) {
    const dataSrc = font2base64.encodeToDataSrcSync('./fonts/akronim-v9-latin-regular.svg');
    const expected = fs.readFileSync('./fonts/akronim-v9-latin-regular.svg.base64', 'utf8');
    assert.equal(dataSrc, expected);
    done();
  });

  it(`should create a ttf data src`, function(done) {
    const dataSrc = font2base64.encodeToDataSrcSync('./fonts/akronim-v9-latin-regular.ttf');
    const expected = fs.readFileSync('./fonts/akronim-v9-latin-regular.ttf.base64', 'utf8');
    assert.equal(dataSrc, expected);
    done();
  });

  it(`should create a woff data src`, function(done) {
    const dataSrc = font2base64.encodeToDataSrcSync('./fonts/akronim-v9-latin-regular.woff');
    const expected = fs.readFileSync('./fonts/akronim-v9-latin-regular.woff.base64', 'utf8');
    assert.equal(dataSrc, expected);
    done();
  });

  it(`should create a woff2 data src`, function(done) {
    const dataSrc = font2base64.encodeToDataSrcSync('./fonts/akronim-v9-latin-regular.woff2');
    const expected = fs.readFileSync('./fonts/akronim-v9-latin-regular.woff2.base64', 'utf8');
    assert.equal(dataSrc, expected);
    done();
  });
});

describe('Generate base64 data src asynchronously', function() {
  it(`should create a eot data src`, async function() {
    const dataSrc = await font2base64.encodeToDataSrc('./fonts/akronim-v9-latin-regular.eot');
    const expected = fs.readFileSync('./fonts/akronim-v9-latin-regular.eot.base64', 'utf8');
    assert.equal(dataSrc, expected);
  });

  it(`should create a svg data src`, async function() {
    const dataSrc = await font2base64.encodeToDataSrc('./fonts/akronim-v9-latin-regular.svg');
    const expected = fs.readFileSync('./fonts/akronim-v9-latin-regular.svg.base64', 'utf8');
    assert.equal(dataSrc, expected);
  });

  it(`should create a ttf data src`, async function() {
    const dataSrc = await font2base64.encodeToDataSrc('./fonts/akronim-v9-latin-regular.ttf');
    const expected = fs.readFileSync('./fonts/akronim-v9-latin-regular.ttf.base64', 'utf8');
    assert.equal(dataSrc, expected);
  });

  it(`should create a woff data src`, async function() {
    const dataSrc = await font2base64.encodeToDataSrc('./fonts/akronim-v9-latin-regular.woff');
    const expected = fs.readFileSync('./fonts/akronim-v9-latin-regular.woff.base64', 'utf8');
    assert.equal(dataSrc, expected);
  });

  it(`should create a woff2 data src`, async function() {
    const dataSrc = await font2base64.encodeToDataSrc('./fonts/akronim-v9-latin-regular.woff2');
    const expected = fs.readFileSync('./fonts/akronim-v9-latin-regular.woff2.base64', 'utf8');
    assert.equal(dataSrc, expected);
  });
});

describe('Replace font src with base64 data src', function() {
  it(`should replace src`, function(done) {
    const tmp = fs.readFileSync('./example/example.css', 'utf8');
    fs.writeFileSync('./example/example_tmp.css', tmp, 'utf8');

    font2base64.injectBase64Sync('./fonts', './example/example_tmp.css');
    const result = fs.readFileSync('./example/example_tmp.css', 'utf8');
    const expected = fs.readFileSync('./example/example_2.css', 'utf8');
    fs.unlinkSync('./example/example_tmp.css');

    assert.equal(result, expected);
    done();
  });

  it(`should replace src asynchronously`, async function() {
    const tmp = fs.readFileSync('./example/example.css', 'utf8');
    fs.writeFileSync('./example/example_tmp.css', tmp, 'utf8');

    await font2base64.injectBase64('./fonts', './example/example_tmp.css');
    const result = fs.readFileSync('./example/example_tmp.css', 'utf8');
    const expected = fs.readFileSync('./example/example_2.css', 'utf8');
    fs.unlinkSync('./example/example_tmp.css');

    assert.equal(result, expected);
  });
});

describe('Replace font src in content with base64 data src', function() {
  it(`should replace src`, function(done) {
    const content = fs.readFileSync('./example/example.css', 'utf8');
    const result = font2base64.injectBase64Sync.fromContent('./fonts', content, {
      root: './example',
      fullpathMatch: true,
    });
    const expected = fs.readFileSync('./example/example_2.css', 'utf8');

    assert.equal(result.content, expected);
    done();
  });

  it(`should replace src asynchronously`, async function() {
    const content = fs.readFileSync('./example/example.css', 'utf8');
    const result = await font2base64.injectBase64.fromContent('./fonts', content, {
      root: './example',
      fullpathMatch: false,
    });
    const expected = fs.readFileSync('./example/example_2.css', 'utf8');

    assert.equal(result.content, expected);
  });
});

describe('Replace font src in buffer with base64 data src', function() {
  it(`should replace src`, function(done) {
    const buffer = fs.readFileSync('./example/example.css');
    const result = font2base64.injectBase64Sync.fromBuffer('./fonts', buffer, {
      root: './example',
      fullpathMatch: false,
    });
    const expected = fs.readFileSync('./example/example_2.css', 'utf8');

    assert.equal(result.content, expected);
    done();
  });

  it(`should replace src asynchronously`, async function() {
    const buffer = fs.readFileSync('./example/example.css');
    const result = await font2base64.injectBase64.fromBuffer('./fonts', buffer, {
      root: './example',
      fullpathMatch: true,
    });
    const expected = fs.readFileSync('./example/example_2.css', 'utf8');

    assert.equal(result.content, expected);
  });

  it(`should replace src by comparing base names`, function(done) {
    const buffer = fs.readFileSync('./example/example.css');
    const result = font2base64.injectBase64Sync.fromBuffer('./fonts', buffer);
    const expected = fs.readFileSync('./example/example_2.css', 'utf8');

    assert.equal(result.content, expected);
    done();
  });

  it(`should replace src by comparing base names asynchronously`, async function() {
    const buffer = fs.readFileSync('./example/example.css');
    const result = await font2base64.injectBase64.fromBuffer('./fonts', buffer);
    const expected = fs.readFileSync('./example/example_2.css', 'utf8');

    assert.equal(result.content, expected);
  });
});

describe('Replace font src with base64 data src without resave', function() {
  it(`should replace src`, function(done) {
    const results = font2base64.injectBase64Sync('./fonts', './example/example.css', { resave: false });
    const expected = fs.readFileSync('./example/example_2.css', 'utf8');

    assert.equal(results[0].modified, true);
    assert.equal(results[0].content, expected);
    done();
  });

  it(`should replace src asynchronously`, async function() {
    const results = await font2base64.injectBase64('./fonts', './example/example.css', { resave: false });
    const expected = fs.readFileSync('./example/example_2.css', 'utf8');

    assert.equal(results[0].modified, true);
    assert.equal(results[0].content, expected);
  });
});
