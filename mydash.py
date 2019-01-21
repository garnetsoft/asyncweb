import dash
from dash.dependencies import Input, Output
import dash_core_components as dcc
import dash_html_components as html

import plotly.plotly as py
import plotly.graph_objs as go
from plotly import tools


import pandas as pd
from datetime import datetime

import flask
import pandas as pd
import datetime
import os

# Kdb api
from qpython import qconnection

#https://towardsdatascience.com/a-short-python-tutorial-using-the-open-source-plotly-dash-library-part-i-e59fb1f1a457

server = flask.Flask('app')
server.secret_key = os.environ.get('secret_key', 'secret')

df1 = pd.read_csv('https://raw.githubusercontent.com/plotly/datasets/master/hello-world-stock.csv')
print(df1.head())
print(df1['Stock'].unique())

rdb = qconnection.QConnection(host='localhost', port=5001, pandas=True)
rdb.open()
print('connected to Kdb service: ')
print(rdb)
query = 'select from smTbl'
df2 = rdb.sync(query)

data=[]
for x in df2.name.values:
    data.append({'label':x, 'value':x})
print(data)

selectedValue = str(data[0]['label'], "utf-8")
print(selectedValue)

# main Dash app
app = dash.Dash('app', server=server)

app.scripts.config.serve_locally = False
dcc._js_dist[0]['external_url'] = 'https://cdn.plot.ly/plotly-basic-latest.min.js'


## MAIN CHART TRACES (STYLE tab)
def line_trace(df):
    trace = go.Scatter(
        x=df.index, y=df["close"], mode="lines", showlegend=False, name="line"
    )
    return trace


def area_trace(df):
    trace = go.Scatter(
        x=df.index, y=df["close"], showlegend=False, fill="toself", name="area"
    )
    return trace


def bar_trace(df):
    return go.Ohlc(
        x=df.index,
        open=df["open"],
        high=df["high"],
        low=df["low"],
        close=df["close"],
        increasing=dict(line=dict(color="#888888")),
        decreasing=dict(line=dict(color="#888888")),
        showlegend=False,
        name="bar",
    )


def colored_bar_trace(df):
    return go.Ohlc(
        x=df.index,
        open=df["open"],
        high=df["high"],
        low=df["low"],
        close=df["close"],
        showlegend=False,
        name="colored bar",
    )


def candlestick_trace(df):
    return go.Candlestick(
        x=df.index,
        open=df["open"],
        high=df["high"],
        low=df["low"],
        close=df["close"],
        increasing=dict(line=dict(color="#00ff00")),
        decreasing=dict(line=dict(color="white")),
        showlegend=False,
        name="candlestick",
    )

app.layout = html.Div([
    html.H1('Stock Tickers'),
    html.Div(id='live-update-text'),
    dcc.Dropdown(
        id='my-dropdown',
        options=data,
        value=selectedValue
    ),
    dcc.Graph(id='my-graph'),
    dcc.Graph(id='my-graph2'),
    dcc.Interval(
        id='interval-component',
        interval=5 * 1000,  # in milliseconds
        n_intervals=0
    )
], className="container")



@app.callback(Output('my-graph', 'figure'),
              [Input('my-dropdown', 'value')])
def update_graph(selected_dropdown_value):
    #dff = df[df['Stock'] == selected_dropdown_value]
    print('xxxx check globals()')
    # print(globals())

    # query Kdb for real-time data
    global selectedValue
    selectedValue = selected_dropdown_value
    print('selectedValue: ' + selectedValue)
    query = '0!select by 0D00:05 xbar Date from select Date:time, Close:tp from (trades lj `id xkey smTbl )where name=`{}'.format(selected_dropdown_value)
    dff = rdb.sync(query)

    return {
        'data': [{
            'x': dff.Date,
            'y': dff.Close,
            'line': {
                'width': 3,
                'shape': 'spline'
            }
        }],
        'layout': {
            'margin': {
                'l': 30,
                'r': 20,
                'b': 30,
                't': 20
            }
        }
    }



@app.callback(Output('live-update-text', 'children'),
              [Input('interval-component', 'n_intervals')])
def update_metrics(n):
    #print('nnnn: ' + str(n))
    now = datetime.datetime.now()

    style = {'padding': '5px', 'fontSize': '16px'}
    return [
        html.Span('last update: {}'.format(now), style=style),
    ]


# real-time chart - websocket would be perfect
@app.callback(Output('my-graph2', 'figure'),
              [Input('interval-component', 'n_intervals')])
def update_realtime_chart(n_clicks):
    global selectedValue
    print('xxxx update_realtime_chart: '+selectedValue)
    query = '0!select open:first Close, high:max Close, low:min Close, close:last Close by 0D00:01 xbar Date from select Date:time, Close:tp from (trades lj `id xkey smTbl )where name=`{}'.format(selectedValue)
    dff = rdb.sync(query)

    print(dff.tail())

    trace = go.Ohlc(
        x=dff["Date"],
        open=dff["open"],
        high=dff["high"],
        low=dff["low"],
        close=dff["close"],
        showlegend=False,
        name="colored bar",
    )

    layout = go.Layout(
        xaxis=dict(
            rangeslider=dict(
                visible=False
            )
        )
    )

    data = [trace]

    fig = go.Figure(data=data, layout=layout)

    return fig
    


if __name__ == '__main__':
    app.run_server()
