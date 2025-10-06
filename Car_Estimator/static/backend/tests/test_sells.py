from analyze import Car


def test_get_sells_found(feature_names, mock_model, pics_df, sells_df):
    car = Car("BMW", "X5", 2022, 300, "SUV", 2023, 0, "Black",
              load_model=mock_model, feats=feature_names,
              pics=pics_df, sells=sells_df)
    assert car.get_sells() == 150


def test_get_sells_not_found(feature_names, mock_model, pics_df, sells_df):
    car = Car("Make", "Model", 2025, 500, "Coupe", 2025, 0, "Gold",
              load_model=mock_model, feats=feature_names,
              pics=pics_df, sells=sells_df)
    assert car.get_sells() == 0