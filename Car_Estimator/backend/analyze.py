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

load_model = joblib.load(open("linear_model.sav", 'rb'))
cars_dummies = pd.read_csv("car_dummies.csv")
pics = pd.read_csv("pictures.csv")
sells = pd.read_csv("sells.csv")


def graph_build(car_model: str, year: int, hp: int, body: str, yearsell: int, odometer: int, color: str):
    xlabel = []
    ylabel = []
    period = 8
    yearsell -= 4
    for year_num in range(period):
        yearsell += 1
        y_pred = get_car_info(car_model, year, hp, body, yearsell, odometer, color)
        if y_pred > 0:
            xlabel.append(y_pred)
        else:
            xlabel.append(0)
        ylabel.append(yearsell)
        if year_num:
            xlabel[year_num] = xlabel[year_num] * (1 - (18700 * year_num) ** (-0.17))

    xnew = np.linspace(min(ylabel), max(ylabel), 300)
    spl = make_interp_spline(ylabel, xlabel, k=3)  # type: BSpline
    power_smooth = spl(xnew)
    plt.clf()
    plt.box(False)
    plt.plot(xnew, power_smooth, color="#4D869D")
    ymin, ymax = int(min(power_smooth)), int(max(power_smooth))

    for i in range(ymin, ymax, (ymax - ymax) // 4):
        plt.axhline(y=i, alpha=0.1, color="black")
    plt.savefig('graph.png')


def get_car_info(car_model: str, year: int, hp: int, body: str, yearsell: int, odometer: int, color: str):
    make, model = car_model.split(" | ")
    dummy = {"Year": year, "HP": hp, "Odometer": odometer, "Yearsell": yearsell}
    for col in list(cars_dummies.columns)[5:]:
        dummy[col] = False

    dummy["Make_" + make] = True
    dummy["Model_" + model] = True
    dummy["Body_" + body] = True
    dummy["Color_" + color] = True

    dummy = pd.DataFrame(dummy, index=[0])
    y_pred = load_model.predict(dummy)
    price = int(np.round(y_pred[0], 0))
    if price < 0:
        price = 200 + random.randint(-100, 100)
    return price


def get_photos(car_model: str, year: int):
    make, model = car_model.split(" | ")
    make = make.replace(" ", "_")
    model = model.replace(" ", "_")
    model = model.replace(" Series", "-Series")

    model = model.replace("Town_&_Country", "town_country")
    model = model.replace("Gran_Turismo", "GranTurismo")
    model = model.replace("MX-5_Miata", "MX-5")
    link = make + '/' + model + '/' + str(year)
    pictures = []
    for car_num in range(len(pics)):
        if pics.Car[car_num] == link:
            pictures = pics.Pics[car_num].split()
            print(pictures)
    return pictures


def get_sells(car_model: str):
    sell = 0
    for car_num in range(len(sells)):
        if sells.Car[car_num] == car_model:
            sell = int(sells.Count[car_num])
    return sell


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
            "Price": car_info,
            "Photos": get_photos(*message[:1]),
            "Sell": get_sells(message[0])
        }
        graph_build(*message)
        return flask.Response(response=json.dumps(return_data), status=201)


if __name__ == "__main__":
    app.run("localhost", 6969)
