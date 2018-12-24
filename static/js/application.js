
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

function createHighcharts(data) {
  Highcharts.setOptions({
    lang: {
      thousandsSep: ","
    }
  });

  Highcharts.chart("chart", {
    title: {
      text: "DataTables to Highcharts"
    },
    subtitle: {
      text: "Data from KDB+"
    },
    xAxis: [
      {
        categories: data[0],
        labels: {
          rotation: -45
        }
      }
    ],
    yAxis: [
      {
        // first yaxis
        title: {
          text: "Volume"
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
        name: "Volume",
        color: "#0071A7",
        type: "column",
        data: data[1],
        tooltip: {
          valueSuffix: " M"
        }
      },
      {
        name: "AvgPx",
        color: "#FF404E",
        type: "spline",
        data: data[2],
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
};


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
    series: [{
        name: 'sym',
        //data: [['Apple',89], ['Orange',71], ['Banana',16], ['Grapes',12], ['Others',14]]
        data: []
    }]
});


// timeseries chart
var timeseriesChart = Highcharts.chart('timeseries', {
    chart: {
        type: 'spline',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: { }
    },

    time: {
        useUTC: false
    },

    title: {
        text: 'Live Tick Data - '
    },
    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },
    yAxis: {
        title: {
            text: 'price'
        },
        opposite:true,
        labels:{
            x:-15
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
    },
    legend: {
        enabled: true
    },
    exporting: {
        enabled: true
    },
    series: [{
        name: 'Timeseries `tick (1-minute)',
        data: []
    }]
});


$(document).ready(function(){
    //connect to the socket server.
    var socket = io.connect('http://' + document.domain + ':' + location.port + '/test');
    var numbers_received = [];

    //receive details from server
    socket.on('newnumber', function(msg) {
        console.log("Received number: " + msg.number);
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

        //$('#log').html(msg.data);
        data = JSON.parse(msg.data);
        //console.log(data);

        // fancy grid
        console.log('xxxx fancy grid data: ');
        //console.log(grid.getData());
        grid.setData(data);

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
        grid.update(); // redraw

        getDataFiltered = grid.getDataFiltered();
        console.log('xxxx global search filter: ');
        console.log(searchFilter);
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
            Object.values(getDataFiltered).forEach(function(element) {
                filteredData.push(element.data);

                pieData.push([element.data.name, element.data.ts]);
            });
            console.log('xxxxxxxxx XXXX - filteredData:')
            console.log(filteredData);

            console.log(pieData);
            pieChart.series[0].setData(pieData, true);

            console.log('================ DEBUG ============');
        }


        // create chart
        chartdata = JSON.parse(msg.chartdata);
        //console.log(chartdata);

        const dataArray = [];
        dataArray.push(Object.values(chartdata['name']), Object.values(chartdata['Size']), Object.values(chartdata['AvgPx']));

        dtTableChart.xAxis[0].setCategories(Object.values(chartdata['name']));
        dtTableChart.series[0].setData(Object.values(chartdata['Size']));
        dtTableChart.series[1].setData(Object.values(chartdata['AvgPx']));


        // update series data instead of recreate everything
        piejson = JSON.parse(msg.piedata);
        //console.log('piejson xxx');
//        console.log(piejson);
//        console.log(Object.keys(piejson));
//        console.log(Object.values(piejson));

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
        // pieChart.series[0].setData(seriesData, true);



        var timeseriesData = [];
        timeseriesJson = JSON.parse(msg.timeseries);
        //console.log(timeseriesJson);
        Object.values(timeseriesJson).forEach(function(element) {
            timeseriesData.push({
                x: new Date(element['time']),
                y: element['tp']
            })
        });
        //console.log('xxxxxxxxx time series data: ');
        //console.log(timeseriesData[timeseriesData.length-1]);
        timeseriesChart.series[0].setData(Object.values(timeseriesData));


    });

});