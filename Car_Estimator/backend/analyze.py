from flask import Flask, request
import flask
import json
from flask_cors import CORS
import joblib
import pandas as pd
import scipy
import random
import numpy as np
from scipy.interpolate import make_interp_spline, BSpline
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app)
plt.switch_backend('agg')
filename = 'linear_model.sav'
load_model = joblib.load(open(filename, 'rb'))
cars_dummies = pd.read_csv("car_dummies.csv")
pics = pd.read_csv("pictures.csv")
sells = pd.read_csv("sells.csv")


def graph_build(car_model: str, Year: int, HP: int, Body: str, Yearsell: int, Odometer: int, Color: str):
    X = []
    Y = []
    period = 8
    Yearsell -= 4
    for year in range(period):
        Yearsell += 1
        y_pred = get_car_info(car_model, Year, HP, Body, Yearsell, Odometer, Color)[0]
        if y_pred > 0:
            X.append(y_pred)
        else:
            X.append(0)
        Y.append(Yearsell)
        if year:
            X[year] = X[year] * (1 - (18700 * year) ** (-0.17))

    xnew = np.linspace(min(Y), max(Y), 300)
    spl = make_interp_spline(Y, X, k=3)  # type: BSpline
    power_smooth = spl(xnew)
    plt.clf()
    plt.box(False)
    plt.plot(xnew, power_smooth, color="#4D869D")
    ymin, ymax = plt.gca().get_ylim()
    print(ymin, ymax)
    for i in range(int(min(power_smooth)), int(max(power_smooth)),
                   (int(max(power_smooth)) - int(min(power_smooth))) // 4):
        plt.axhline(y=i, alpha=0.1, color="black")
    plt.savefig('graph.png')


def get_car_info(car_model: str, Year: int, HP: int, Body: str, Yearsell: int, Odometer: int, Color: str):
    Make, Model = car_model.split(" | ")
    dummy = {"Year": Year, "HP": HP, "Odometer": Odometer, "Yearsell": Yearsell}
    for col in list(cars_dummies.columns)[5:]:
        dummy[col] = False

    dummy["Make_" + Make] = True
    dummy["Model_" + Model] = True
    dummy["Body_" + Body] = True
    dummy["Color_" + Color] = True

    dummy = pd.DataFrame(dummy, index=[0])
    y_pred = load_model.predict(dummy)

    Make = Make.replace(" ", "_")
    Model = Model.replace(" Series", "-Series")
    Model = Model.replace(" ", "_")
    Model = Model.replace("Town_&_Country", "town_country")
    Model = Model.replace("Gran_Turismo", "GranTurismo")
    Model = Model.replace("MX-5_Miata", "MX-5")
    link = Make + '/' + Model + '/' + str(Year)
    pictures = []
    sell = 0
    for car in range(len(sells)):
        if car < len(pics) and pics.Car[car] == link:
            pictures = pics.Pics[car].split()
            print(pictures)
        if sells.Car[car] == car_model:
            sell = int(sells.Count[car])
    price = int(np.round(y_pred[0], 0))
    if price < 0:
        price = 200 + random.randint(-100, 100)
    return [price, pictures, sell]


@app.route('/car', methods=["GET", "POST"])
def car():
    print("users endpoint reached...")
    if request.method == "GET":
        pass
    if request.method == "POST":
        received_data = request.get_json()
        print(f"received data: {received_data}")

        message = received_data['data']
        car_info = get_car_info(*message)
        return_data = {
            "status": "success",
            "Price": car_info[0],
            "Photos": car_info[1],
            "Sell": car_info[2]
        }
        graph_build(*message)
        return flask.Response(response=json.dumps(return_data), status=201)


if __name__ == "__main__":
    app.run("localhost", 6969)
