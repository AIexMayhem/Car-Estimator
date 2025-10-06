from analyze import Car
import pandas as pd

def test_get_photos_found(feature_names, mock_model, pics_df, sells_df):
    car = Car("Audi", "A3", 2018, 300, "SUV", 2023, 0, "Black",
              load_model=mock_model, feats=feature_names,
              pics=pics_df, sells=sells_df)
    photos = car.get_photos()
    assert photos == ['photo1.jpg', 'photo2.jpg', 'photo1.jpg']


def test_get_photos_not_found(feature_names, mock_model, pics_df, sells_df):
    car = Car("Unknown", "Car", 2000, 100, "Sedan", 2023, 0, "Blue",
              load_model=mock_model, feats=feature_names,
              pics=pics_df, sells=sells_df)
    assert car.get_photos() == []


def test_get_photos_padded_to_three(feature_names, mock_model, sells_df):
    single_photo_df = pd.DataFrame({
        'Car': ['Test/Car/2020'],
        'Pics': ['only_one.jpg']
    })
    car = Car("Test", "Car", 2020, 100, "Sedan", 2023, 0, "Red",
              load_model=mock_model, feats=feature_names,
              pics=single_photo_df, sells=sells_df)
    photos = car.get_photos()
    assert photos == ['only_one.jpg', 'only_one.jpg', 'only_one.jpg']