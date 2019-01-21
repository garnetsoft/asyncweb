import dash
from dash.dependencies import Input, Output
import dash_html_components as html
import dash_core_components as dcc

import plotly.plotly as py
import plotly.graph_objs as go
from plotly import tools

import numpy as np

# Kdb api
from qpython import qconnection

rdb = qconnection.QConnection(host='localhost', port=5001, pandas=True)
rdb.open()
print('connected to Kdb service: ')
print(rdb)
df2 = rdb.sync('select name from smTbl')
data=[]
for x in df2.name.values:
    data.append({'label':x, 'value':x})
print(data)

selectedValue = str(data[0]['label'], "utf-8")
print(selectedValue)

app = dash.Dash(__name__)

def make_dash_table( df ):
    ''' Return a dash definitio of an HTML table for a Pandas dataframe '''
    table = []
    for index, row in df.iterrows():
        html_row = []
        for i in range(len(row)):
            html_row.append( html.Td([ row[i] ]) )
        table.append( html.Tr( html_row ) )
    return table


def create_time_series(dff, axis_type, title):
    return {
        'data': [go.Scatter(
            x=dff['Year'],
            y=dff['Value'],
            mode='lines+markers'
        )],
        'layout': {
            'height': 225,
            'margin': {'l': 20, 'b': 30, 'r': 10, 't': 10},
            'annotations': [{
                'x': 0, 'y': 0.85, 'xanchor': 'left', 'yanchor': 'bottom',
                'xref': 'paper', 'yref': 'paper', 'showarrow': False,
                'align': 'left', 'bgcolor': 'rgba(255, 255, 255, 0.5)',
                'text': title
            }],
            'yaxis': {'type': 'linear' if axis_type == 'Linear' else 'log'},
            'xaxis': {'showgrid': False}
        }
    }


app.layout = html.Div([
    html.Button(
        id='button',
        children='Update Candlestick',
        n_clicks=0
    ),
    dcc.Graph(id='graph'),
    dcc.Dropdown(
        id='dropdown',
        options=data,
        value=selectedValue
    ),
    dcc.Graph(id='candlestick'),
    dcc.Interval(
        id='interval-component',
        interval=1 * 1000,  # in milliseconds
        n_intervals=0
    )
])

@app.callback(Output('graph', 'figure'), [Input('button', 'n_clicks')])
def update_graph(n_clicks):
    query = '-{}#0!select open:first Close, high:max Close, low:min Close, close:last Close, volume:sum Size by 0D00:01 xbar Date from select Date:time, Close:tp, Size:ts from (trades lj `id xkey smTbl )where name=`{}'.format(n_clicks*5,'IBM')
    df = rdb.sync(query)
    #print(df.tail())

    trace1 = go.Candlestick(
        x=df['Date'],
        open=df['open'],
        high=df['high'],
        low=df['low'],
        close=df['close'],
    )

    trace2 = go.Bar(
        x=df['Date'],
        y=df['volume'],
    )

    fig = tools.make_subplots(rows=2, cols=1, specs=[[{}], [{}], [{}]],
                          shared_xaxes=True, shared_yaxes=True,
                          vertical_spacing=0.001)

    fig.append_trace(trace1, 1, 1)
    fig.append_trace(trace2, 2, 1)

    fig['layout'].update(height=600, width=600, title='Stacked Subplots with Shared X-Axes')

    return fig


@app.callback(Output('candlestick', 'figure'), [Input('dropdown', 'value'), Input('interval-component', 'n_intervals')])
def update_graph(contract, n):
    # print('xxxx realtime update: ' + str(n))
    query = '0!select open:first Close, high:max Close, low:min Close, close:last Close by 0D00:01 xbar Date from select Date:time, Close:tp from (trades lj `id xkey smTbl )where name=`{}'.format(contract)
    df = rdb.sync(query)
    #print(df.tail())

    trades = '0!select count i, Size:sum ts, AvgPx: ts wavg tp by name, 0D00:01 xbar time from 0!select from (trades lj `id xkey smTbl) where name=`{}'.format(contract)
    dff = rdb.sync(trades)
    print(dff.tail())

    return {
        'data': [{
            'x': df['Date'],
            'open': df['open'],
            'high': df['high'],
            'low': df['low'],
            'close': df['close'],
            'type': 'candlestick'
            #'type': 'ohlc'
        },{
            'x': dff['time'],
            'y': dff['AvgPx'],
            'mode': 'markers',
            'marker': dict(
                size=5,
                color = dff['Size'], #set color equal to a variable
                colorscale='Viridis',
                showscale=False
            )
        }],
        'layout': {
            'title': 'x is {}'.format(contract),
            'yaxis': dict(
                title='yaxis title',
                side='right'
            ),
        }
    }


if __name__ == '__main__':
    app.run_server(debug=True)