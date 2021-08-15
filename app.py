from flask import Flask, render_template, jsonify, redirect, request
from flask_cors import CORS
from pymongo import MongoClient
import os
import datetime

app = Flask(__name__)
app.config['MONGO_CONNECT'] = False
CORS(app)
client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))
db = client.pwitter


@app.route("/", methods=["GET"])
def home():
    return render_template('index.html')


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form['name']
        email = request.form['email']
        pwd = request.form['pwd']
        user = {
            "id": str(datetime.datetime.now().timestamp()),
            "name": name,
            "email": email
        }
        db.users.insert_one({
            "id": str(datetime.datetime.now().timestamp()),
            "name": name,
            "email": email,
            "pwd": pwd
        })
        return(jsonify(data={"status": 200, "msg": "User Created", "user": user}))
    if request.method == "GET":
        return render_template('register.html')


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        name = request.form['name']
        pwd = request.form['pwd']
        user = db.users.find_one({"name": name, "pwd": pwd})
        loggedUser = {"id": user["id"],
                      "name": user["name"], "email": user["email"]}
        return(jsonify(data={"status": 200, "msg": "User Found", "user": loggedUser}))
    if request.method == "GET":
        return render_template('login.html')


@app.route("/profile/<userid>", methods=["GET"])
def userprofile(userid):
    return render_template("userprofile.html")


@app.route("/api/profile/<userid>", methods=["GET"])
def getuserdata(userid):
    user = db.users.find_one({"id": userid})
    return (jsonify(data={"status": 200, "msg": "User Found", "user": {"name": user["name"], "id": user["id"]}}))


@app.route("/api/pweets/<userid>", methods=["GET", "POST"])
def getpweets(userid):
    if request.method == "GET":
        pweets = []
        for item in list(db.pweets.find({"owner": userid})):
            pweets.append({
                "id": item["id"],
                "text": item["text"],
                "owner": item["owner"],
                "owner_name": item["owner_name"]
            })
        return jsonify(data={"status": 200, "msg": "Pweets found", "pweets": pweets})
    if request.method == "POST":
        text = request.form["text"]
        user = db.users.find_one({"id": userid})
        db.pweets.insert_one(
            {"id": str(datetime.datetime.now().timestamp()), "owner": userid, "owner_name": user["name"], "text": text})
        return jsonify(data={"status": 200, "msg": "You Pweeted"})


if __name__ == '__main__':
    app.run(debug=True)
