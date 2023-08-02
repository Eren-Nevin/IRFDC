import json
import requests
import random
from time import sleep
from pprint import pprint

from requests.sessions import Request
from excel import write_ads_to_csv

base_api_url = 'https://irc.fda.gov.ir/api'

# TODO : Add other endpoints
products_api_endpoints = {
    'Substance': '/IRCApi/GetRegisteredSubstanceIRC'
}

# company_url = 'https://irc.fda.gov.ir/api/Company/LoadCompanies?pageNumber=798&pageSize=100&term=' 

def get_headers():
    return {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9,fa-IR;q=0.8,fa;q=0.7,af;q=0.6',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'DNT': '1',
    'Pragma': 'no-cache',
    'Referer': 'https://irc.fda.gov.ir/home/public/IRC',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    }

def get_all_companies(file_path: str, max_count: int, mean_time_between=10):
    count, _ = get_company_page(1, 10)
    if max_count:
        count = min(count, max_count)
    print(count)
    page_size = 1000
    max_pages = (count // 1000) + 1
    results = []
    for i in range(1, max_pages):
        print(i)
        sleep(mean_time_between * 2 * random.random())
        results = [*results, *(get_company_page(i, page_size)[0])]

    write_ads_to_csv(file_path, results)

def get_company_page(page_number: int, page_size: int):
    company_url = f'{base_api_url}/Company/LoadCompanies'
    url_with_params = f'{company_url}?pageNumber={page_number}&pageSize={page_size}&term='
    print(url_with_params)

    s = requests.session();

    # Coockie is set here
    s.get('https://irc.fda.gov.ir/home/public/IRC')

    raw_res = s.get(url_with_params, headers=get_headers())

    res = raw_res.json()

    count = res['Count']
    success = res['Success']
    message = res['Message']
    result = res['Result']


    return result, count

def get_specific_product_page(api_endpoint: str, page_number: int, page_size: int):
    product_url = f'{base_api_url}{api_endpoint}'
    url_with_params = f'{product_url}?pageNumber={page_number}&pageSize={page_size}&term='
    print(url_with_params)

    s = requests.session();

    # Coockie is set here
    s.get('https://irc.fda.gov.ir/home/public/IRC')

    raw_res = s.get(url_with_params, headers=get_headers())
    
    res = raw_res.json()

    count = res['Count']
    success = res['Success']
    message = res['Message']
    result = res['Result']


    return result, count

def get_all_specific_product(api_endpoint: str, file_path: str, max_count: int, mean_time_between=10):
    _, count = get_specific_product_page(api_endpoint, 1, 10)
    if max_count:
        count = min(count, max_count)
    print(count)
    page_size = 1000
    max_pages = (count // 1000) + 1
    results = []
    for i in range(1, max_pages):
        print(i)
        sleep(mean_time_between * 2 * random.random())
        results = [*results, *(get_specific_product_page(api_endpoint, i, page_size)[0])]

    write_ads_to_csv(file_path, results)


if __name__ == '__main__':
    get_all_specific_product(products_api_endpoints['Substance'], '../appData/substance.csv',
                             2000)
