import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  CarFront,
  ChartNoAxesColumnIncreasing,
  Gauge,
  Palette,
  Search,
  Send,
} from 'lucide-react';
import { loadCatalog } from '../services/catalog.js';
import { readCarRequest, saveCarRequest } from '../storage.js';
import { NumberField, SelectField, TextField } from './Field.jsx';

const CURRENT_YEAR = new Date().getFullYear();

const EMPTY_FORM = {
  make: '',
  model: '',
  year: '',
  color: '',
  hp: '',
  body: '',
  odometer: '',
  yearsell: '',
};

const COLOR_SWATCHES = {
  White: '#f8fafc',
  Grey: '#8b949e',
  Black: '#111827',
  Red: '#c0392b',
  Silver: '#c8ced6',
  Blue: '#2563eb',
  Green: '#2e7d32',
  Beige: '#d6c3a3',
  Gold: '#c9a227',
  Orange: '#e26d2f',
  Burgundy: '#7f1d1d',
  Yellow: '#facc15',
  Brown: '#795548',
  Purple: '#7e57c2',
  Teal: '#167d7f',
  Pink: '#e879a6',
};

const REQUIRED_FIELD_LABELS = {
  make: 'марка',
  model: 'модель',
  year: 'год выпуска',
  color: 'цвет',
  hp: 'мощность',
  body: 'тип кузова',
  odometer: 'пробег',
  yearsell: 'год оценки',
};

const validateInteger = ({ value, min, max, label }) => {
  const normalizedValue = String(value).trim();
  const parsedValue = Number(normalizedValue);

  if (!Number.isInteger(parsedValue)) {
    return `${label}: нужно целое число.`;
  }

  if (parsedValue < min || parsedValue > max) {
    return `${label}: допустимо от ${min} до ${max}.`;
  }

  return '';
};

function ColorPicker({ colors, value, onChange, error }) {
  return (
    <div className="field field--full">
      <span className="field__label">
        <Palette aria-hidden="true" size={18} />
        Цвет
      </span>
      <div className="color-grid" role="radiogroup" aria-label="Цвет автомобиля">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            className={`color-option${value === color ? ' color-option--active' : ''}`}
            onClick={() => onChange(color)}
            aria-pressed={value === color}
          >
            <span
              className="color-option__swatch"
              style={{ backgroundColor: COLOR_SWATCHES[color] || '#d1d5db' }}
              aria-hidden="true"
            />
            <span>{color}</span>
          </button>
        ))}
      </div>
      {error ? <span className="field__error">{error}</span> : null}
    </div>
  );
}

export default function EstimatorPage({ onNavigate }) {
  const [catalog, setCatalog] = useState({
    makes: [],
    models: [],
    colors: [],
    bodies: [],
    modelsByMake: {},
  });
  const [form, setForm] = useState(() => readCarRequest() || EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [catalogStatus, setCatalogStatus] = useState('loading');

  useEffect(() => {
    let isMounted = true;

    loadCatalog()
      .then((loadedCatalog) => {
        if (!isMounted) {
          return;
        }

        setCatalog(loadedCatalog);
        setCatalogStatus('ready');
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setCatalogStatus('failed');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const availableModels = useMemo(() => {
    if (form.make && catalog.modelsByMake[form.make]?.length) {
      return catalog.modelsByMake[form.make];
    }

    return catalog.models;
  }, [catalog.models, catalog.modelsByMake, form.make]);

  const updateField = (fieldName, value) => {
    setForm((currentForm) => {
      if (fieldName === 'make') {
        const makeModels = catalog.modelsByMake[value] || [];
        const shouldKeepModel = !currentForm.model || makeModels.includes(currentForm.model);

        return {
          ...currentForm,
          make: value,
          model: shouldKeepModel ? currentForm.model : '',
        };
      }

      return {
        ...currentForm,
        [fieldName]: value,
      };
    });

    setErrors((currentErrors) => ({
      ...currentErrors,
      [fieldName]: '',
      form: '',
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    Object.entries(REQUIRED_FIELD_LABELS).forEach(([fieldName, label]) => {
      if (!String(form[fieldName]).trim()) {
        nextErrors[fieldName] = `Заполните поле: ${label}.`;
      }
    });

    if (form.make && catalog.makes.length > 0 && !catalog.makes.includes(form.make)) {
      nextErrors.make = 'Выберите марку из справочника.';
    }

    if (form.model && availableModels.length > 0 && !availableModels.includes(form.model)) {
      nextErrors.model = 'Выберите модель из справочника.';
    }

    if (form.body && catalog.bodies.length > 0 && !catalog.bodies.includes(form.body)) {
      nextErrors.body = 'Выберите тип кузова из справочника.';
    }

    const yearError = form.year
      ? validateInteger({
          value: form.year,
          min: 1950,
          max: CURRENT_YEAR + 1,
          label: 'Год выпуска',
        })
      : '';
    const hpError = form.hp
      ? validateInteger({
          value: form.hp,
          min: 1,
          max: 3000,
          label: 'Мощность',
        })
      : '';
    const odometerError = form.odometer
      ? validateInteger({
          value: form.odometer,
          min: 0,
          max: 2000000,
          label: 'Пробег',
        })
      : '';
    const yearsellError = form.yearsell
      ? validateInteger({
          value: form.yearsell,
          min: 1950,
          max: CURRENT_YEAR + 10,
          label: 'Год оценки',
        })
      : '';

    if (yearError) {
      nextErrors.year = yearError;
    }
    if (hpError) {
      nextErrors.hp = hpError;
    }
    if (odometerError) {
      nextErrors.odometer = odometerError;
    }
    if (yearsellError) {
      nextErrors.yearsell = yearsellError;
    }

    if (
      !nextErrors.year &&
      !nextErrors.yearsell &&
      form.year &&
      form.yearsell &&
      Number(form.yearsell) < Number(form.year)
    ) {
      nextErrors.yearsell = 'Год оценки не должен быть раньше года выпуска.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    saveCarRequest(form);
    onNavigate('dashboard');
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark">
            <CarFront aria-hidden="true" size={28} />
          </span>
          <div>
            <h1>Car Estimator</h1>
            <p>Оценка стоимости автомобиля</p>
          </div>
        </div>
        <div className={`status-pill status-pill--${catalogStatus}`}>
          {catalogStatus === 'loading' ? 'Справочники загружаются' : null}
          {catalogStatus === 'ready' ? 'Справочники готовы' : null}
          {catalogStatus === 'failed' ? 'Справочники недоступны' : null}
        </div>
      </header>

      <section className="estimator-layout">
        <form className="form-panel" onSubmit={handleSubmit} autoComplete="off">
          <div className="section-heading">
            <Search aria-hidden="true" size={22} />
            <h2>Параметры автомобиля</h2>
          </div>

          <div className="field-grid">
            <TextField
              id="make"
              label="Марка"
              icon={CarFront}
              value={form.make}
              onChange={(value) => updateField('make', value)}
              options={catalog.makes}
              placeholder="BMW"
              error={errors.make}
            />
            <TextField
              id="model"
              label="Модель"
              icon={CarFront}
              value={form.model}
              onChange={(value) => updateField('model', value)}
              options={availableModels}
              placeholder="X5"
              error={errors.model}
            />
            <NumberField
              id="year"
              label="Год выпуска"
              icon={CalendarDays}
              value={form.year}
              onChange={(value) => updateField('year', value)}
              placeholder="2020"
              min="1950"
              max={CURRENT_YEAR + 1}
              error={errors.year}
            />
            <NumberField
              id="hp"
              label="HP"
              icon={Gauge}
              value={form.hp}
              onChange={(value) => updateField('hp', value)}
              placeholder="300"
              min="1"
              max="3000"
              error={errors.hp}
            />
            <SelectField
              id="body"
              label="Кузов"
              icon={ChartNoAxesColumnIncreasing}
              value={form.body}
              onChange={(value) => updateField('body', value)}
              options={catalog.bodies}
              placeholder="Выберите кузов"
              error={errors.body}
            />
            <NumberField
              id="odometer"
              label="Пробег"
              icon={Gauge}
              value={form.odometer}
              onChange={(value) => updateField('odometer', value)}
              placeholder="50000"
              min="0"
              max="2000000"
              error={errors.odometer}
            />
            <NumberField
              id="yearsell"
              label="Год оценки"
              icon={CalendarDays}
              value={form.yearsell}
              onChange={(value) => updateField('yearsell', value)}
              placeholder={String(CURRENT_YEAR)}
              min="1950"
              max={CURRENT_YEAR + 10}
              error={errors.yearsell}
            />
            <ColorPicker
              colors={catalog.colors}
              value={form.color}
              onChange={(value) => updateField('color', value)}
              error={errors.color}
            />
          </div>

          {errors.form ? <p className="form-error">{errors.form}</p> : null}

          <div className="form-actions">
            <button className="button button--primary" type="submit">
              <Send aria-hidden="true" size={20} />
              Рассчитать
            </button>
          </div>
        </form>

        <aside className="vehicle-preview" aria-label="Выбранный автомобиль">
          <img src="/assets/images/cars_group.svg" alt="" />
          <dl className="selection-list">
            <div>
              <dt>Автомобиль</dt>
              <dd>{form.make && form.model ? `${form.make} ${form.model}` : 'Не выбран'}</dd>
            </div>
            <div>
              <dt>Год и пробег</dt>
              <dd>
                {form.year || 'Год'} / {form.odometer ? `${form.odometer} км` : 'Пробег'}
              </dd>
            </div>
            <div>
              <dt>Кузов и цвет</dt>
              <dd>
                {form.body || 'Кузов'} / {form.color || 'Цвет'}
              </dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  );
}
