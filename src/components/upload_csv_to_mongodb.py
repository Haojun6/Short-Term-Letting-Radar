import csv
import json

from pymongo import MongoClient
import pandas as pd
from pymongo.errors import BulkWriteError

file_path = './neighbourhoods.geojson'
cert_path = './X509-cert-8134910958836251458.pem'
mongo_connection_string = 'mongodb+srv://shorttermlettingradar.dvmzgjp.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=ShortTermLettingRadar'
database_name = 'ShortTermLettingRadar'
collection_name = 'geo'

client = MongoClient(mongo_connection_string, tls=True, tlsCertificateKeyFile=cert_path)
db = client[database_name]
collection = db[collection_name]

if file_path[-3:] == 'csv':
    df = pd.read_csv(file_path)
    data = df.to_dict(orient='records')

    try:
        collection.insert_many(data)
        print(f"Data successfully inserted into {database_name}.{collection_name}.")
    except BulkWriteError as bwe:
        print("Bulk write error occurred:", bwe.details)
    except Exception as e:
        print("An error occurred:", e)

elif file_path[-7:] == 'geojson':
    with open(file_path, 'r') as file:
        geojson_data = json.load(file)
    print('data:  ' , geojson_data)
    if geojson_data['type'] == 'FeatureCollection':
        features = geojson_data['features']
        print('features:  ',features)

        for i in features:
            print(i,'\n')

        #collection.insert_many(features)
    """else:  # If the GeoJSON is a single feature
        collection.insert_one(geojson_data)"""

    print("GeoJSON data uploaded successfully.")


