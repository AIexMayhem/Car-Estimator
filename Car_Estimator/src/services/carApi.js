const DEFAULT_API_BASE_URL = 'http://localhost:6969';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

const toInteger = (value) => Number.parseInt(value, 10);

export const toApiPayload = (car) => [
  car.make,
  car.model,
  toInteger(car.year),
  toInteger(car.hp),
  car.body,
  toInteger(car.yearsell),
  toInteger(car.odometer),
  car.color,
];

export const requestEstimate = async (car, signal) => {
  const response = await fetch(`${API_BASE_URL}/car`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({ data: toApiPayload(car) }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Backend responded with ${response.status}`);
  }

  const data = await response.json();

  return {
    price: data.Price ?? data.price ?? null,
    photos: Array.isArray(data.Photos) ? data.Photos.filter(Boolean) : [],
    sells: data.Sell ?? data.sell ?? 0,
    graphUrl: `/backend/graph.png?updated=${Date.now()}`,
  };
};
