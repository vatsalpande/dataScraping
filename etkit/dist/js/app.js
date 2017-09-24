/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 336);
/******/ })
/************************************************************************/
/******/ ({

/***/ 336:
/***/ (function(module, exports) {

//import 'table2excel';
function component() {
    const promises = [];
    for (let i = 1; i<= 2; i++ ) {
        const url = `https://www.et-i-kit.com/collections/dresses?page=${i}`;
        promises.push($.ajax(url));
    }

    $.when.apply($, promises).then(dressesSuccess, dressesFailure).always(dressesAlways);


    function dressesSuccess() {
        const tableData = [];
        tableData.push(`<table id = "response" class="display nowrap" cellspacing="0" width="100%">`);
        tableData.push(`<thead>
                <tr>
                <th>S.No</th>
                <th>Brand</th>
                <th>Item Name</th>
                <th>Price</th>
                </tr>
                </thead>
                <tfoot>
                <tr>
                <th>S.No</th>
                <th>Brand</th>
                <th>Item Name</th>
                <th>Price</th>
                </tr>
                </tfoot>`);

        let sequence = 1;
        [...arguments]
            .map(item => item[0])
            .forEach(item => {
                const cheerioHtml = cheerio.load(item);
                const info = [];

                cheerioHtml('#product-loop').children().each(function(i, elem) {
                    const productInfo = cheerio(elem).find(".product-info .product-info-inner")
                    const urlInfo = productInfo.find("a");
                    const brand = urlInfo.find("h4").text();
                    const itemName = urlInfo.find("h3").text();
                    const productPriceInfo = productInfo.find(".price .prod-price .money");
                    const price = productPriceInfo.text();
                    // console.info(price);
                    info.push({
                        brand, itemName, price
                    });
                });
                const resultString = info.map((item, index) => {
                    return `
            <tr>
                <td>${sequence++}</td>
                <td>${item.brand}</td>
                <td>${item.itemName}</td>
                <td>${item.price}</td>
            </tr>      
           `
                }).join("");
                tableData.push(`<tbody>${resultString}</tbody>`)
            });
        $("#container").html(tableData.join(""));

        $("#response").DataTable();
    }

    function dressesFailure(err) {

    }

    function dressesAlways() {

    }

    var element = document.createElement('div');
    // Lodash, currently included via a script, is required for this line to work
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
}

$(document).ready(function() {
    component();
})

/***/ })

/******/ });