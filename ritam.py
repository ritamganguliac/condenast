import requests
from bs4 import BeautifulSoup
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import numpy as np

# Function to scrape stock symbols from NSE
def scrape_nse_stocks():
    url = "https://www.nseindia.com/market-data/equity-stockIndices"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
    }
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    stock_symbols = []
    # Adjust the selectors according to the actual structure of the webpage
    for row in soup.select('.equityStockIndices'):
        try:
            stock_symbol = row.select_one('td:nth-child(1)').text.strip()
            stock_symbols.append(stock_symbol)
        except Exception as e:
            print(f"Error parsing row: {e}")

    return stock_symbols

# Function to analyze stocks
def identify_stocks_to_watch(stock_symbols):
    results = []

    for symbol in stock_symbols:
        try:
            # Fetch historical data for the last 60 days
            end_date = datetime.now()
            start_date = end_date - timedelta(days=60)
            stock_data = yf.download(symbol + '.NS', start=start_date, end=end_date)

            # Calculate returns and moving averages
            stock_data['Return'] = stock_data['Adj Close'].pct_change()
            stock_data['SMA_10'] = stock_data['Adj Close'].rolling(window=10).mean()
            stock_data['SMA_20'] = stock_data['Adj Close'].rolling(window=20).mean()

            # Check if the stock is trending upwards
            if stock_data['SMA_10'].iloc[-1] > stock_data['SMA_20'].iloc[-1]:
                # Further check for significant returns over the last few days
                recent_returns = stock_data['Return'].iloc[-5:].sum()
                if recent_returns > 0.05:  # More than 5% increase in the last 5 days
                    # Check for cyclic pattern
                    if is_cyclic_pattern(stock_data['Adj Close']):
                        results.append(symbol)

        except Exception as e:
            print(f"Error processing {symbol}: {e}")

    return results

# Function to determine if a stock has a cyclic pattern
def is_cyclic_pattern(prices, threshold=0.05):
    # Calculate the moving average to smooth out price fluctuations
    prices_ma = prices.rolling(window=10).mean().dropna()
    
    # Identify peaks and troughs
    peaks = (prices_ma.shift(1) < prices_ma) & (prices_ma.shift(-1) < prices_ma)
    troughs = (prices_ma.shift(1) > prices_ma) & (prices_ma.shift(-1) > prices_ma)
    
    # Count peaks and troughs
    peak_indices = np.where(peaks)[0]
    trough_indices = np.where(troughs)[0]
    
    # Calculate the number of cycles and their growth
    cycles = min(len(peak_indices), len(trough_indices))
    
    if cycles < 2:  # Need at least two cycles to define a pattern
        return False

    # Analyze growth between peaks and troughs
    growths = []
    for i in range(1, cycles):
        growth = (prices_ma[peak_indices[i]] - prices_ma[trough_indices[i - 1]]) / prices_ma[trough_indices[i - 1]]
        growths.append(growth)

    # Check if the average growth exceeds the threshold
    average_growth = np.mean(growths)
    return average_growth > threshold

# Scrape stock symbols
indian_stocks = scrape_nse_stocks()

# Identify potential stocks
stocks_to_watch = identify_stocks_to_watch(indian_stocks)

# Print results
print("Stocks to watch for potential cyclic growth pattern:")
for stock in stocks_to_watch:
    print(stock)
