import math

from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
cert_path = './X509-cert-8134910958836251458.pem'
mongo_connection_string = 'mongodb+srv://shorttermlettingradar.dvmzgjp.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=ShortTermLettingRadar'
client = MongoClient(mongo_connection_string, tls=True, tlsCertificateKeyFile=cert_path)
db = client.ShortTermLettingRadar
listings = db.listings


@app.route('/getLocations', methods=['GET'])
def get_locations():
    fetched_data = listings.find({}, {'_id': 0, 'latitude': 1, 'longitude': 1, 'room_type': 1, 'id': 1, 'name': 1, 'host_name': 1, 'price': 1})

    # Filter out listings with NaN price
    data = []
    for listing in fetched_data:
        price = listing.get('price')
        host_name = listing.get('host_name')
        if (price is not None and not (isinstance(price, float) and math.isnan(price))) and (host_name is not None and not (isinstance(host_name, float) and math.isnan(host_name))):
            data.append(listing)
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
