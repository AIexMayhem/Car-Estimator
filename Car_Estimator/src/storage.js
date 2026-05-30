const STORAGE_KEY = 'car-estimator:request';
const LEGACY_KEYS = ['Make', 'Model', 'Year', 'Color', 'HP', 'Body', 'Odometer', 'Yearsell'];

const normalizeStoredCar = (car) => {
  if (!car || typeof car !== 'object') {
    return null;
  }

  return {
    make: String(car.make ?? car.Make ?? '').trim(),
    model: String(car.model ?? car.Model ?? '').trim(),
    year: String(car.year ?? car.Year ?? '').trim(),
    color: String(car.color ?? car.Color ?? '').trim(),
    hp: String(car.hp ?? car.HP ?? '').trim(),
    body: String(car.body ?? car.Body ?? '').trim(),
    odometer: String(car.odometer ?? car.Odometer ?? '').trim(),
    yearsell: String(car.yearsell ?? car.Yearsell ?? '').trim(),
  };
};

const isCompleteCarRequest = (car) => {
  return Boolean(
    car &&
      car.make &&
      car.model &&
      car.year &&
      car.color &&
      car.hp &&
      car.body &&
      car.odometer &&
      car.yearsell,
  );
};

const readLegacyRequest = () => {
  const legacyCar = normalizeStoredCar({
    Make: localStorage.getItem('Make'),
    Model: localStorage.getItem('Model'),
    Year: localStorage.getItem('Year'),
    Color: localStorage.getItem('Color'),
    HP: localStorage.getItem('HP'),
    Body: localStorage.getItem('Body'),
    Odometer: localStorage.getItem('Odometer'),
    Yearsell: localStorage.getItem('Yearsell'),
  });

  return isCompleteCarRequest(legacyCar) ? legacyCar : null;
};

export const saveCarRequest = (car) => {
  const normalizedCar = normalizeStoredCar(car);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedCar));
  localStorage.setItem('Make', normalizedCar.make);
  localStorage.setItem('Model', normalizedCar.model);
  localStorage.setItem('Year', normalizedCar.year);
  localStorage.setItem('Color', normalizedCar.color);
  localStorage.setItem('HP', normalizedCar.hp);
  localStorage.setItem('Body', normalizedCar.body);
  localStorage.setItem('Odometer', normalizedCar.odometer);
  localStorage.setItem('Yearsell', normalizedCar.yearsell);
};

export const readCarRequest = () => {
  try {
    const savedCar = normalizeStoredCar(JSON.parse(localStorage.getItem(STORAGE_KEY)));

    if (isCompleteCarRequest(savedCar)) {
      return savedCar;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  return readLegacyRequest();
};

export const clearCarRequest = () => {
  localStorage.removeItem(STORAGE_KEY);
  LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
};
