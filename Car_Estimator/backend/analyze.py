from flask import Flask, request
import flask
import json
from flask_cors import CORS
import joblib
import pandas as pd
import scipy
import numpy as np

app = Flask(__name__)
CORS(app)

filename = 'linear_model.sav'
load_model = joblib.load(open(filename, 'rb'))
cars_dummies = pd.read_csv("car_dummies.csv")

def get_car_info(car_model: str, Year: int, HP: int, Body: str, Yearsell: int, Odometer: int, Color: str):
    Make, Model = car_model.split(" | ")
    dummy = {"Year": Year, "HP": HP, "Odometer": Odometer, "Yearsell": Yearsell}
    for i in list(cars_dummies.columns)[5:]:
      dummy[i] = False

    dummy["Make_" + Make] = True
    dummy["Model_" + Model] = True
    dummy["Body_" + Body] = True
    dummy["Color_" + Color] = True

    dummy = pd.DataFrame(dummy, index=[0])
    y_pred = load_model.predict(dummy)
    return (int(np.round(y_pred[0],0)))

@app.route('/car', methods=["GET", "POST"])


def car():
    print("users endpoint reached...")
    
    if request.method == "POST":
        received_data = request.get_json()
        print(f"received data: {received_data}")
        message = received_data['data']
        return_data = get_car_info(*message)
        return flask.Response(response=json.dumps(return_data), status=201)



if __name__ == "__main__":
    app.run("localhost", 6969)
    
        
