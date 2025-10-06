from analyze import Car


def test_get_graph_data_structure(mock_model, feature_names, pics_df, sells_df):
    car = Car(
        make="Audi", model="A3", year=2018, hp=300,
        body="SUV", yearsell=2023, odometer=0, color="Black",
        load_model=mock_model,
        feats=feature_names,
        pics=pics_df,
        sells=sells_df
    )
    period = 6
    data = car.get_graph_data(period=period)
    
    assert 'x_axis' in data
    assert 'y_axis' in data
    assert 'x_new_axis' in data
    
    assert len(data['x_axis']) == period
    assert len(data['y_axis']) == period
    assert len(data['x_new_axis']) == 300

    assert all(isinstance(x, int) for x in data['x_axis'])
    assert all(y == 42000 for y in data['y_axis']) 

    expected_years = list(range(2021, 2027))
    assert data['x_axis'] == expected_years

    assert data['x_new_axis'][0] == 2021
    assert data['x_new_axis'][-1] == 2026

