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

    var data = {"OkPercent": 99.35853052580133, "KoPercent": 0.6414694741986723};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.11376888158409643, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0010111223458038423, 500, 1500, "Ver propietario"], "isController": false}, {"data": [0.0, 500, 1500, "Enviar mascota"], "isController": false}, {"data": [0.0, 500, 1500, "Formulario editar mascota"], "isController": false}, {"data": [0.0, 500, 1500, "Editar mascota"], "isController": true}, {"data": [0.06216889996883764, 500, 1500, "Páginar veterinarios"], "isController": false}, {"data": [0.004655493482309125, 500, 1500, "Enviar lastName-0"], "isController": false}, {"data": [0.004655493482309125, 500, 1500, "Enviar lastName"], "isController": false}, {"data": [0.0, 500, 1500, "Busca-pagina-consulta propietarios"], "isController": true}, {"data": [0.06843910806174958, 500, 1500, "Páginar veterinarios-0"], "isController": false}, {"data": [0.0010111223458038423, 500, 1500, "Ver propietario-0"], "isController": false}, {"data": [0.11176470588235295, 500, 1500, "Buscar propietarios"], "isController": false}, {"data": [0.009285051067780872, 500, 1500, "Añadir visita-0"], "isController": false}, {"data": [2.6896180742334586E-4, 500, 1500, "Inicio"], "isController": false}, {"data": [0.28456159225389993, 500, 1500, "Inicio-4"], "isController": false}, {"data": [0.44997310381925765, 500, 1500, "Inicio-5"], "isController": false}, {"data": [0.48386229155459926, 500, 1500, "Inicio-6"], "isController": false}, {"data": [0.0, 500, 1500, "Formulario editar mascota-0"], "isController": false}, {"data": [0.29182356105433027, 500, 1500, "Inicio-0"], "isController": false}, {"data": [0.2982786444324906, 500, 1500, "Inicio-1"], "isController": false}, {"data": [0.5901022054868209, 500, 1500, "Inicio-2"], "isController": false}, {"data": [0.24125874125874125, 500, 1500, "Inicio-3"], "isController": false}, {"data": [0.0, 500, 1500, "Enviar mascota-0"], "isController": false}, {"data": [0.022211253701875617, 500, 1500, "Enviar mascota-1"], "isController": false}, {"data": [0.0, 500, 1500, "Formulario nueva mascota-0"], "isController": false}, {"data": [0.09499536607970342, 500, 1500, "Lista veterinarios-0"], "isController": false}, {"data": [0.009285051067780872, 500, 1500, "Añadir visita"], "isController": false}, {"data": [0.11176470588235295, 500, 1500, "Buscar propietarios-0"], "isController": false}, {"data": [0.09499536607970342, 500, 1500, "Lista veterinarios"], "isController": false}, {"data": [0.0, 500, 1500, "Formulario nueva mascota"], "isController": false}, {"data": [9.912767644726408E-5, 500, 1500, "Páginar propietarios"], "isController": false}, {"data": [9.954210631096954E-5, 500, 1500, "Páginar propietarios-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 49106, 315, 0.6414694741986723, 14604.450169022099, 2, 105581, 11746.0, 26343.0, 31707.050000000043, 49295.27000000012, 133.1529254814341, 5538.453067951723, 75.75777451724404], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Ver propietario", 989, 0, 0.0, 19491.45601617801, 254, 37138, 21154.0, 27537.0, 29242.0, 32666.3, 3.0210003818251243, 16.631774412943873, 1.3875823310423825], "isController": false}, {"data": ["Enviar mascota", 1013, 0, 0.0, 39649.705824284334, 8053, 69724, 39215.0, 57662.8, 60122.7, 64591.44, 2.782340242033388, 16.09148520714427, 3.456550374469213], "isController": false}, {"data": ["Formulario editar mascota", 1098, 0, 0.0, 23562.78688524587, 1607, 49075, 22280.0, 38121.3, 40748.299999999996, 45715.729999999996, 3.002534927028557, 14.361734445884641, 1.3421402051185292], "isController": false}, {"data": ["Editar mascota", 1013, 0, 0.0, 64251.06910167824, 15143, 111382, 65172.0, 91519.6, 96217.59999999999, 102367.8, 2.76959839456251, 29.265345250569368, 4.668066310931848], "isController": true}, {"data": ["Páginar veterinarios", 3209, 294, 9.1617326269866, 12142.166095356797, 9, 28032, 12040.0, 21929.0, 23567.0, 26925.000000000004, 8.848557042723447, 40.497214102198214, 4.08433240218746], "isController": false}, {"data": ["Enviar lastName-0", 1074, 0, 0.0, 18551.986033519603, 478, 34719, 20496.0, 28622.5, 30178.0, 32984.25, 2.937998386015784, 16.6166321586355, 1.3699016948543994], "isController": false}, {"data": ["Enviar lastName", 1074, 0, 0.0, 18551.986033519603, 478, 34719, 20496.0, 28622.5, 30178.0, 32984.25, 2.937998386015784, 16.6166321586355, 1.3699016948543994], "isController": false}, {"data": ["Busca-pagina-consulta propietarios", 989, 21, 2.1233569261880687, 161105.88776541976, 52691, 213562, 168958.0, 197833.0, 201354.5, 206779.1, 2.7069117940885863, 284.18203962570584, 10.083827514944124], "isController": true}, {"data": ["Páginar veterinarios-0", 2915, 0, 0.0, 12158.076500857642, 16, 28032, 12040.0, 21968.4, 23582.599999999995, 27033.960000000003, 8.038784723275521, 38.247622922394704, 3.712188173920417], "isController": false}, {"data": ["Ver propietario-0", 989, 0, 0.0, 19491.45601617801, 254, 37138, 21154.0, 27537.0, 29242.0, 32666.3, 3.0210003818251243, 16.631774412943873, 1.3875823310423825], "isController": false}, {"data": ["Buscar propietarios", 1105, 0, 0.0, 12831.871493212673, 6, 27995, 14096.0, 22459.2, 24341.000000000004, 27553.160000000007, 3.0462590285052653, 10.599434490785411, 1.419370085150521], "isController": false}, {"data": ["Añadir visita-0", 1077, 0, 0.0, 13764.00371402042, 759, 32384, 13087.0, 24326.8, 25966.6, 29202.7, 2.9455040722892885, 14.756285049652393, 1.3990989436046735], "isController": false}, {"data": ["Inicio", 1859, 0, 0.0, 22473.654653039237, 1138, 105581, 18174.0, 45956.0, 54132.0, 79043.20000000019, 5.0606240438170005, 2378.6712131580307, 14.931956073939828], "isController": false}, {"data": ["Inicio-4", 1859, 0, 0.0, 3301.0667025282405, 3, 19281, 3120.0, 8022.0, 8563.0, 11671.600000000013, 5.100487001851978, 338.99310973832223, 2.119342247410659], "isController": false}, {"data": ["Inicio-5", 1859, 0, 0.0, 2951.0946745562173, 2, 14616, 2749.0, 8080.0, 9042.0, 11770.400000000001, 5.09999725659104, 41.54206749729089, 2.154002012119009], "isController": false}, {"data": ["Inicio-6", 1859, 0, 0.0, 2913.2915545992378, 3, 13864, 968.0, 8497.0, 11686.0, 13158.4, 5.100053222717871, 403.85050353252075, 2.2685776262942174], "isController": false}, {"data": ["Formulario editar mascota-0", 1098, 0, 0.0, 23562.78688524587, 1607, 49075, 22280.0, 38121.3, 40748.299999999996, 45715.729999999996, 3.002534927028557, 14.361734445884641, 1.3421402051185292], "isController": false}, {"data": ["Inicio-0", 1859, 0, 0.0, 4201.809575040342, 5, 23034, 2800.0, 11328.0, 13458.0, 19073.800000000017, 5.085960669300387, 14.671804508899747, 1.9891373385501592], "isController": false}, {"data": ["Inicio-1", 1859, 0, 0.0, 3809.5723507261955, 2, 20175, 3355.0, 9172.0, 11605.0, 15947.600000000004, 5.07672435216464, 4.278528433513754, 2.1243416635147647], "isController": false}, {"data": ["Inicio-2", 1859, 0, 0.0, 1839.9338353953724, 2, 20065, 31.0, 5285.0, 7424.0, 11925.800000000014, 5.068543945557458, 155.10536433397314, 2.2347628431287014], "isController": false}, {"data": ["Inicio-3", 1859, 0, 0.0, 3341.888649811725, 5, 18754, 2994.0, 7241.0, 9072.0, 12637.000000000053, 5.079484783404648, 1431.9682698278193, 2.120536324190807], "isController": false}, {"data": ["Enviar mascota-0", 1013, 0, 0.0, 22276.960513326765, 4582, 44297, 22211.0, 33718.4, 35461.299999999996, 40936.46, 2.782844710122632, 0.8539797829971759, 1.7169521308816096], "isController": false}, {"data": ["Enviar mascota-1", 1013, 0, 0.0, 17372.38302073052, 66, 36710, 17751.0, 27586.2, 29647.2, 32801.54, 2.851496965534325, 15.616401350309076, 1.7831559753710042], "isController": false}, {"data": ["Formulario nueva mascota-0", 1080, 0, 0.0, 23539.73333333334, 1749, 53536, 22845.5, 37948.7, 40307.600000000006, 44802.87000000002, 2.9527155413995327, 14.008097754022392, 1.3728423859923722], "isController": false}, {"data": ["Lista veterinarios-0", 1079, 0, 0.0, 11206.874884151996, 15, 27824, 10123.0, 21286.0, 23495.0, 26137.4, 2.975525680799724, 14.029138659083074, 1.3272255256807997], "isController": false}, {"data": ["Añadir visita", 1077, 0, 0.0, 13764.00371402042, 759, 32384, 13087.0, 24326.8, 25966.6, 29202.7, 2.9455040722892885, 14.756285049652393, 1.3990989436046735], "isController": false}, {"data": ["Buscar propietarios-0", 1105, 0, 0.0, 12831.871493212673, 6, 27995, 14096.0, 22459.2, 24341.000000000004, 27553.160000000007, 3.0462590285052653, 10.599434490785411, 1.419370085150521], "isController": false}, {"data": ["Lista veterinarios", 1079, 0, 0.0, 11206.874884151996, 15, 27824, 10123.0, 21286.0, 23495.0, 26137.4, 2.975525680799724, 14.029138659083074, 1.3272255256807997], "isController": false}, {"data": ["Formulario nueva mascota", 1080, 0, 0.0, 23539.73333333334, 1749, 53536, 22845.5, 37948.7, 40307.600000000006, 44802.87000000002, 2.9527155413995327, 14.008097754022392, 1.3728423859923722], "isController": false}, {"data": ["Páginar propietarios", 5044, 21, 0.41633624107850914, 21437.65107057892, 87, 37840, 23224.5, 29209.5, 30869.75, 33239.450000000004, 13.831986881002134, 249.95471780631792, 6.475407256411417], "isController": false}, {"data": ["Páginar propietarios-0", 5023, 0, 0.0, 21455.7839936293, 1395, 37840, 23265.0, 29214.2, 30876.600000000002, 33243.44, 13.774399306755296, 249.79460860330937, 6.448822814003105], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 315, 100.0, 0.6414694741986723], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 49106, 315, "500", 315, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Páginar veterinarios", 3209, 294, "500", 294, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Páginar propietarios", 5044, 21, "500", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
