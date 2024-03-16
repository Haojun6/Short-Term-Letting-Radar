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
        id = listing.get('id')
        listing['id'] = str(id)
        price = listing.get('price')
        host_name = listing.get('host_name')
        if (price is not None and not (isinstance(price, float) and math.isnan(price))) and (host_name is not None and not (isinstance(host_name, float) and math.isnan(host_name))):
            data.append(listing)
    return jsonify(data)


@app.route('/statistics', methods=['GET'])
def statistics():
    fetched_data = listings.find({}, {'_id': 0, 'room_type': 1, 'name': 1, 'host_name': 1, 'price': 1})
    data = []
    for listing in fetched_data:
        price = listing.get('price')
        host_name = listing.get('host_name')
        if (price is not None and not (isinstance(price, float) and math.isnan(price))) and (
                host_name is not None and not (isinstance(host_name, float) and math.isnan(host_name))):
            data.append(listing)

    total_listings = len(data)
    entire_home = 0
    totalPrice = 0
    for i in data:
        if i['room_type'] == 'Entire home/apt':
            entire_home += 1
        totalPrice += float(i['price'][1:].replace(',', ''))
    percentage_entire_home = round(entire_home / total_listings * 100, 2) if total_listings else 0
    avg_price = int(totalPrice / total_listings)
    stats = {
        'total_listings': total_listings,
        'average_price': avg_price,
        'percentage_entire_home': percentage_entire_home
    }
    return jsonify(stats)

@app.route('/getListingDetails/<listing_id>', methods=['GET'])
def get_listing_details(listing_id):
    listing = listings.find_one({"id": int(listing_id)}, {'_id': 0, 'latitude': 1, 'longitude': 1, 'room_type': 1, 'id': 1, 'name': 1, 'host_name': 1, 'price': 1, 'picture_url': 1})
    if listing:
        return jsonify(listing)
    else:
        return jsonify({"error": "Listing not found"}), 404



if __name__ == '__main__':
    app.run(debug=True)
