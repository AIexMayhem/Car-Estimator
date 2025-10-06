import os
import joblib
import pandas as pd
import numpy as np
import random
from scipy.interpolate import make_interp_spline
import matplotlib.pyplot as plt
from io import BytesIO


class Car:
    def __init__(self, make: str, model: str, year: int, hp: int,
                 body: str, yearsell: int, odometer: int, color: str, 
                 test=False, load_model=None, pics=None, sells=None, feats=None):
        self.make = make
        self.model = model
        self.year = year
        self.hp = hp 
        self.body = body
        self.yearsell = yearsell
        self.odometer = odometer
        self.color = color

        self.load_model = load_model
        self.feats = feats
        self.pics = pics
        self.sells = sells


    def get_photos(self) -> list[str]:
        key = f"{self.make.replace(' ', '_')}/{self.model.replace(' ', '_')}/{self.year}"
        for _, row in self.pics.iterrows():
            if row['Car'] == key:
                photos = row['Pics'].split()
                while 0 < len(photos) < 3:
                    photos.append(photos[0])
                return photos
        return []

    def get_sells(self) -> int:
        key = f"{self.make} | {self.model}"
        for _, row in self.sells.iterrows():
            if row['Car'] == key:
                return int(row['Count'])
        return 0
    
    def get_car_info(self) -> int:
        dummy = dict.fromkeys(self.feats, 0)

        for k, v in {
            'Year': self.year,
            'HP': self.hp,
            'Odometer': self.odometer,
            'Yearsell': self.yearsell
        }.items():
            if k in dummy:
                dummy[k] = v

        for prefix, val in (
            ('Make_', self.make.replace(' ', '_')),
            ('Model_', self.model.replace(' ', '_')),
            ('Body_', self.body),
            ('Color_', self.color)
        ):
            col = f"{prefix}{val}"
            if col in dummy:
                dummy[col] = 1

        df = pd.DataFrame([dummy], columns=self.feats)
        y_pred = self.load_model.predict(df)[0]
        price = round(y_pred, 0)

        return price

    def get_graph_data(self, period=8) -> dict:
        xs, ys = [], []
        base_year = self.yearsell - period // 2

        for i in range(period):
            y = base_year + i + 1
            price = self.get_car_info()
            xs.append(y)
            ys.append(price if price > 0 else 0)

        xnew = np.linspace(min(xs), max(xs), 300)
        
        return { 'x_axis': xs, 'y_axis': ys, 'x_new_axis': xnew }

    def graph_build(self) -> bytes:
        data = self.get_graph_data()
        xs, ys, xnew = data['x_axis'], data['y_axis'], data['x_new_axis']
        spl = make_interp_spline(xs, ys, k=3)
        smooth = spl(xnew)
        plt.clf()
        plt.plot(xnew, smooth)
        plt.box(False)

        buf = BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        return buf.read()



