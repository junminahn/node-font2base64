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
