import data_management as dm
import pandas as pd

def main():
    data = dm.fetch_data('AAPL')
    pd.set_option('display.max_columns', None)
    print(data.tail())


if __name__ == '__main__':
    main()
