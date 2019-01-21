"""
Demo Flask application to test the operation of Flask with socket.io
===================
Updated 15th December 2018

"""

# Start with a basic flask app webpage.
import flask
from flask_socketio import SocketIO, emit
from flask import Flask, render_template, url_for, copy_current_request_context
from random import random
from time import sleep
from threading import Thread, Event
from qpython import qconnection
import os

import dash
from dash.dependencies import Input, Output
import dash_core_components as dcc
import dash_html_components as html


__author__ = 'gf'

#app = Flask(__name__)
#app.config['SECRET_KEY'] = 'secret!'
#app.config['DEBUG'] = True

server = flask.Flask('app')
server.secret_key = os.environ.get('secret_key', 'secret')

#app = dash.Dash('app', server=server)
#app.scripts.config.serve_locally = False
#dcc._js_dist[0]['external_url'] = 'https://cdn.plot.ly/plotly-basic-latest.min.js'

#turn the flask app into a socketio app
socketio = SocketIO(server)

#random number Generator Thread
thread = Thread()
thread_stop_event = Event()

rdb = qconnection.QConnection(host='localhost', port=5001, pandas=True)
rdb.open()
print('connected to Kdb service: ')
print(rdb)
query = '`name`ts`tp`time`id#0!select from (trade lj `id xkey smTbl)'

class KdbThread(Thread):
    def __init__(self):
        self.seqnum = -1
        self.delay = 10
        super(KdbThread, self).__init__()

    def updateUI(self):
        #infinite loop of receiving Kdb updates
        print("...querying Kdb+ ...")

        while not thread_stop_event.isSet():
            self.seqnum = self.seqnum + 1
            print('query: '+query)
            data = rdb.sync(query)
            print(len(data))
            #print(data)
            json = data.to_json(orient='records', date_format='iso', date_unit='ms')
            print(json)

            query2 = '0!select Size:sum ts, AvgPx: ts wavg tp  by name from 0!select from (trade lj `id xkey smTbl)'
            print('query2: '+query2)
            chartdata = rdb.sync(query2)
            chartjson = chartdata.to_json(orient='columns')
            print(chartjson)

            #query3 = '`Time xasc `Time`Value#-20#0!update Time:time, Value:tp from select by 0D00:01 xbar time from trades'
            query3 = '0!select Size:sum ts by name from 0!select from (trade lj `id xkey smTbl)'
            print('query3: ' + query3)
            piedata = rdb.sync(query3)
            piejson = piedata.to_json(orient='index', date_format='iso', date_unit='ms')
            print(piejson)

            query4 = '-20#select from trades where id=1'
            query4 = '-20#0!select volume:sum ts, price:last tp by 0D00:01 xbar time from trades where id=1 '
            print('query4: ' + query4)
            timeseriesdata = rdb.sync(query4)
            #timeseriesjson = timeseriesdata.to_json(orient='index', date_format='iso', date_unit='ms')
            timeseriesjson = timeseriesdata.to_json(orient='columns', date_format='iso', date_unit='ms')
            print(timeseriesjson)

            query5 = '0!select volume:sum ts, price:last tp by 0D00:01 xbar time from trades where id=1 '
            print('query5: ' + query5)
            timeseriesdata2 = rdb.sync(query5)
            timeseriesjson2 = timeseriesdata2.to_json(orient='index', date_format='iso', date_unit='ms')
            print(timeseriesjson2)

            socketio.emit('newnumber', {'number': self.seqnum, 'data': json, 'chartdata': chartjson, 'piedata': piejson
                , 'timeseries': timeseriesjson
                , 'timeseries2': timeseriesjson2}
                          , namespace='/test')
            sleep(self.delay)


    def run(self):
        self.updateUI()

@server.route('/')
def index():
    #only by sending this page first will the client be connected to the socketio instance
    return render_template('index.html')

@socketio.on('connect', namespace='/test')
def test_connect():
    # need visibility of the global thread object
    global thread
    print('Client connected')

    #Start the random number generator thread only if the thread has not been started before.
    if not thread.isAlive():
        print("Starting Thread")
        thread = KdbThread()
        thread.start()

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')

# processing UI actions
@server.route('/getjsondata')
def getJsonData():
    print('....from UI action received.')
    query3 = '`Time xasc `Time`Value#-20#0!update Time:time, Value:tp from select by 0D00:01 xbar time from trades'
    print('query3: ' + query3)
    chartdata = rdb.sync(query3)
    chartjson = chartdata.to_json(orient='columns', date_format='iso', date_unit='ms')
    print(chartjson)

    return chartjson


if __name__ == '__main__':
    #socketio.run(app)
    # start the UI thread
    socketio.run(server);
    #app.run_server();
