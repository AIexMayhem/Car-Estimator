import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, CircleDollarSign, RefreshCcw, ShoppingBag } from 'lucide-react';
import { requestEstimate } from '../services/carApi.js';
import { clearCarRequest, readCarRequest } from '../storage.js';

const FALLBACK_PHOTO = '/assets/images/Car.png';

const formatMoney = (value) => {
  if (value === null || value === undefined || value === '') {
    return '...';
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return String(value);
  }

  return `$${numericValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};

const formatCount = (value) => {
  if (value === null || value === undefined || value === '') {
    return '...';
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return `${value} шт.`;
  }

  return `${numericValue.toLocaleString('ru-RU')} шт.`;
};

const buildPhotoList = (photos) => {
  const sourcePhotos = photos?.length ? photos : [FALLBACK_PHOTO];

  if (sourcePhotos.length >= 3) {
    return sourcePhotos;
  }

  return Array.from({ length: 3 }, (_, index) => sourcePhotos[index % sourcePhotos.length]);
};

export default function DashboardPage({ onNavigate }) {
  const galleryRef = useRef(null);
  const [request, setRequest] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedRequest = readCarRequest();

    if (!savedRequest) {
      setStatus('empty');
      return undefined;
    }

    const controller = new AbortController();

    setRequest(savedRequest);
    setStatus('loading');
    setError('');

    requestEstimate(savedRequest, controller.signal)
      .then((data) => {
        setEstimate(data);
        setStatus('ready');
      })
      .catch((requestError) => {
        if (requestError.name === 'AbortError') {
          return;
        }

        setStatus('failed');
        setError('Python backend на localhost:6969 не вернул расчет.');
      });

    return () => controller.abort();
  }, []);

  const photos = useMemo(() => buildPhotoList(estimate?.photos), [estimate?.photos]);

  const scrollGallery = (direction) => {
    galleryRef.current?.scrollBy({
      left: direction * galleryRef.current.clientWidth * 0.8,
      behavior: 'smooth',
    });
  };

  const startNewEstimate = () => {
    clearCarRequest();
    onNavigate('estimator');
  };

  if (status === 'empty') {
    return (
      <main className="app-shell app-shell--center">
        <section className="empty-state">
          <h1>Нет сохраненного расчета</h1>
          <button className="button button--primary" type="button" onClick={() => onNavigate('estimator')}>
            <ArrowLeft aria-hidden="true" size={20} />
            К форме
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="button button--secondary" type="button" onClick={startNewEstimate}>
          <ArrowLeft aria-hidden="true" size={20} />
          Новая оценка
        </button>
        <div className={`status-pill status-pill--${status}`}>
          {status === 'loading' ? 'Расчет выполняется' : null}
          {status === 'ready' ? 'Расчет готов' : null}
          {status === 'failed' ? 'Backend недоступен' : null}
        </div>
      </header>

      {request ? (
        <section className="dashboard-hero">
          <div>
            <p className="eyebrow">Результат оценки</p>
            <h1>
              {request.make} {request.model}
            </h1>
            <p>
              {request.year} г. / {request.body} / {request.color} / {Number(request.odometer).toLocaleString('ru-RU')} км
            </p>
          </div>
          <button className="button button--secondary" type="button" onClick={() => window.location.reload()}>
            <RefreshCcw aria-hidden="true" size={19} />
            Обновить
          </button>
        </section>
      ) : null}

      {error ? <div className="alert">{error}</div> : null}

      <section className="gallery-section" aria-label="Фотографии автомобиля">
        <button
          className="icon-button gallery-section__control gallery-section__control--prev"
          type="button"
          onClick={() => scrollGallery(-1)}
          aria-label="Предыдущие фотографии"
        >
          <ChevronLeft aria-hidden="true" size={24} />
        </button>
        <div className="gallery-window" ref={galleryRef}>
          {photos.map((photo, index) => (
            <img
              key={`${photo}-${index}`}
              src={photo}
              alt={`${request?.make || 'Car'} ${request?.model || ''}`}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = FALLBACK_PHOTO;
              }}
            />
          ))}
        </div>
        <button
          className="icon-button gallery-section__control gallery-section__control--next"
          type="button"
          onClick={() => scrollGallery(1)}
          aria-label="Следующие фотографии"
        >
          <ChevronRight aria-hidden="true" size={24} />
        </button>
      </section>

      <section className="result-grid">
        <article className="metric-card">
          <span className="metric-card__icon">
            <CircleDollarSign aria-hidden="true" size={24} />
          </span>
          <p>Цена в {request?.yearsell || 'выбранном'} году</p>
          <strong>{formatMoney(estimate?.price)}</strong>
        </article>
        <article className="metric-card">
          <span className="metric-card__icon metric-card__icon--sales">
            <ShoppingBag aria-hidden="true" size={24} />
          </span>
          <p>Продажи за последние 8 лет</p>
          <strong>{formatCount(estimate?.sells)}</strong>
        </article>
        <article className="graph-panel">
          <div className="section-heading">
            <CircleDollarSign aria-hidden="true" size={22} />
            <h2>Динамика цены</h2>
          </div>
          {estimate?.graphUrl ? (
            <img src={estimate.graphUrl} alt="График изменения цены" />
          ) : (
            <div className="graph-placeholder">...</div>
          )}
        </article>
      </section>
    </main>
  );
}
