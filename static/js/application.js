
var data = [
  {name: 'George', ts: 'Feng', tp: '0.99', time: 'Programmer', id: '30'},
  {name: 'Ted', ts: 'Smith', tp: 'Electrical Systems', time: 'Electrical Systems', id: '41'},
];

// global search params
var searchFilter = null;

var grid = new FancyGrid({
    renderTo: 'container',
    width: 'fit',
    height: 'fit',
    title: 'myFancyGrid - ',
    //subTitle: 'Sub Title',
    defaults: {
      type: 'string',
      editable: false,
      sortable: true
    },

    events: [{
        filter: function(grid, filters){
            console.log('xxxx on filter events: ');
            // console.log(grid);
            console.log(filters);
            // console.log(filters.value);
            searchFilter = filters;
        }
    }],

    exporter:true,

    tbar: [{
        type: 'search',
        width: 350,
        emptyText: 'Search',
        paramsMenu: true,
        paramsText: 'Parameters'
      },{
        text: 'Export to Excel',
        handler: function() {
          this.exportToExcel();
        }
      },{
        text: 'Export to CSV',
        handler: function() {
          this.exportToCSV({
            fileName: 'myCSV',
            header: true,
            all: true
          });
        }
      }],

    data: [],
    columns: [{
      index: 'name',
      title: 'Name',
      type: 'string',
      width: 100
    },{
      index: 'ts',
      title: 'Size',
      type: 'string',
      width: 100
    },{
      index: 'tp',
      title: 'Price',
      type: 'string',
      width: 100
    },{
      index: 'time',
      title: 'Time',
      type: 'string',
      width: 200
    },{
      index: 'id',
      title: 'ID',
      type: 'number',
      width: 100
    }]
  });

grid.setTitle('myFancyGrid -')

Highcharts.setOptions({
    lang: {
      thousandsSep: ","
    }
});


// Good code:
var dtTableChart =  Highcharts.chart("chart", {
    title: {
      text: "DataTables to Highcharts"
    },
    subtitle: {
      text: "Data from KDB+"
    },
    xAxis: [
      {
        categories: [],
        labels: {
          rotation: -45
        }
      }
    ],
    yAxis: [
      {
        // first yaxis
        title: {
          text: "Size"
        }
      },
      {
        // secondary yaxis
        title: {
          text: "AvgPx"
        },
        min: 0,
        opposite: true
      }
    ],
    series: [
      {
        name: "Size",
        color: "#0071A7",
        type: "column",
        data: [],
        tooltip: {
          valueSuffix: " M"
        }
      },
      {
        name: "AvgPx",
        color: "#FF404E",
        type: "spline",
        data: [],
        yAxis: 1
      }
    ],
    tooltip: {
      shared: true
    },
    legend: {
      backgroundColor: "#ececec",
      shadow: true
    },
    credits: {
      enabled: false
    },
    noData: {
      style: {
        fontSize: "16px"
      }
    }
  });


var pieChart = Highcharts.chart('piechart', {
		chart: {
        type: 'pie'
    },
    credits: {
    	enabled: false
    },
    title: {
    	text: 'FilledQty by Markets -'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
            }
        }
    },
    series: [{
        name: 'sym',
        //data: [['Apple',89], ['Orange',71], ['Banana',16], ['Grapes',12], ['Others',14]]
        data: []
    }]
});


// timeseries chart
// just create 2 timeseries (y) with same x
var timeseriesChart2 = Highcharts.chart('timeseries2', {

    title: {
        text: 'Live Tick Data - Price/Volume 2 '
    },
    time: {
        useUTC: false
    },
    xAxis: [
      {
        type: 'datetime',
        tickPixelInterval: 5
      }
    ],
    yAxis: [{
        // Primary yAxis
        labels: {
            format: '{value} °C',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        title: {
            text: 'volume',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        }
    }, {
        // Secondary yAxis
        title: {
            text: 'price',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        labels: {
            format: '{value} mm',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        opposite: true
    }],

    tooltip: {
        //headerFormat: '<b>{series.name}</b><br/>',
        //pointFormat: '{point.x:%Y-%m-%d %H:%M}<br/>{point.y:.2f}<br/>{point}'
        shared: true
    },
    legend: {
        enabled: true
    },
    exporting: {
        enabled: true
    },
    series: [{
        name: 'volume',
        type: 'column',
        yAxis: 0,
        data: [],
        tooltip: {
            valueSuffix: ' lots'
        }
    },{
        name: 'price',
        type: 'spline',
        yAxis: 1,
        data:[],
        tooltip: {
            valueSuffix: ' last px'
        }
    }]
});


var timeSeriesChart =  Highcharts.chart("timeseries", {
    chart: {
        zoomType: 'xy'
    },
    title: {
      text: "price volume real-time chart"
    },
    subtitle: {
      text: "Data from KDB+"
    },
    xAxis: [{
        categories: [],
        labels: {
          rotation: -45
        },
        crosshair: true
    }],
    yAxis: [
      {
        // first yaxis
        title: {
          text: "volume"
        }
      },
      {
        // secondary yaxis
        title: {
          text: "price"
        },
        min: 0,
        opposite: true
      }
    ],

    series: [
      {
        name: "volume",
        color: "#0071A7",
        type: "column",
        data: [],
        tooltip: {
          valueSuffix: " M"
        }
      },
      {
        name: "price",
        color: "#FF404E",
        type: "spline",
        data: [],
        yAxis: 1
      }
    ],
    tooltip: {
      shared: true
    },
    legend: {
      backgroundColor: "#ececec",
      shadow: true
    },
    credits: {
      enabled: false
    },
    noData: {
      style: {
        fontSize: "16px"
      }
    }
  });


$(document).ready(function(){
    //connect to the socket server.
    var socket = io.connect('http://' + document.domain + ':' + location.port + '/test');
    var numbers_received = [];

    //receive details from server
    socket.on('newnumber', function(msg) {
        console.log("seqnum: " + msg.number);

        //maintain a list of ten numbers
        if (numbers_received.length >= 10){
            numbers_received.shift()
        }            
        numbers_received.push(msg.number);
        numbers_string = '';
        for (var i = 0; i < numbers_received.length; i++){
            numbers_string = numbers_string + '[' + numbers_received[i].toString() + ']';
        }

        // $('#log').html(numbers_string);
        $('#seqnum').html(msg.number);

        data = JSON.parse(msg.data);
        //console.log(data);

        // fancy grid table
        console.log('xxxx fancy grid data: ');
        grid.setData(data);
        grid.update(); // redraw

        // apply searchFilter if any
        console.log('xxxx global search filter: ');
        console.log(searchFilter);

        if ( typeof(searchFilter) != 'undefined' && searchFilter != null) {
            console.log('xxxx global search filter.name: ');
            console.log(Object.keys(searchFilter));
            console.log(Object.values(searchFilter));

            console.log(searchFilter["name"]["*"]);
            //console.log(Object.values(searchFilter)[0]["*"]);
            if (typeof(searchFilter["name"]["*"]) != 'undefined' && searchFilter["name"]["*"] != '')
                grid.search(searchFilter["name"]["*"]);
            else {
                grid.clearFilter();
                searchFilter = null;
            }
        }

        // date table with filter
        getDataFiltered = grid.getDataFiltered();
        console.log('xxxx fancy grid data filterd: ');
        console.log(getDataFiltered);

        // use filtered data for other charts' update!!!
        filteredData = [];
        if (typeof(getDataFiltered) != undefined && getDataFiltered != null) {
            console.log('xxxxxxxxxxxxxxxx DEBUG xxxxxxxxxxxxx');
            console.log(typeof(getDataFiltered));
            console.log(getDataFiltered);
            console.log(getDataFiltered.length);
            console.log(Object.keys(getDataFiltered));
            console.log(Object.values(getDataFiltered));

            console.log(Object.values(getDataFiltered)[0].data);

            // define the data for each chart and apply them individually.  HOW TO MAKE THIS AS GENERIC AS POSSIBLE??
            var pieData = [];
            var chartDataX = [], chartDataSeries0 = [], chartDataSeries1 = [];

            Object.values(getDataFiltered).forEach(function(element) {
                filteredData.push(element.data);

                // x,y0,y1 charts
                chartDataX.push(element.data.name);
                chartDataSeries0.push(element.data.ts);
                chartDataSeries1.push(element.data.tp);

                // update pieData
                pieData.push([element.data.name, element.data.ts]);

            });
            console.log('xxxxxxxxx XXXX - filteredData:')
            console.log(filteredData);

            console.log('xxxxxxxxx XXXX - charDataX:')
            console.log(chartDataX);
            console.log(chartDataSeries0);
            console.log(chartDataSeries1);

            // use filtered data
            dtTableChart.xAxis[0].setCategories(chartDataX);
            dtTableChart.series[0].setData(chartDataSeries0);
            dtTableChart.series[1].setData(chartDataSeries1);
            dtTableChart.update();

            console.log('xxxxxxxxx XXXX - pieData:')
            console.log(pieData);
            pieChart.series[0].setData(pieData, true);
            pieChart.update();

            console.log('================ DEBUG ============');
        }

        // create x->y0/y1 chart
        chartdata = JSON.parse(msg.chartdata);
        //console.log(chartdata);

        const dataArray = [];
        dataArray.push(Object.values(chartdata['name']), Object.values(chartdata['Size']), Object.values(chartdata['AvgPx']));

        dtTableChart.xAxis[0].setCategories(Object.values(chartdata['name']));
        dtTableChart.series[0].setData(Object.values(chartdata['Size']));
        dtTableChart.series[1].setData(Object.values(chartdata['AvgPx']));
        //dtTableChart.update();

        // update series data instead of recreate everything
        piejson = JSON.parse(msg.piedata);
        //console.log('piejson xxx');
        // console.log(piejson);

        const dataPie = [];
        dataPie.push(Object.values(piejson));
        pieChart.setTitle({text: "Live Kdb updates - FillQty"});
        //console.log(dataPie);
        //console.log(Object.keys(dataPie));
        //console.log(Object.values(dataPie));
        //console.log('111111: '+Object.values(dataPie));
        //console.log('222222: '+(Object.values(dataPie)).length);

        var seriesData = [];
        Object.values(dataPie).forEach(function(element) {
            for (var j=0; j<element.length; j++) {
                seriesData.push(Object.values(element[j]));
            }
        });
        console.log('xxxx pie seriesData: ')
        console.log(seriesData);
        pieChart.series[0].setData(seriesData, true);

        // time series data
        timeseriesJson = JSON.parse(msg.timeseries);
        console.log('xxxxxxxxx timeseriesJson data: ');
        console.log(timeseriesJson);

        //timeSeriesChart.xAxis[0].setCategories(Object.values(timeseriesJson['time']));
        timeSeriesChart.series[0].setData(Object.values(timeseriesJson['volume']));
        timeSeriesChart.series[1].setData(Object.values(timeseriesJson['price']));
        //timeSeriesChart.update();

        var  timeseriesJson2 = JSON.parse(msg.timeseries2);
        var timeseriesDataY0 = [];
        var timeseriesDataY1 = [];

        Object.values(timeseriesJson2).forEach(function(element) {
            timeseriesDataY0.push({
                x: new Date(element['time']),
                y: element['volume']
            });

            timeseriesDataY1.push({
                x: new Date(element['time']),
                y: element['price']
            });

        });

        //timeseriesDataY0.push(Object.values(new Date(timeseriesJson['time'])), Object.values(timeseriesJson['volume']));
        //timeseriesDataY1.push(Object.values(new Date(timeseriesJson['time'])), Object.values(timeseriesJson['price']));

        console.log('xxxxxxxxx timeseries Y0,Y1: ')
        console.log(timeseriesDataY1);

        timeseriesChart2.series[0].setData(timeseriesDataY0);
        timeseriesChart2.series[1].setData(timeseriesDataY1);
        //timeseriesChart2.update();


    });

});