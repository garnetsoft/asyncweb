asyncweb dev

https://medium.freecodecamp.org/why-you-need-python-environments-and-how-to-manage-them-with-conda-85f155f4353c

Updated to Python 3: Dec-16-2018

https://www.udemy.com/interactive-python-dashboards-with-plotly-and-dash/

https://towardsdatascience.com/python-for-finance-stock-portfolio-analyses-6da4c3e61054
https://towardsdatascience.com/python-for-finance-dash-by-plotly-ccf84045b8be

IMPL - https://towardsdatascience.com/aifortrading-2edd6fac689d
https://github.com/borisbanushev/stockpredictionai
https://github.com/borisbanushev/predictions (FX and ML)


===========

Test of asynchronous flask communication with web page. 

This repository is a sample flask application that updates a webpage using a background thread for all users connected.
It is based on the very useful Flask-SocketIO lib.

To use - please clone the repository and then set up your virtual environment using the requirements.txt file with pip and virtualenv. You can achieve this with:


    git clone https://github.com/garnetsoft/asyncweb
    cd asyncweb
    virtualenv flaskiotest
    ./flaskiotest/Scripts/activate
    pip install -r requirements.txt  #(or in Windows - sometimes python -m pip install -r requirements.txt )

	
Start the application with:

<code>
python application.py
</code>

And visit http://localhost:5000 to see the updating numbers.

"""
Dash - https://dash.plot.ly/gallery

https://github.com/plotly/dash-web-trader
Symbol,Date,Bid,Ask
EURUSD,2016-01-04 18:00:40.420,1.08196,1.082
EURUSD,2016-01-04 18:00:40.442,1.08194,1.082
EURUSD,2016-01-04 18:00:40.528,1.08196,1.082
EURUSD,2016-01-04 18:00:40.554,1.08194,1.082
EURUSD,2016-01-04 18:00:40.651,1.08194,1.08198
EURUSD,2016-01-04 18:00:40.683,1.08194,1.082
EURUSD,2016-01-04 18:00:40.926,1.08196,1.082

https://github.com/plotly/dash-wind-streaming

https://plot.ly/scikit-learn/plot_stock_market/

"""
https://www.datacamp.com/community/tutorials/learn-build-dash-python

https://medium.com/@plotlygraphs/introducing-dash-5ecf7191b503


app.layout = html.Div(
    [
        # Interval component for live clock
        dcc.Interval(id="interval", interval=1 * 1000, n_intervals=0),
        # Interval component for ask bid updates
        dcc.Interval(id="i_bis", interval=1 * 2000, n_intervals=0),
        # Interval component for graph updates
        dcc.Interval(id="i_tris", interval=1 * 5000, n_intervals=0),
        # Interval component for graph updates
        dcc.Interval(id="i_news", interval=1 * 60000, n_intervals=0),


        # left Div
        html.Div(
            [
                get_logo(),
                html.Div(
                    children=[get_header()],
                    style={"backgroundColor": "#18252E","paddingTop":"15"},
                    id="ask_bid_header",
                    className="row",
                ),
                html.Div(
                    get_first_pairs(datetime.datetime.now()),
                    style={
                        "maxHeight":"45%",
                        "backgroundColor": "#18252E",
                        "color": "white",
                        "fontSize": "12",
                        "paddingBottom":"15"
                    },
                    className="",
                    id="pairs",
                ),
                html.Div([
                    html.P('Headlines',style={"fontSize":"13","color":"#45df7e"}),
                    html.Div(update_news(),id="news")
                    ],
                    style={
                        "height":"33%",
                        "backgroundColor": "#18252E",
                        "color": "white",
                        "fontSize": "12",
                        "padding":"10px 10px 0px 10px",
                        "marginTop":"5",
                        "marginBottom":"0"
                    }),
            ],
            className="three columns",
            style={
                "backgroundColor": "#1a2d46",
                "padding": "10",
                "margin": "0",
                "height":"100%"
            },
        ),



        # center div
        html.Div(
            [
                html.Div(
                    get_top_bar(),
                    id="top_bar",
                    className="row",
                    style={
                        "margin": "0px 5px 0px 5px",
                        "textAlign": "center",
                        "height": "6%",
                        "color": "white",
                        "backgroundColor": "#1a2d46",
                    },
                ),

                html.Div(
                    [chart_div(pair) for pair in currencies],
                    style={"height": "70%", "margin": "0px 5px"},
                    id="charts",
                    className="row",
                ),

                bottom_panel(),
            ],
            className="nine columns",
            id="rightpanel",
            style={
                "backgroundColor": "#18252E",
                "height": "100vh",
                "color": "white",
            },
        ),


        html.Div(
            id="charts_clicked",
            style={"display": "none"},  # hidden div that stores clicked charts
        ),
        html.Div(orders_div()),  # hidden div for each pair that stores orders
        html.Div([modal(pair) for pair in currencies]),
        html.Div(
            id="orders", style={"display": "none"}  # hidden div that stores all orders,
        ),
    ],
    style={"padding": "0", "height": "100vh", "backgroundColor": "#1a2d46"},
)

Dash live update example

                # news panel
                html.Div([
                    html.P('Headlines',style={"fontSize":"13","color":"#45df7e"}),
                    html.Div(update_news(),id="news")
                    ],
                    style={
                        "height":"33%",
                        "backgroundColor": "#18252E",
                        "color": "white",
                        "fontSize": "12",
                        "padding":"10px 10px 0px 10px",
                        "marginTop":"5",
                        "marginBottom":"0"
                    }),

        # Interval component for live clock
        dcc.Interval(id="interval", interval=1 * 1000, n_intervals=0),
        # Interval component for ask bid updates
        dcc.Interval(id="i_bis", interval=1 * 2000, n_intervals=0),
        # Interval component for graph updates
        dcc.Interval(id="i_tris", interval=1 * 5000, n_intervals=0),
        # Interval component for graph updates
        dcc.Interval(id="i_news", interval=1 * 60000, n_intervals=0),

@app.callback(Output("live_clock", "children"), [Input("interval", "n_intervals")])
def update_time(n):
    return datetime.datetime.now().strftime("%H:%M:%S")

@app.callback(Output("news", "children"), [Input("i_news", "n_intervals")])
def update_news_div(n):
    return update_news()

# retrieve and displays news
def update_news():
    r = requests.get('https://newsapi.org/v2/top-headlines?sources=financial-times&apiKey=da8e2e705b914f9f86ed2e9692e66012')
    json_data = r.json()["articles"]
    df = pd.DataFrame(json_data)
    df = pd.DataFrame(df[["title","url"]])
    return generate_news_table(df)

def generate_news_table(dataframe, max_rows=10):
    return html.Div(
        [
            html.Div(
                html.Table(
                    # Header
                    [html.Tr([html.Th()])]
                    +
                    # Body
                    [
                        html.Tr(
                            [
                                html.Td(
                                    html.A(
                                        dataframe.iloc[i]["title"],
                                        href=dataframe.iloc[i]["url"],
                                        target="_blank",
                                    )
                                )
                            ]
                        )
                        for i in range(min(len(dataframe), max_rows))
                    ]
                ),
                style={"height": "150px", "overflowY": "scroll"},
            ),
            html.P(
                "Last update : " + datetime.datetime.now().strftime("%H:%M:%S"),
                style={"fontSize": "11", "marginTop": "4", "color": "#45df7e"},
            ),
        ],
        style={"height": "100%"},
    )



https://www.datacamp.com/community/tutorials/learn-build-dash-python

"""
Visualizing real-time data stream  using Python Dash and Microsoft SQL Server
"""

import dash
from dash.dependencies import Output, Event
import dash_core_components as dcc
import dash_html_components as html
import plotly
import plotly.graph_objs as go
from collections import deque
import pandas as pd
import pyodbc


def connectSQLServer(driver, server, db):
    connSQLServer = pyodbc.connect(
        r'DRIVER={' + driver + '};'
        r'SERVER=' + server + ';'
        r'DATABASE=' + db + ';'
        r'Trusted_Connection=yes;',
        autocommit=True
    )
    return connSQLServer


name_title = 'Stats from SQL Server'
app = dash.Dash(__name__)

app.layout = html.Div(children=[

    html.H1(children='Read near real-time data from SQL Server on Scatterplot '),
     dcc.Graph(
        id='example-graph',animate=True),dcc.Interval(id='graph-update',interval=1*500),])


@app.callback(Output('example-graph', 'figure'),
              events=[Event('graph-update', 'interval')])


def update_graph_scatter():

    dataSQL = [] #set an empty list
    X = deque(maxlen=10)
    Y = deque(maxlen=10)

    sql_conn = connectSQLServer('ODBC Driver 13 for SQL Server', 'TOMAZK\MSSQLSERVER2017', 'test')
    cursor = sql_conn.cursor()
    cursor.execute("SELECT num,ID FROM dbo.LiveStatsFromSQLServer")
    rows = cursor.fetchall()
    for row in rows:
        dataSQL.append(list(row))
        labels = ['num','id']
        df = pd.DataFrame.from_records(dataSQL, columns=labels)
        X = df['id']
        Y = df['num']


    data = plotly.graph_objs.Scatter(
            x=list(X),
            y=list(Y),
            name='Scatter',
            mode= 'lines+markers'
            )

    return {'data': [data],'layout' : go.Layout(xaxis=dict(range=[min(X),max(X)]),
                                                yaxis=dict(range=[min(Y),max(Y)]),)}

if __name__ == "__main__":
    app.run_server(debug=True)


