import json
from typing import Optional
import requests
import random
import sys
from time import sleep
from pprint import pprint

from requests.sessions import Request
from excel import  write_ads_to_excel

base_api_url = 'https://irc.fda.gov.ir/api'

# TODO : Add other endpoints
products_api_endpoints = {
    'substance': '/IRCApi/GetRegisteredSubstanceIRC',
    'drug_license': '/IRCApi/GetDrugLicenseItemIRC',
    'drug_equipment': '/IRCApi/GetDrugEquipmentLicenseItemIRC', # Doesn't Work
    'supplement': '/IRCApi/GetSupplementRegisteredIRC',
    'supplement_license': '/IRCApi/GetSupplementLicenseItemIRC',
    'food': '/IRCApi/GetFoodRegisteredIRC', # Work with company
    'cosmetic': '/IRCApi/GetCosmeticRegisteredIRC',
    'special_food': '/IRCApi/GetParticulareFoodRegisteredIRC',
    'herbal': '/IRCApi/GetTraditionalHerbaceousDrugRegisteredIRC',
    'essentials': '/IRCApi/GetEssentialsRegisteredIRC',
    'cosmetic_license': '/IRCApi/GetCosmeticLicenseItemIRC',
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

# https://irc.fda.gov.ir/api/IRCApi/GetDrugEquipmentLicenseItemIRC?licenseOwnerCompanyName=

def get_all_companies(dir_path: str, max_count: Optional[int], mean_time_between=10):
    _, count = get_company_page(1, 10)
    if max_count:
        count = min(count, max_count)
    print(count)
    page_size = 1000
    max_pages = (count // 1000) + 1
    results = []
    with open(f'{dir_path}/companies_progress.out', 'w') as f:
        f.seek(0)
        f.truncate(0)
        f.write(str('1%'))
        f.flush()
        for i in range(1, max_pages + 1):
            print(i)
            progress: str = f'{(i / max_pages) * 100}%'
            sleep(mean_time_between * 2 * random.random())
            results = [*results, *(get_company_page(i, page_size)[0])]
            print(progress)
            f.seek(0)
            f.truncate(0)
            f.write(str(progress))
            f.flush()
        f.seek(0)
        f.truncate(0)
        f.write(str('100%'))
        f.flush()

    # write_ads_to_csv(f'{dir_path}/companies.csv', results)
    write_ads_to_excel(f'{dir_path}/companies.xlsx', results)

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

def get_specific_product_page(product: str, page_number: int, page_size: int):
    api_endpoint = products_api_endpoints[product]
    product_url = f'{base_api_url}{api_endpoint}'
    # url_with_params = f'{product_url}?pageNumber={page_number}&pageSize={page_size}&term='
    url_with_params = f'{product_url}?licenseOwnerCompanyId=&pageNumber={page_number}&pageSize={page_size}&term='
    if product == 'drug_equipment':
        url_with_params = f'{product_url}?licenseOwnerCompanyName=&pageNumber={page_number}&pageSize={page_size}&term='
        # https://irc.fda.gov.ir/api/IRCApi/GetDrugEquipmentLicenseItemIRC?licenseOwnerCompanyName=
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

def get_all_specific_product(product: str, dir_path: str, max_count: Optional[int], mean_time_between=10):
    api_endpoint = products_api_endpoints[product]
    _, count = get_specific_product_page(product, 1, 10)
    if max_count:
        count = min(count, max_count)
    print(count)
    page_size = 1000
    max_pages = (count // 1000) + 1
    results = []
    with open(f'{dir_path}/{product}_progress.out', 'w') as f:
        f.seek(0)
        f.truncate(0)
        f.write(str('1%'))
        f.flush()
        for i in range(1, max_pages + 1):
            print(i)
            progress: str = f'{(i / max_pages) * 100}%'
            f.write(str(progress))
            sleep(mean_time_between * 2 * random.random())
            results = [*results, *(get_specific_product_page(product, i, page_size)[0])]
            print(progress)
            f.seek(0)
            f.truncate(0)
            f.write(str(progress))
            f.flush()
        f.seek(0)
        f.truncate(0)
        f.write(str('100%'))
        f.flush()

    # write_ads_to_csv(f'{dir_path}/{product}.csv', results)
    write_ads_to_excel(f'{dir_path}/{product}.xlsx', results)


if __name__ == '__main__':
    resource = sys.argv[1]
    count = None
    try:
        count = int(sys.argv[2])
    except:
        pass
    if resource == 'companies':
        get_all_companies('../appData', count)
    elif resource in products_api_endpoints.keys():
        get_all_specific_product(f'{resource}', '../appData', count)
    else:
        print("Invalid arguments")
        exit(1)
