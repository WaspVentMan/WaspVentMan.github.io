from flask import Flask, render_template, request
import hashlib, json, os

# Data structure for user data
ustruc = {
    "username": "", # encrypted
    "password": "", # encrypted
    "points": 0,
    "booking": [ # can store multiple bookings
        {
            "count": [1, 0], # [adult, child]
            "date": [9, 8, 2024], # [day, month, year]
            "hotel": False,
            "paid": False
        }
    ]
}

# Encrypts text with SHA-512 encryption
def encrypt(text): return hashlib.sha512(text.encode('utf-8')).hexdigest()

# Creates an account using a provided username and password
# Doesn't create an account if it already exists
def accountAssembler(username, password):
    path = "data/{}.json".format(encrypt(username))
    if not os.path.isfile(path):
        data = {}
        data["username"] = encrypt(username)
        data["password"] = encrypt(password)
        data["points"] = 0
        data["booking"] = []

        f = open(path, "w")
        json.dump(data, f, indent=4)
        f.close()
        return "true"

    else:
        return "[false, \"Account Exists\"]"

# Logs into accounts using a provided username and password
def accountChecker(username, password):
    path = "data/{}.json".format(encrypt(username))
    if os.path.isfile(path):
        f = open(path, "r")
        data = json.loads(f.read())
        f.close()

        if data["password"] == encrypt(password):
            f = open(path, "w")
            json.dump(data, f, indent=4)
            f.close()

            return json.dumps(data)
        else:
            return "[false, \"Incorrect Password\"]"
    
    else:
        return "[false, \"Account Doesn't Exist\"]"

# Removes accounts using a provided username and password
def accountRemover(username, password):
    path = "data/{}.json".format(encrypt(username))
    if os.path.isfile(path):
        f = open(path, "r")
        data = f.read()
        f.close()

        if json.loads(data)["password"] == encrypt(password):
            os.remove(path)
            return "[true, \"Success\"]"
        
    return "[false, \"Account Doesn't Exist\"]"

# Adds purchases to account (also makes sure they are logged in)
def purchaseMaster(username, password, purchase):
    if purchase["count"][0] > 100 or purchase["count"][1] > 100:
        return "[false, \"Too many tickets\"]"
    
    if purchase["date"][0] == None or purchase["date"][1] == None or purchase["date"][2] == None:
        return "[false, \"No date\"]"
    
    if username == None:
        return "[false, \"Invalid username/password\"]"

    path = "data/{}.json".format(encrypt(username))
    if accountChecker(username, password)[0] != "true":
        f = open(path, "r")
        data = json.load(f)
        f.close()

        if purchase in data["booking"]:
            return "[false, \"This has already been booked!\"]"

        data["booking"].append(purchase)
        data["points"] += (purchase["count"][0]*59) + (purchase["count"][1]*29)

        f = open(path, "w")
        json.dump(data, f, indent=4)
        f.close()

        return "[true, \"Success\"]"
    
    return "[false, \"Invalid username/password\"]"

app = Flask(__name__)

# Home page
@app.route("/")
def home():
    return render_template("index.html")

# Ticket page
@app.route("/tickets/")
def tickets():
    return render_template("ticket.html")

# Signup endpoint
@app.route("/signup", methods=["POST"])
def signup():
    data = json.loads(request.data)
    return accountAssembler(data["username"], data["password"])

# Login endpoint
@app.route("/login", methods=["POST"])
def login():
    data = json.loads(request.data)
    return accountChecker(data["username"], data["password"])

# Account deletion endpoint
@app.route("/seeya", methods=["POST"])
def seeya():
    data = json.loads(request.data)
    return accountRemover(data["username"], data["password"])

# Ticket purchase endpoint
@app.route("/purchase", methods=["POST"])
def purchase():
    data = json.loads(request.data)
    return purchaseMaster(data[0]["username"], data[0]["password"], data[1])

# 404 handler
@app.errorhandler(404)
def error404(e):
    return render_template("404.html", content=e)

if __name__ == "__main__":
    app.run()