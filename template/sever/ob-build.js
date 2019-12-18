var fs =require('fs');
var cleanCSS = require('clean-css');
var minify = require('html-minifier').minify;
var UglifyJS = require("uglify-js");
var methods = require("./ob-dev");

const minifyCss = new cleanCSS().minify(methods.cssResult);
let htmlResult = methods.htmlResultStr.replace(/<link rel="stylesheet" type="text\/css" href="index.css">/g, `<style>${minifyCss.styles}</style>`);

var html =minify(htmlResult, {
	processScripts: ['text/html'],
	collapseWhitespace: true,
	minifyJS: {
		compress: {
			warnings: false,
			drop_debugger: true,
			drop_console: true
		}
	},
	minifyCSS: true,
	removeComments: true, //删除注释
	removeCommentsFromCDATA: true,
});
// bgImgData, deIconData, disIconData, disEdIconData
const resultCode = `"use strict";

var htmlResult = ${JSON.stringify(html)};
var bgImgData = "${methods.bgImgData}";
var deIconData = "${methods.deIconData}";
var disIconData = "${methods.disIconData}";
var disEdIconData = "${methods.disEdIconData}";
var accurateImgData = "${methods.accurateImgData}";
${methods.exportTemplate}`;

fs.writeFileSync("./template/result/outputBusiness.js",resultCode);
fs.writeFileSync("./template/result/outputBusiness.min.js",UglifyJS.minify(resultCode).code);
