import rokkaHelper from './src/rokkaHelper';

const maxwidth = {
  title: function (icon) {
    if (icon.width > 1920) {
      return 'Open with 1920px width';
    }
    if (icon.width > 728) {
      return 'Open with 728px width';
    }
    return null;
  },
  url: function (icon, rokkaOrg) {
    let width = 728;
    if (icon.width > 1920) {
      width = 1920;
    }
    return rokkaHelper.renderUrl(
      icon,
      rokkaOrg,
      width,
      null,
      null,
      'dynamic/resize-width-${width}-upscale-false'
    );
  },
};

export default {
  rokkaOrg: 'liip-pictures',
  rokkaKey: '${LIIP_PICTURES_ROKKA_KEY}',
  orgOptions: {
    'liip-pictures': {
      deleteEnabled: true,

      theme: {
        '--header-bg': '#222222',
        '--header-bg-gradient-from': '#222222',
        '--header-bg-gradient-to': '#0E322D',
        '--brand-color': '#045F50',
        '--brand-color-hover': '#6EE09C',
        '--brand-color-active': '#0E322D',
        '--header-fg': '#ffffff',
      },

      downloads: {
        original: {
          title: 'Download original',
          url: function (icon, rokkaOrg) {
            return rokkaHelper.renderUrl(
              icon,
              rokkaOrg,
              null,
              null,
              null,
              'raw/o-content_disposition-attachment'
            );
          },
        },
        maxwidth2: {
          title: 'Download with 1920px width',
          url: function (icon, rokkaOrg) {
            return rokkaHelper.renderUrl(
              icon,
              rokkaOrg,
              '1920',
              null,
              null,
              'dynamic/resize-width-${width}-upscale-false/o-af-0-content_disposition-attachment'
            );
          },
        },
        maxwidth,
      },
    },
  },
};
