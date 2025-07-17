import yfinance as yf
import ta

def fetch_data(symbol):

    data_frame = yf.download(symbol, interval= '5m', period='60d')

    # Adds some features
    data_frame['RSI'] = ta.momentum.RSIIndicator(data_frame['Close'], window=14)
    data_frame['MACD'] = ta.trend.MACD(data_frame['Close']).macd()
    data_frame['SMA_20'] = data_frame['Close'].rolling(window=20).mean()
    data_frame['Daily_Return_Lag1'] = data_frame['Close'].pct_change().shift(1)


    return data_frame
