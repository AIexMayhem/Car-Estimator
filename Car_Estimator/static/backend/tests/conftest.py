import pytest
import pandas as pd
from unittest.mock import MagicMock


@pytest.fixture
def mock_model():
    model = MagicMock()
    model.predict.return_value = [42000.0]
    return model


@pytest.fixture
def feature_names():
    return [
        'Year', 'HP', 'Odometer', 'Yearsell',
        'Make_BMW', 'Make_Audi', 'Make_Make',
        'Model_X5', 'Model_A3', 'Model_Model', 'Model_X7',
        'Body_SUV', 'Body_Sedan', 'Body_Coupe',
        'Color_Black', 'Color_Blue', 'Color_Gold', 'Color_Rust'
    ]


@pytest.fixture
def pics_df():
    return pd.DataFrame({
        'Car': ['Audi/A3/2018', 'BMW/X5/2022'],
        'Pics': ['photo1.jpg photo2.jpg', 'bmw1.jpg bmw2.jpg bmw3.jpg']
    })


@pytest.fixture
def sells_df():
    return pd.DataFrame({
        'Car': ['BMW | X5', 'Audi | A3'],
        'Count': [150, 95]
    })