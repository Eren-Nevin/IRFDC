import csv 
def write_ads_to_csv(output_path, my_dict_list):
    with open(output_path, 'w') as file:
        writer = csv.DictWriter(file, my_dict_list[0].keys())
        writer.writeheader()
        writer.writerows(my_dict_list)

