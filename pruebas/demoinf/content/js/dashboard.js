/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.50122249388752, "KoPercent": 0.49877750611246946};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.259119804400978, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.22488038277511962, 500, 1500, "petclinic-21-0"], "isController": false}, {"data": [0.25810185185185186, 500, 1500, "petclinic-22-0"], "isController": false}, {"data": [0.39351851851851855, 500, 1500, "petclinic-22-1"], "isController": false}, {"data": [0.003, 500, 1500, "petclinic-4"], "isController": false}, {"data": [0.23258426966292134, 500, 1500, "petclinic-20"], "isController": false}, {"data": [0.22488038277511962, 500, 1500, "petclinic-21"], "isController": false}, {"data": [0.0787037037037037, 500, 1500, "petclinic-22"], "isController": false}, {"data": [0.23258426966292134, 500, 1500, "petclinic-20-0"], "isController": false}, {"data": [0.44, 500, 1500, "petclinic-4-4"], "isController": false}, {"data": [0.5405, 500, 1500, "petclinic-4-3"], "isController": false}, {"data": [0.4995, 500, 1500, "petclinic-4-6"], "isController": false}, {"data": [0.4605, 500, 1500, "petclinic-4-5"], "isController": false}, {"data": [0.5695, 500, 1500, "petclinic-4-0"], "isController": false}, {"data": [0.6235, 500, 1500, "petclinic-4-2"], "isController": false}, {"data": [0.569, 500, 1500, "petclinic-4-1"], "isController": false}, {"data": [0.09142394822006472, 500, 1500, "petclinic-14"], "isController": false}, {"data": [0.19549929676511954, 500, 1500, "petclinic-15"], "isController": false}, {"data": [0.05572755417956656, 500, 1500, "petclinic-16"], "isController": false}, {"data": [0.0, 500, 1500, "petclinic-17"], "isController": false}, {"data": [0.2288135593220339, 500, 1500, "petclinic-19"], "isController": false}, {"data": [0.0, 500, 1500, "petclinic-17-0"], "isController": false}, {"data": [0.05572755417956656, 500, 1500, "petclinic-16-0"], "isController": false}, {"data": [0.19549929676511954, 500, 1500, "petclinic-15-0"], "isController": false}, {"data": [0.09964726631393298, 500, 1500, "petclinic-14-0"], "isController": false}, {"data": [0.14014251781472684, 500, 1500, "petclinic-11"], "isController": false}, {"data": [0.14014251781472684, 500, 1500, "petclinic-11-0"], "isController": false}, {"data": [0.2288135593220339, 500, 1500, "petclinic-19-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 20450, 102, 0.49877750611246946, 6385.386063569693, 1, 43937, 3719.0, 17615.9, 22546.0, 25051.0, 252.35697714595983, 12748.192667649255, 144.25882574565625], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["petclinic-21-0", 418, 0, 0.0, 5528.416267942583, 6, 17660, 4818.0, 14300.6, 16240.899999999998, 17459.33, 5.719524376393963, 27.357646870681283, 2.6137875771383223], "isController": false}, {"data": ["petclinic-22-0", 432, 0, 0.0, 5178.256944444442, 2, 17616, 4441.0, 13380.9, 15529.5, 17417.35, 6.082793579273444, 1.8771120811039146, 3.74828393410307], "isController": false}, {"data": ["petclinic-22-1", 432, 0, 0.0, 4034.499999999999, 5, 17651, 1944.5, 12437.6, 15063.04999999998, 16869.260000000002, 5.873395692843158, 32.16601859908636, 3.676608046008266], "isController": false}, {"data": ["petclinic-4", 1000, 0, 0.0, 10726.332000000011, 120, 43937, 8265.5, 21896.9, 27107.149999999994, 39410.630000000005, 18.422313105633542, 8659.134819092886, 51.27303940532774], "isController": false}, {"data": ["petclinic-20", 445, 0, 0.0, 5208.168539325842, 6, 17648, 4108.0, 13924.200000000003, 16094.099999999999, 17252.640000000003, 6.169501864714609, 29.268984432405826, 2.784263914306312], "isController": false}, {"data": ["petclinic-21", 418, 0, 0.0, 5528.416267942583, 6, 17660, 4818.0, 14300.6, 16240.899999999998, 17459.33, 5.719524376393963, 27.357646870681283, 2.6137875771383223], "isController": false}, {"data": ["petclinic-22", 432, 0, 0.0, 9212.96064814815, 10, 31075, 5701.0, 22524.7, 27970.39999999999, 30656.390000000003, 5.867492461902046, 33.944360687800504, 7.288525792518946], "isController": false}, {"data": ["petclinic-20-0", 445, 0, 0.0, 5208.168539325842, 6, 17648, 4108.0, 13924.200000000003, 16094.099999999999, 17252.640000000003, 6.169501864714609, 29.268984432405826, 2.784263914306312], "isController": false}, {"data": ["petclinic-4-4", 1000, 0, 0.0, 1814.5740000000014, 2, 6402, 1263.0, 4880.6, 5054.95, 5309.92, 36.00100802822479, 2392.7310589696513, 14.098050995427872], "isController": false}, {"data": ["petclinic-4-3", 1000, 0, 0.0, 1323.2160000000001, 5, 5327, 532.0, 4059.799999999998, 4525.499999999999, 5112.9400000000005, 42.60758414997869, 12011.59392309331, 16.76841446527482], "isController": false}, {"data": ["petclinic-4-6", 1000, 0, 0.0, 2236.9330000000027, 2, 14366, 820.0, 5300.8, 8632.649999999996, 12480.960000000003, 19.759331344227313, 1564.6534583769685, 8.31667168883005], "isController": false}, {"data": ["petclinic-4-5", 1000, 0, 0.0, 1970.634000000002, 1, 9067, 868.5, 5019.0, 5271.849999999999, 8830.95, 27.260583921707603, 222.05129930758116, 10.861638906305373], "isController": false}, {"data": ["petclinic-4-0", 1000, 0, 0.0, 914.7799999999995, 4, 3524, 693.0, 2105.9, 2429.9999999999986, 3043.7000000000003, 77.74236181295188, 224.26849296431627, 28.54602347819327], "isController": false}, {"data": ["petclinic-4-2", 1000, 0, 0.0, 876.5030000000006, 1, 4784, 97.5, 2281.4999999999995, 3211.7499999999995, 4279.95, 50.686806224339804, 1551.0954685995237, 21.13600220487607], "isController": false}, {"data": ["petclinic-4-1", 1000, 0, 0.0, 865.3560000000001, 1, 3169, 488.5, 2018.0, 2182.0, 2530.94, 63.399480124262986, 53.43139780003804, 25.01307614277563], "isController": false}, {"data": ["petclinic-14", 1236, 102, 8.25242718446602, 6342.564724919093, 10, 18634, 4828.0, 15023.9, 16911.199999999997, 18059.679999999997, 16.877176213559093, 77.53462206424524, 7.579650483034069], "isController": false}, {"data": ["petclinic-15", 711, 0, 0.0, 6000.949367088612, 5, 18114, 4922.0, 14591.400000000001, 16384.0, 17612.32, 9.70966596564062, 33.78470687068118, 4.434993526035834], "isController": false}, {"data": ["petclinic-16", 646, 0, 0.0, 8031.151702786376, 51, 18859, 6268.5, 16565.000000000004, 17335.85, 18142.12, 8.758846977791034, 49.51144334120861, 3.99761157021992], "isController": false}, {"data": ["petclinic-17", 1338, 0, 0.0, 18514.048579970116, 6088, 27060, 19143.5, 24364.7, 24921.35, 25638.379999999994, 17.887939678337947, 324.3887368146633, 8.157147613938688], "isController": false}, {"data": ["petclinic-19", 413, 0, 0.0, 5085.365617433413, 7, 17659, 4413.0, 12989.6, 16115.099999999997, 17276.56, 5.7243444031712585, 27.380702037825028, 2.61628549128181], "isController": false}, {"data": ["petclinic-17-0", 1338, 0, 0.0, 18514.048579970116, 6088, 27060, 19143.5, 24364.7, 24921.35, 25638.379999999994, 17.887939678337947, 324.3887368146633, 8.157147613938688], "isController": false}, {"data": ["petclinic-16-0", 646, 0, 0.0, 8031.151702786376, 51, 18859, 6268.5, 16565.000000000004, 17335.85, 18142.12, 8.758846977791034, 49.51144334120861, 3.99761157021992], "isController": false}, {"data": ["petclinic-15-0", 711, 0, 0.0, 6000.949367088612, 5, 18114, 4922.0, 14591.400000000001, 16384.0, 17612.32, 9.70966596564062, 33.78470687068118, 4.434993526035834], "isController": false}, {"data": ["petclinic-14-0", 1134, 0, 0.0, 6387.037918871254, 26, 18634, 4828.0, 15085.5, 16920.25, 18078.850000000002, 15.484399535741106, 73.66232206253841, 6.95318900628115], "isController": false}, {"data": ["petclinic-11", 421, 0, 0.0, 5819.318289786223, 140, 18088, 5172.0, 13700.0, 16526.2, 17958.639999999996, 5.734679144020814, 27.038116120441885, 2.489234706387152], "isController": false}, {"data": ["petclinic-11-0", 421, 0, 0.0, 5819.318289786223, 140, 18088, 5172.0, 13700.0, 16526.2, 17958.639999999996, 5.734679144020814, 27.038116120441885, 2.489234706387152], "isController": false}, {"data": ["petclinic-19-0", 413, 0, 0.0, 5085.365617433413, 7, 17659, 4413.0, 12989.6, 16115.099999999997, 17276.56, 5.7243444031712585, 27.380702037825028, 2.61628549128181], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 102, 100.0, 0.49877750611246946], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 20450, 102, "500", 102, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["petclinic-14", 1236, 102, "500", 102, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
