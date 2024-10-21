import requests
from bs4 import BeautifulSoup
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import numpy as np
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import asyncio
from aiosmtpd.controller import Controller

# Function to scrape stock symbols from NSE
def scrape_nse_stocks():
    url = "https://www.nseindia.com/market-data/equity-stockIndices"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
    }
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    stock_symbols = []
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
            end_date = datetime.now()
            start_date = end_date - timedelta(days=60)
            stock_data = yf.download(symbol + '.NS', start=start_date, end=end_date)

            stock_data['Return'] = stock_data['Adj Close'].pct_change()
            stock_data['SMA_10'] = stock_data['Adj Close'].rolling(window=10).mean()
            stock_data['SMA_20'] = stock_data['Adj Close'].rolling(window=20).mean()

            if stock_data['SMA_10'].iloc[-1] > stock_data['SMA_20'].iloc[-1]:
                recent_returns = stock_data['Return'].iloc[-5:].sum()
                if recent_returns > 0.05:  # More than 5% increase in the last 5 days
                    if is_cyclic_pattern(stock_data['Adj Close']):
                        results.append(symbol)

        except Exception as e:
            print(f"Error processing {symbol}: {e}")

    return results

# Function to determine if a stock has a cyclic pattern
def is_cyclic_pattern(prices, threshold=0.05):
    prices_ma = prices.rolling(window=10).mean().dropna()
    peaks = (prices_ma.shift(1) < prices_ma) & (prices_ma.shift(-1) < prices_ma)
    troughs = (prices_ma.shift(1) > prices_ma) & (prices_ma.shift(-1) > prices_ma)

    peak_indices = np.where(peaks)[0]
    trough_indices = np.where(troughs)[0]

    cycles = min(len(peak_indices), len(trough_indices))

    if cycles < 2:  # Need at least two cycles to define a pattern
        return False

    growths = []
    for i in range(1, cycles):
        growth = (prices_ma[peak_indices[i]] - prices_ma[trough_indices[i - 1]]) / prices_ma[trough_indices[i - 1]]
        growths.append(growth)

    average_growth = np.mean(growths)
    return average_growth > threshold

# Function to send an email
def send_email(subject, body, to_email):
    sender_email = "ritamganguliac@gmail.com"  # Replace with your email
    sender_password = "Shiva@12"  # Use app password if using Gmail

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    # Connect to the local SMTP server
    with smtplib.SMTP('localhost', 1025) as server:  # Change to your server settings
        server.send_message(msg)

# Simple SMTP server for testing
class CustomSMTPHandler:
    async def handle_DATA(self, server, session, envelope):
        print('Message from:', envelope.mail_from)
        print('Message for:', envelope.rcpt_tos)
        print('Message data:\n', envelope.content.decode())
        return '250 OK'

# async def start_smtp_server():
#     controller = Controller(CustomSMTPHandler(), hostname='localhost', port=1025)
#     controller.start()
# #     print('SMTP server started on localhost:1025')
#     await asyncio.sleep(3600)  # Keep the server running for an hour

# Main function
async def main():
    # Start the SMTP server
    # asyncio.create_task(start_smtp_server())

    # Scrape stock symbols
    indian_stocks = scrape_nse_stocks()

    # Identify potential stocks
    stocks_to_watch = identify_stocks_to_watch(indian_stocks)

    # Prepare email content
    if stocks_to_watch:
        email_body = "Stocks to watch for potential cyclic growth pattern:\n" + "\n".join(stocks_to_watch)
    else:
        email_body = "No stocks found with potential cyclic growth patterns."

    # Send email
    send_email("Stocks to Watch", email_body, "ritamganguliac@gmail.com")  # Replace with recipient email

# Run the main function
if __name__ == '__main__':
    asyncio.run(main())
