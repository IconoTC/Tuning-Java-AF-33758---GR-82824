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

    var data = {"OkPercent": 99.29687246273262, "KoPercent": 0.7031275372673833};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.08599756234764673, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.04595404595404595, 500, 1500, "Ver propietario"], "isController": false}, {"data": [0.027954706298655343, 500, 1500, "Enviar mascota"], "isController": false}, {"data": [0.09154437456324249, 500, 1500, "Formulario editar mascota"], "isController": false}, {"data": [0.00389242745930644, 500, 1500, "Editar mascota"], "isController": true}, {"data": [0.02891879131255902, 500, 1500, "Páginar veterinarios"], "isController": false}, {"data": [0.027644230769230768, 500, 1500, "Enviar lastName-0"], "isController": false}, {"data": [0.027644230769230768, 500, 1500, "Enviar lastName"], "isController": false}, {"data": [0.0, 500, 1500, "Busca-pagina-consulta propietarios"], "isController": true}, {"data": [0.03188443519000521, 500, 1500, "Páginar veterinarios-0"], "isController": false}, {"data": [0.04595404595404595, 500, 1500, "Ver propietario-0"], "isController": false}, {"data": [0.09617612977983778, 500, 1500, "Buscar propietarios"], "isController": false}, {"data": [0.08997882851093861, 500, 1500, "Añadir visita-0"], "isController": false}, {"data": [0.0, 500, 1500, "Inicio"], "isController": false}, {"data": [0.173, 500, 1500, "Inicio-4"], "isController": false}, {"data": [0.27, 500, 1500, "Inicio-5"], "isController": false}, {"data": [0.2985, 500, 1500, "Inicio-6"], "isController": false}, {"data": [0.09154437456324249, 500, 1500, "Formulario editar mascota-0"], "isController": false}, {"data": [0.164, 500, 1500, "Inicio-0"], "isController": false}, {"data": [0.2335, 500, 1500, "Inicio-1"], "isController": false}, {"data": [0.3175, 500, 1500, "Inicio-2"], "isController": false}, {"data": [0.24875, 500, 1500, "Inicio-3"], "isController": false}, {"data": [0.09058740268931352, 500, 1500, "Enviar mascota-0"], "isController": false}, {"data": [0.20382165605095542, 500, 1500, "Enviar mascota-1"], "isController": false}, {"data": [0.08423716558206797, 500, 1500, "Formulario nueva mascota-0"], "isController": false}, {"data": [0.042907801418439716, 500, 1500, "Lista veterinarios-0"], "isController": false}, {"data": [0.08997882851093861, 500, 1500, "Añadir visita"], "isController": false}, {"data": [0.09617612977983778, 500, 1500, "Buscar propietarios-0"], "isController": false}, {"data": [0.042907801418439716, 500, 1500, "Lista veterinarios"], "isController": false}, {"data": [0.08423716558206797, 500, 1500, "Formulario nueva mascota"], "isController": false}, {"data": [0.0, 500, 1500, "Páginar propietarios"], "isController": false}, {"data": [0.0, 500, 1500, "Páginar propietarios-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 61582, 433, 0.7031275372673833, 11817.07835081692, 0, 70795, 5570.0, 19508.0, 22136.100000000013, 25768.0, 161.70894385799065, 5958.203548120668, 91.35899383238801], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Ver propietario", 1001, 0, 0.0, 13443.028971028982, 5, 31033, 12459.0, 26306.000000000007, 28966.9, 30355.96, 4.598873482739293, 25.283269616423627, 2.1106316071477793], "isController": false}, {"data": ["Enviar mascota", 1413, 0, 0.0, 15031.977353149316, 8, 54905, 12686.0, 30135.40000000001, 38632.8, 50340.47999999992, 3.9219495947596315, 22.55587505291024, 4.881871933808427], "isController": false}, {"data": ["Formulario editar mascota", 1431, 0, 0.0, 8096.763102725365, 5, 29747, 7283.0, 17109.6, 20079.399999999994, 23183.320000000007, 3.891378597689647, 18.613254269027237, 1.7821410519367156], "isController": false}, {"data": ["Editar mascota", 1413, 0, 0.0, 23031.40056617127, 88, 77885, 19179.0, 43404.4, 54642.1, 69399.23999999999, 3.8321034261120013, 40.36888180059367, 6.5232643959826655], "isController": true}, {"data": ["Páginar veterinarios", 4236, 394, 9.301227573182247, 9341.72710103872, 16, 30981, 8617.5, 17844.200000000004, 20520.15, 23061.45, 11.49288070845633, 52.56151006254476, 5.382216583214859], "isController": false}, {"data": ["Enviar lastName-0", 1664, 0, 0.0, 12968.5721153846, 73, 32169, 11988.5, 22912.5, 27117.5, 30644.449999999986, 4.494442718813727, 25.41775093015247, 2.1304405900981807], "isController": false}, {"data": ["Enviar lastName", 1664, 0, 0.0, 12968.5721153846, 73, 32169, 11988.5, 22912.5, 27117.5, 30644.449999999986, 4.494442718813727, 25.41775093015247, 2.1304405900981807], "isController": false}, {"data": ["Busca-pagina-consulta propietarios", 1001, 30, 2.997002997002997, 178886.3606393606, 92737, 209308, 183856.0, 198312.0, 200001.0, 203270.22, 2.910374423594676, 305.088602670472, 10.833284345543726], "isController": true}, {"data": ["Páginar veterinarios-0", 3842, 0, 0.0, 9413.29307652267, 16, 30981, 8712.0, 17971.000000000004, 20595.55, 23101.20000000001, 10.423901719048445, 49.58945617304843, 4.882001736073429], "isController": false}, {"data": ["Ver propietario-0", 1001, 0, 0.0, 13443.028971028982, 5, 31033, 12459.0, 26306.000000000007, 28966.9, 30355.96, 4.598873482739293, 25.283269616423627, 2.1106316071477793], "isController": false}, {"data": ["Buscar propietarios", 1726, 0, 0.0, 10630.725376593253, 5, 30967, 8558.0, 21007.8, 24299.3, 29476.86, 4.66862500067622, 16.244444216220092, 2.2110026707321033], "isController": false}, {"data": ["Añadir visita-0", 1417, 0, 0.0, 7997.432604093136, 5, 29584, 7168.0, 16960.600000000002, 20081.199999999997, 24936.28, 3.8480861406438827, 19.278009669436635, 1.8518341717924693], "isController": false}, {"data": ["Inicio", 2000, 0, 0.0, 19476.87949999999, 1569, 70795, 15619.0, 32450.600000000002, 44891.64999999999, 64573.69, 5.29705907280278, 2489.8039889503348, 15.702366030754726], "isController": false}, {"data": ["Inicio-4", 2000, 0, 0.0, 2991.791499999999, 2, 16800, 2187.5, 6194.200000000003, 7198.049999999993, 13718.85, 5.392012811422441, 358.3687577341684, 2.2510600360186457], "isController": false}, {"data": ["Inicio-5", 2000, 0, 0.0, 2826.4875000000034, 1, 16677, 2045.0, 6699.000000000002, 7331.299999999997, 14036.780000000002, 5.394456117448099, 43.940584448861905, 2.2889562334289053], "isController": false}, {"data": ["Inicio-6", 2000, 0, 0.0, 2918.2800000000016, 2, 16746, 2052.5, 7017.8, 8407.299999999994, 14040.950000000004, 5.39800867459994, 427.4442689341902, 2.4117079771772194], "isController": false}, {"data": ["Formulario editar mascota-0", 1431, 0, 0.0, 8096.763102725365, 5, 29747, 7283.0, 17109.6, 20079.399999999994, 23183.320000000007, 3.891378597689647, 18.613254269027237, 1.7821410519367156], "isController": false}, {"data": ["Inicio-0", 2000, 0, 0.0, 3088.897999999998, 3, 16844, 2863.0, 5813.800000000003, 7435.249999999997, 11635.87, 5.374321491911647, 15.503657897565432, 2.1124652348578494], "isController": false}, {"data": ["Inicio-1", 2000, 0, 0.0, 2566.7534999999943, 0, 16092, 2332.0, 4640.800000000001, 6929.34999999999, 13205.89, 5.3376034160661865, 4.498390378969843, 2.2439826861489194], "isController": false}, {"data": ["Inicio-2", 2000, 0, 0.0, 2269.645499999997, 1, 16173, 1910.0, 4380.400000000002, 6248.349999999994, 13751.550000000001, 5.344692586644148, 163.55594423347756, 2.3670098516046103], "isController": false}, {"data": ["Inicio-3", 2000, 0, 0.0, 2675.5899999999974, 4, 16688, 2079.5, 5811.6, 6530.199999999997, 15080.97, 5.3636990213931135, 1512.091705173556, 2.249715556336272], "isController": false}, {"data": ["Enviar mascota-0", 1413, 0, 0.0, 7957.4833687190285, 2, 30186, 7047.0, 16134.200000000003, 19904.1, 23181.47999999999, 3.949784900249063, 1.084717299841226, 2.4936533169248145], "isController": false}, {"data": ["Enviar mascota-1", 1413, 0, 0.0, 7074.322717622069, 4, 29584, 6143.0, 15978.600000000006, 20121.6, 26559.919999999987, 4.01894278766159, 22.009991360552927, 2.465289443697826], "isController": false}, {"data": ["Formulario nueva mascota-0", 1383, 0, 0.0, 8412.469269703512, 5, 29585, 7404.0, 18467.600000000002, 20408.8, 25615.92000000002, 3.7442536670944264, 17.763265932367897, 1.7597272040130927], "isController": false}, {"data": ["Lista veterinarios-0", 1410, 0, 0.0, 8772.648226950361, 19, 30164, 7903.0, 17885.600000000002, 20727.15, 26792.060000000005, 3.8096267376356, 17.961794813774098, 1.7255194331491563], "isController": false}, {"data": ["Añadir visita", 1417, 0, 0.0, 7997.432604093136, 5, 29584, 7168.0, 16960.600000000002, 20081.199999999997, 24936.28, 3.8480861406438827, 19.278009669436635, 1.8518341717924693], "isController": false}, {"data": ["Buscar propietarios-0", 1726, 0, 0.0, 10630.725376593253, 5, 30967, 8558.0, 21007.8, 24299.3, 29476.86, 4.66862500067622, 16.244444216220092, 2.2110026707321033], "isController": false}, {"data": ["Lista veterinarios", 1410, 0, 0.0, 8772.648226950361, 19, 30164, 7903.0, 17885.600000000002, 20727.15, 26792.060000000005, 3.8096267376356, 17.961794813774098, 1.7255194331491563], "isController": false}, {"data": ["Formulario nueva mascota", 1383, 0, 0.0, 8412.469269703512, 5, 29585, 7404.0, 18467.600000000002, 20408.8, 25615.92000000002, 3.7442536670944264, 17.763265932367897, 1.7597272040130927], "isController": false}, {"data": ["Páginar propietarios", 6620, 39, 0.5891238670694864, 25074.988972809642, 193, 43436, 25589.0, 35726.0, 37476.85, 39692.37, 18.273865060480418, 329.76261422028284, 8.652250047271894], "isController": false}, {"data": ["Páginar propietarios-0", 6581, 0, 0.0, 25111.936331864545, 3102, 43436, 25653.0, 35755.0, 37510.69999999999, 39695.700000000004, 18.166209359973056, 329.4633019357668, 8.600654241289549], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 433, 100.0, 0.7031275372673833], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 61582, 433, "500", 433, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Páginar veterinarios", 4236, 394, "500", 394, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Páginar propietarios", 6620, 39, "500", 39, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
