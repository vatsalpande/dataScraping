(function () {

    const totalRecordsContainer = $("#totalRecords");
    const totalRecordsUrl = "https://www.zalora.co.id/_c/rpc?&req=%7B%22method%22%3A%22Costa.ListFilters%22%2C%22params%22%3A%5B%7B%22category_id%22%3A%5B%22190%22%5D%2C%22limit%22%3A72%2C%22offset%22%3A0%2C%22segment%22%3A%22women%22%2C%22dir%22%3A%22desc%22%2C%22sort%22%3A%22popularity%22%2C%22catalog_type%22%3A%22%22%2C%22url_key%22%3A%22%2Fwomen%2Fpakaian%2Fplaysuit-jumpsuit%22%2C%22enable_visual_sort%22%3Atrue%7D%5D%7D&lang=id"

    let totalRecords = ' Not Available';

    const totalRecordsSuccess = function totalRecordsSuccess(data) {
        try {
            const result = data && data.result ?  data.result.numFound : null;
            if (result != null ) {
                const allResult = [];
                const resultSuccess = function resultSuccess() {
                    const tableData = [];
                    tableData.push(`<table id = "response" class="display nowrap" cellspacing="0" width="100%">`);
                    tableData.push(`<thead>
                <tr>
                <th>Name</th>
                <th>Available Sizes</th>
                <th>Price</th>
                <th>Special Price</th>
                <th>Max Price</th>
                <th>Saving Percent</th>
                <th>Brand</th>
                <th>Color Family</th>
                </tr>
                </thead>
                <tfoot>
                <tr>
                <th>Name</th>
                <th>Available Sizes</th>
                <th>Price</th>
                <th>Special Price</th>
                <th>Max Price</th>
                <th>Saving Percent</th>
                <th>Brand</th>
                <th>Color Family</th>
                </tr>
                </tfoot>`);
                    const result = [...arguments]
                        .filter(item => item.length >0 && item[0])
                        .map(item => JSON.parse(JSON.stringify(item[0])))
                        .forEach(item => {
                            item.split('{"meta":')
                                .filter(item => {
                                    return item;
                                })
                                .forEach(resultItem => {
                                    try {
                                        resultItem = resultItem.replace("\n", "");
                                        // resultItem = { + resultItem;
                                        resultItem = `{"data":${resultItem}`;
                                        const resultData = JSON.parse(resultItem);
                                        const availableSize = resultData.available_sizes.map(item => item.label).join(", ");
                                        const prices = resultData.data.price || NOT_AVAILABLE;
                                        const name = resultData.data.name || NOT_AVAILABLE;
                                        const maxPrice = resultData.data.max_price || NOT_AVAILABLE;
                                        const specialPrice = resultData.data.special_price ||NOT_AVAILABLE;
                                        const savingPercent = resultData.data.max_saving_percentage || NOT_AVAILABLE;
                                        const brand = resultData.data.brand ||  NOT_AVAILABLE;
                                        const colorFamily = resultData.data.color_family ||  NOT_AVAILABLE;
                                        //const name =
                                        allResult.push({
                                            availableSize,
                                            prices,
                                            name,
                                            maxPrice,
                                            specialPrice,
                                            savingPercent,
                                            brand,
                                            colorFamily
                                        });
                                    }catch(exception) {
                                        console.info (exception);
                                    }

                                });
                        });
                    let resultString = allResult.map(item => {
                        return `
<tr>
                            <td>${item.name}</td>
                            <td>${item.availableSize}</td>
                            <td>${item.prices}</td>
                            <td>${item.specialPrice}</td>
                            <td>${item.maxPrice}</td>
                            <td>${item.savingPercent}</td>
                            <td>${item.brand}</td>
                            <td>${item.colorFamily}</td>
                            </tr>
                        `
                    }).join("");
                    tableData.push(`<tbody>${resultString}</tbody>`)

                    $("#details").html(tableData.join(""));
                    $("#response").DataTable({
                        "paging":   false,
                        "info":     false,
                        dom: 'Bfrtip',
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print'
                        ]
                    } );

                }
                const resultFailure = function resultFailure(err) {
                    console.info ('Inside failure');
                    console.info ({err});
                    alert('Some error occured. No results to be shown');
                }
                const resultAlways = function resultAlways() {

                }
                totalRecords = result;
                const maxRecords = 400;
                const iterationLength = ((totalRecords/maxRecords ) - ((totalRecords/maxRecords)%1)) +1 ;
                const promises = [];
                for (let i = 1; i<= iterationLength; i++ ) {
                    const offset = 400*(i-1);
                    const url = `https://www.zalora.co.id/_c/rpc?req={"method":"Costa.ListProducts","params":[{"category_id":["190"],"limit":400,"offset":${offset},"segment":"women","dir":"desc","sort":"popularity","catalog_type":"","url_key":"/women/pakaian/playsuit-jumpsuit","enable_visual_sort":true}]}&lang=id`;
                    promises.push(callAjax(url));
                }
                $.when.apply($, promises).then(resultSuccess, resultFailure).always(resultAlways);

            }else {
                throw " Total Records not found";
            }
        } catch(exception) {
            console.info (exception);
            totalRecordsFailure();
        }
    }

    const totalRecordsFailure = function totalRecordsFailure(err) {
        console.info ('Inside error');
    }

    const totalRecordsAlways = function totalRecordsAlways() {
        totalRecordsContainer.html(totalRecords);
    }

    $.when($.ajax(totalRecordsUrl)).then(totalRecordsSuccess, totalRecordsFailure).always(totalRecordsAlways)

    const callAjax = function(url) {
        return $.ajax({
            url: url,
            dataType: 'text'
        })
    }


}())