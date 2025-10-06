import pytest
from analyze import Car


def test_get_car_info(mock_model, feature_names, pics_df, sells_df):
    car = Car(
        make="BMW", model="X5", year=2022, hp=300,
        body="SUV", yearsell=2023, odometer=20000, color="Black",
        load_model=mock_model,
        feats=feature_names,
        pics=pics_df,
        sells=sells_df
    )
    assert car.get_car_info() == 42000


def test_get_car_info_multi(mock_model, feature_names, pics_df, sells_df):
    test_cases = [
        ("BMW", "X5", 2022, 5000, "SUV", 2023, 20000, "Black"),   # много HP
        ("BMW", "X7", 2021, 0, "SUV", 2021, 20000, "Black"),       # 0 HP
        ("BMW", "X5", 2022, 300, "SUV", 2023, 10**9, "Black"),     # огромный пробег
        ("BMW", "X5", 2022, 300, "SUV", 2023, 0, "Black"),         # нулевой пробег
    ]
    for params in test_cases:
        car = Car(*params, load_model=mock_model,
                  feats=feature_names, pics=pics_df, sells=sells_df)
        assert car.get_car_info() == 42000