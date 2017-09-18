(function () {

    const totalRecordsContainer = $("#totalRecords");
    const totalRecordsUrl = "https://www.zalora.co.id/_c/rpc?&req=%7B%22method%22%3A%22Costa.ListFilters%22%2C%22params%22%3A%5B%7B%22category_id%22%3A%5B%2225%22%5D%2C%22limit%22%3A72%2C%22offset%22%3A0%2C%22segment%22%3A%22women%22%2C%22dir%22%3A%22desc%22%2C%22sort%22%3A%22popularity%22%2C%22catalog_type%22%3A%22%22%2C%22url_key%22%3A%22%2Fwomen%2Fpakaian%2Fdress%22%2C%22enable_visual_sort%22%3Atrue%7D%5D%7D&lang=id"

    let totalRecords = ' Not Available';

    const totalRecordsSuccess = function totalRecordsSuccess(data) {
        try {
            const result = data && data.result ?  data.result.numFound : null;
            if (result != null ) {
                const allResult = [];
                const resultSuccess = function resultSuccess() {
                    const result = [...arguments]
                        .filter(item => item.length >0 && item[0])
                        .map(item => JSON.parse(JSON.stringify(item[0])))
                        .forEach(item => {
                            item.split('{"meta":')
                                .filter(item => {
                                    return item;
                                })
                                .forEach(resultItem => {
                                    resultItem = resultItem.replace("\n", "");
                                    // resultItem = { + resultItem;
                                    resultItem = `{"data":${resultItem}`;
                                    try {
                                        const resultData = JSON.parse(resultItem);
                                        console.info (resultData);
                                        const availableSize = resultData.available_sizes.map(item => item.label).join(", ");
                                        const prices = resultData.data.price || "Not Available ";
                                        const name = resultData.data.name || "Not Available ";
                                        const maxPrice = resultData.data.max_price || "Not Available ";
                                        const specialPrice = resultData.data.special_price || "Not Available ";
                                        const savingPercent = resultData.data.max_saving_percentage;
                                        const brand = resultData.data.brand ||  "Not Available ";
                                        const colorFamily = resultData.data.color_family ||  "Not Available ";
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
                                    }catch (exception) {
                                        console.warn('Inside exception ', exception);
                                    }

                                });
                        });


                    let resultString = allResult.map(item => {
                        return `
------------------------------------------------------------------------------------------------------------------------------<br>
                            Name  - ${item.name} <br>
                            Available Sizes - ${item.availableSize} <br>
                            Price - ${item.prices} <br>
                            Special Price - ${item.specialPrice} <br>
                            Max Price  - ${item.maxPrice} <br>
                            Saving Percent - ${item.savingPercent} <br>
                            Brand =  ${item.brand} <br>
                            Color Family =  ${item.colorFamily} <br>
--------------------------------------------------------------------------------------------------------------------------------- <br>                           
                        `
                    });

                    $("#details").html(resultString.join("<br>"));
                }
                const resultFailure = function resultFailure(err) {
                    console.info ('Inside failure');
                    console.info ({err});
                }
                const resultAlways = function resultAlways() {

                }
                totalRecords = result;
                const maxRecords = 400;
                const iterationLength = ((totalRecords/maxRecords ) - ((totalRecords/maxRecords)%1)) +1 ;
                const promises = [];
                for (let i = 1; i<= iterationLength; i++ ) {
                    const offset = 400*(i-1);
                    const url = `https://www.zalora.co.id/_c/rpc?req={"method":"Costa.ListProducts","params":[{"category_id":["25"],"limit":400,"offset":${offset},"segment":"women","dir":"desc","sort":"popularity","catalog_type":"","url_key":"/women/pakaian/dress","enable_visual_sort":true}]}&lang=id`;
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