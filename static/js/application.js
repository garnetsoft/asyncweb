
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

var liveChart = Highcharts.chart('livechart', {
		chart: {
        type: 'pie'
    },
    credits: {
    	enabled: false
    },
    title: {
    	text: 'Fruits Distribution'
    },
    series: [{
        name: 'Fruits',
        data: [['Apple',89], ['Orange',71], ['Banana',16], ['Grapes',12], ['Others',14]]
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
            text: 'Value'
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
        enabled: false
    },
    exporting: {
        enabled: false
    },
    series: [{
        name: 'Time series data',
        data: []
    }]
});

$(document).ready(function(){
    //connect to the socket server.
    var socket = io.connect('http://' + document.domain + ':' + location.port + '/test');
    var numbers_received = [];

    var myData = [{
        "name":"name00",
        "ts":"name00",
        "tp":"name00",
        "time":"name00",
        "id":"name00",
    }];

    var data_header = [
            {data:'name'},
            {data:'ts'},
            {data:'tp'},
            {data:'time'},
            {data:'id'},
        ];

    // define DataTable()
    var table = $('#dt-table').dataTable({
        "paging": true,
        data: [],
        columns: data_header
    });

    //var myChart = createHighcharts();
    //var liveChart = createChart();

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
            numbers_string = numbers_string + '<p>' + numbers_received[i].toString() + '</p>';
        }
        // $('#log').html(numbers_string);
        $('#seqnum').html(msg.number);

        //$('#log').html(msg.data);
        data = JSON.parse(msg.data);
        //console.log(data);

        $('#dt-table').dataTable().fnClearTable();
        $('#dt-table').dataTable().fnAddData(data);

        // create chart
        chartdata = JSON.parse(msg.chartdata);
        console.log(chartdata);

        const dataArray = [];
        dataArray.push(Object.values(chartdata['name']), Object.values(chartdata['Size']), Object.values(chartdata['AvgPx']));

        dtTableChart.xAxis[0].setCategories(Object.values(chartdata['name']));
        dtTableChart.series[0].setData(Object.values(chartdata['Size']));
        dtTableChart.series[1].setData(Object.values(chartdata['AvgPx']));


        // update series data instead of recreate everything
        piejson = JSON.parse(msg.piedata);
        console.log('piejson xxx');
//        console.log(piejson);
//        console.log(Object.keys(piejson));
//        console.log(Object.values(piejson));

        const dataPie = [];
        dataPie.push(Object.values(piejson));
        liveChart.setTitle({text: "Live Kdb updates - FillQty"});
        console.log(dataPie);
        //console.log(Object.keys(dataPie));
        //console.log(Object.values(dataPie));
        console.log('111111: '+Object.values(dataPie));
        console.log('222222: '+(Object.values(dataPie)).length);

        var seriesData = [];
        Object.values(dataPie).forEach(function(element) {
            for (var j=0; j<element.length; j++) {
                seriesData.push(Object.values(element[j]));
            }
        });
        console.log(seriesData);
        liveChart.series[0].setData(seriesData, true);

        var timeseriesData = [];
        timeseriesJson = JSON.parse(msg.timeseries);
        //console.log(timeseriesJson);
        Object.values(timeseriesJson).forEach(function(element) {
            timeseriesData.push({
                x: new Date(element['time']),
                y: element['tp']
            })
        });
        console.log('xxxxxxxxx time series data: ');
        console.log(timeseriesData[timeseriesData.length-1]);
        timeseriesChart.series[0].setData(Object.values(timeseriesData));

    });

});