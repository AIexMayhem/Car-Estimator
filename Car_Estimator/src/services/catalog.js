const LIST_PATHS = {
  makes: '/files/Make.txt',
  models: '/files/Model.txt',
  colors: '/files/Color.txt',
  bodies: '/files/Body.txt',
  makeModels: '/files/Make_Model.txt',
};

const readLines = async (path) => {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Cannot load ${path}`);
  }

  const text = await response.text();

  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
};

const parseMakeModelMap = (rows) => {
  const modelSetsByMake = new Map();

  rows.forEach((row) => {
    const [make, model] = row.split(' | ').map((item) => item?.trim());

    if (!make || !model) {
      return;
    }

    if (!modelSetsByMake.has(make)) {
      modelSetsByMake.set(make, new Set());
    }

    modelSetsByMake.get(make).add(model);
  });

  return Object.fromEntries(
    [...modelSetsByMake.entries()].map(([make, models]) => [make, [...models].sort()]),
  );
};

export const loadCatalog = async () => {
  const [makes, models, colors, bodies, makeModelRows] = await Promise.all([
    readLines(LIST_PATHS.makes),
    readLines(LIST_PATHS.models),
    readLines(LIST_PATHS.colors),
    readLines(LIST_PATHS.bodies),
    readLines(LIST_PATHS.makeModels),
  ]);

  return {
    makes,
    models,
    colors,
    bodies,
    modelsByMake: parseMakeModelMap(makeModelRows),
  };
};
