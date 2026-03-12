import { useTranslation } from 'react-i18next';

const DocIframe = ({ source }) => {
  const { t } = useTranslation();

  if (!source) return <div>{t('common.loading')}</div>;

  const previewUrl = source.includes('/document/')
    ? source.replace(/\/edit.*$/, '') + '/preview'
    : source;

  return (
    <iframe
      src={previewUrl}
      title={t('chat.documentDefault')}
      width="100%"
      height="600"
      style={{ border: 'none' }}
    />
  );
};

export default DocIframe;
