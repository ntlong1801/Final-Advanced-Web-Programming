import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function C404() {
  const { t } = useTranslation();
  return (
    <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
      <div className="flex flex-column align-items-center justify-content-center">
        <div
          style={{
            borderRadius: '50px',
            padding: '0.3rem',
            background:
              'linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%)',
          }}
        >
          <div
            className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center"
            style={{ borderRadius: '53px' }}
          >
            <span className="text-red-700 font-bold text-5xl">404</span>
            <h1 className="text-red-700 font-bold text-5xl mb-2">{t('404.notFound')}</h1>
            <div className="text-600 mb-5">{t('404.sourceNotAvailable')}</div>
            <Link to="/dashboard" className="w-full flex align-items-center py-5 border-300 border-bottom-1">
              <span
                className="flex justify-content-center align-items-center bg-cyan-400 border-round"
                style={{ height: '3.5rem', width: '3.5rem' }}
              >
                <i className="text-50 pi pi-fw pi-home text-2xl" />
              </span>
              <span className="ml-4 flex flex-column">
                <span className="text-900 lg:text-xl font-medium mb-1">{t('404.comeback')}</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
