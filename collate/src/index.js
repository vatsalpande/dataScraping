//import 'table2excel';
import $ from 'jquery';
import cheerio from 'cheerio';

import("datatables.net");
    import("datatables.net-bs");
import 'datatables.net-buttons/js/buttons.colVis.js' ;
import  'datatables.net-buttons/js/buttons.html5.js'  ;
import 'datatables.net-buttons/js/buttons.flash.js'   ;
import 'datatables.net-buttons/js/buttons.print.js'   ;

import 'datatables.net-dt/css/jquery.dataTables.css'



function component(itemDetails) {
    $("#please-wait").show();
    $("#container").html("");
    $("#item-type").html(`<h3>${itemDetails.title}</h3>`)
    const promises = [];
    const length = itemDetails.pages;
    for (let i = 1; i<= length; i++ ) {
        const url = `${itemDetails.url}`;
        promises.push($.ajax(url));
    }
    $.when.apply($, promises).then(dressesSuccess, dressesFailure).always(dressesAlways);

    function dressesSuccess() {
        const tableData = [];
        tableData.push(`<table id = "response" class="display nowrap" cellspacing="0" width="100%">`);
        tableData.push(`<thead>
                <tr>
                <th>S.No</th>
                <th>Item Name</th>
                <th>Price</th>
                </tr>
                </thead>
                `);

        let sequence = 1;
        const resultString = [];
        let result;
        if (length === 1 ) {
            console.info (arguments[0]);
            result = [arguments[0]];
        }else {
            result = [...arguments]
                .map(item => {
                    console.info ({item});
                    console.info ({value: item[0]});
                    return item[0]
                });
        }
            result.forEach(item => {

                const cheerioHtml = cheerio.load(item);
                console.info ({cheerioHtml});
                const info = [];

                cheerioHtml('ul.product_list').children("li.ajax_block_product").each(function(i, elem) {
                    const productInfo = cheerio(elem).find(".ajax_block_product .right-block.pr-l-text");
                    //const urlInfo = productInfo.find("a");
                    //const brand = urlInfo.find("h4").text();
                    const itemName = productInfo.find(".font-d.co-tt").text().trim();
                    const price = productInfo.find("p .price.product-price").text().trim();
                    // const productPriceInfo = productInfo.find(".price .prod-price .money");
                    // const price = productPriceInfo.text();
                    // // console.info(price);
                    info.push({
                        itemName, price
                    });
                });
                const result = info.map((item) => {
                    return `
            <tr>
                <td>${sequence++}</td>
                <td>${item.itemName}</td>
                <td>${item.price}</td>
            </tr>      
           `
                }).join("");
                resultString.push(result);
            });
        console.info (resultString);
        console.info (resultString.join(" "));
        tableData.push(`<tbody>${resultString.join(" ")}</tbody>`)
        $("#container").html(tableData.join(""));

        $("#response").DataTable({
            "paging":   false,
            "info":     false,
            dom: 'Bfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'pdf', 'print'
            ]
        });
    }

    function dressesFailure(err) {
        alert('There is some problem showing the data');
    }

    function dressesAlways() {
        $("#please-wait").hide();
    }
}

function init(type = "dresses") {

    const itemMapping = {
        "dresses" : {
            title: 'Dresses',
            url : "https://collatethelabel.com/13-dresses?id_category=13&n=48",
            pages:1

        },
        "tops" : {
            title: 'Tops',
            url : "https://collatethelabel.com/14-tops",
            pages:1

        },
        "bottoms" : {
            title: 'Bottoms',
            url : "https://collatethelabel.com/15-bottoms",
            pages:1

        },
        "jumpsuits" : {
            title: 'Jumpsuits',
            url : "https://collatethelabel.com/17-playsuits-jumpsuits",
            pages:1

        },
    }

    if (itemMapping[type]) {
        component(itemMapping[type])
    }else {
        alert('No url exist for type specified. Please check');
    }
}

$(document).ready(function(){
    init();

    $("#tops").click(function() {
        init("tops");
    });
    $("#dresses").click(function() {
        init("dresses");
    });
    $("#bottoms").click(function() {
        init("bottoms");
    });
    $("#jumpsuits").click(function() {
        init("jumpsuits");
    });

})