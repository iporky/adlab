import { useLayoutEffect, useState } from 'react';

import i18n from '../helpers/i18n';
import { supportedLocales } from '../helpers/i18n/lang';

const useI18NManualInitialization = () => {
  const [canRenderUI, setCanRenderUI] = useState(false);
  useLayoutEffect(() => {
    if (!i18n.isI18NInitialized()) {
      new i18n._i18n().init({
        lang: 'en',
        locale: 'en-US',
        translations: supportedLocales.en,
      });
    }
    setCanRenderUI(true);
  }, []);

  return [canRenderUI];
};

export default useI18NManualInitialization;
