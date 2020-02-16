# node-font2base64

[![NPM version](https://img.shields.io/npm/v/node-font2base64.svg)](https://www.npmjs.com/package/node-font2base64)
[![Dependency Status](https://david-dm.org/junminahn/node-font2base64/status.svg)](https://david-dm.org/junminahn/node-font2base64)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](/LICENSE)

Convert font to base64 url or src, and to inject src into style files

## Installation
```sh
$ npm install node-font2base64
```

## API
### .encodeToDataUrl (fontpath)
* Convert font file(s) to font-media base64 data url asynchronously
* `fontpath`: {string} | {Array{string}}
* Returns: {Promise} containing {string} | {Array{string}}
```js
const dataUrl = await font2base64.encodeToDataUrl('fonts/myfont-regular.ttf')
// => data:font/truetype;charset=utf-8;base64,<base64>
```

### .encodeToDataUrlSync (fontpath)
* Convert font file(s) to font-media base64 data url synchronously
* `fontpath`: {string} | {Array{string}}
* Returns: {string} | {Array{string}}
```js
const dataUrl = font2base64.encodeToDataUrlSync('fonts/myfont-regular.woff')
// => data:application/font-woff;charset=utf-8;base64,<base64>
```

### .encodeToDataSrc (fontpath)
* Convert font file(s) to font-media base64 data src asynchronously
* `fontpath`: {string} | {Array{string}}
* Returns: {Promise} containing {string} | {Array{string}}
```js
const dataSrc = await font2base64.encodeToDataSrc('fonts/myfont-regular.ttf')
// => url(data:font/truetype;charset=utf-8;base64,<base64>) format('truetype')
```

### .encodeToDataSrcSync (fontpath)
* Convert font file(s) to font-media base64 data src synchronously
* `fontpath`: {string} | {Array{string}}
* Returns: {string} | {Array{string}}
```js
const dataSrc = font2base64.encodeToDataSrcSync('fonts/myfont-regular.woff')
// => url(data:application/font-woff;charset=utf-8;base64,<base64>) format('woff')
```

### .injectBase64 (fontpath, stylepath[, options])
* Replace font url(s) in style file(s) with font-media base64 data src asynchronously
* `fontpath`: {string} | {Array{string}}
* `stylepath`: {string} | {Array{string}}
* `options`: {Object}
    * `validator`: {Function}: (abs|base_font_url, abs|base_font_path, original_font_url, original_font_path) => boolean
        * check if font url in a style file matches to font file's basename
        * default to comparing both paths' basenames
    * `fontTypes`: {Array{string}}
        * allowed font ext names
        * default to ['.svg', '.ttf', '.otf', '.eot', '.sfnt', '.woff2', '.woff']
    * `cssTypes`: {Array{string}}
        * allowed style ext names
        * default to ['.css', '.scss', '.less']
    * `resave`: {boolean}
        * resave modified style files
        * default to true
    * `fullpathMatch`: {boolean}
        * match full url / path to validate paths
        * default to false
* Returns: {Promise} containing {true | Error} | {Array{result} | Error}
```js
const result = await font2base64.injectBase64('./fonts', './styles')
// => true

const result = await font2base64.injectBase64('./fonts', './styles', { resave: false })
// => [{ modified: true, filepath: './styles/example.css', content: '...' }]
```

### .injectBase64Sync (fontpath, stylepath[, options])
* Replace font url(s) in style file(s) with font-media base64 data src synchronously
* `fontpath`: {string} | {Array{string}}
* `stylepath`: {string} | {Array{string}}
* `options`: {Object}
    * `validator`: {Function}: (abs|base_font_url, abs|base_font_path, original_font_url, original_font_path) => boolean
        * check if font url in a style file matches to font file's basename
        * default to comparing both paths' basenames
    * `fontTypes`: {Array{string}}
        * allowed font ext names
        * default to ['.svg', '.ttf', '.otf', '.eot', '.sfnt', '.woff2', '.woff']
    * `cssTypes`: {Array{string}}
        * allowed style ext names
        * default to ['.css', '.scss', '.less']
    * `resave`: {boolean}
        * resave modified style files
        * default to true
    * `fullpathMatch`: {boolean}
        * match full url / path to validate paths
        * default to false
* Returns: {true | Error} | {Array{result} | Error}
```js
const result = font2base64.injectBase64Sync('./fonts', './styles')
// => true

const result = font2base64.injectBase64Sync('./fonts', './styles', { resave: false })
// => [{ modified: true, filepath: './styles/example.css', content: '...' }]
```

### .injectBase64.fromContent (fontpath, content[, options])
* Replace font url(s) in style content with font-media base64 data src asynchronously
* `fontpath`: {string} | {Array{string}}
* `content`: {string}
* `options`: {Object}
    * `validator`: {Function}: (abs|base_font_url, abs|base_font_path, original_font_url, original_font_path) => boolean
        * check if font url in a style file matches to font file's basename
        * default to comparing both paths' basenames
    * `fontTypes`: {Array{string}}
        * allowed font ext names
        * default to ['.svg', '.ttf', '.otf', '.eot', '.sfnt', '.woff2', '.woff']
    * `fullpathMatch`: {boolean}
        * match full url / path to validate paths
        * default to false
    * `root`: {string}
        * directory path which the content originated from
        * use basenames to compare font urls in style files if omitted
* Returns: {Promise} containing {result | Error}
```js
const result = await font2base64.injectBase64.fromContent('./fonts', '...@font-face {...')
// => [{ modified: true, content: '...' }]
```

### .injectBase64Sync.fromContent (fontpath, content[, options])
* Replace font url(s) in style content with font-media base64 data src synchronously
* `fontpath`: {string} | {Array{string}}
* `content`: {string}
* `options`: {Object}
    * `validator`: {Function}: (abs|base_font_url, abs|base_font_path, original_font_url, original_font_path) => boolean
        * check if font url in a style file matches to font file's basename
        * default to comparing both paths' basenames
    * `fontTypes`: {Array{string}}
        * allowed font ext names
        * default to ['.svg', '.ttf', '.otf', '.eot', '.sfnt', '.woff2', '.woff']
    * `fullpathMatch`: {boolean}
        * match full url / path to validate paths
        * default to false
    * `root`: {string}
        * directory path which the content originated from
        * use basenames to compare font urls in style files if omitted
* Returns: {result | Error}
```js
const result = injectBase64Sync.injectBase64.fromContent('./fonts', '...@font-face {...')
// => [{ modified: true, content: '...' }]
```

### .injectBase64.fromBuffer (fontpath, buffer[, options])
* Replace font url(s) in style buffer with font-media base64 data src asynchronously
* `fontpath`: {string} | {Array{string}}
* `buffer`: {Buffer}
* `options`: {Object}
    * `validator`: {Function}: (abs|base_font_url, abs|base_font_path, original_font_url, original_font_path) => boolean
        * check if font url in a style file matches to font file's basename
        * default to comparing both paths' basenames
    * `fontTypes`: {Array{string}}
        * allowed font ext names
        * default to ['.svg', '.ttf', '.otf', '.eot', '.sfnt', '.woff2', '.woff']
    * `fullpathMatch`: {boolean}
        * match full url / path to validate paths
        * default to false
    * `root`: {string}
        * directory path which the buffer originated from
        * use basenames to compare font urls in style files if omitted
* Returns: {Promise} containing {result | Error}
```js
const result = await font2base64.injectBase64.fromBuffer('./fonts', Buffer 54 65 73 74...)
// => [{ modified: true, content: '...' }]
```

### .injectBase64Sync.fromBuffer (fontpath, content[, options])
* Replace font url(s) in style buffer with font-media base64 data src synchronously
* `fontpath`: {string} | {Array{string}}
* `buffer`: {Buffer}
* `options`: {Object}
    * `validator`: {Function}: (abs|base_font_url, abs|base_font_path, original_font_url, original_font_path) => boolean
        * check if font url in a style file matches to font file's basename
        * default to comparing both paths' basenames
    * `fontTypes`: {Array{string}}
        * allowed font ext names
        * default to ['.svg', '.ttf', '.otf', '.eot', '.sfnt', '.woff2', '.woff']
    * `fullpathMatch`: {boolean}
        * match full url / path to validate paths
        * default to false
    * `root`: {string}
        * directory path which the buffer originated from
        * use basenames to compare font urls in style files if omitted
* Returns: {result | Error}
```js
const result = injectBase64Sync.injectBase64.fromBuffer('./fonts', Buffer 54 65 73 74...)
// => [{ modified: true, content: '...' }]
```

### [MIT Licensed](LICENSE)