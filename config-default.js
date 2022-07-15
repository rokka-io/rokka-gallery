import rokkaHelper from './src/rokkaHelper';

const glitchit = {
  title: 'Glitch it',
  url: function (icon, rokkaOrg) {
    return `https://glitch.liip.to/?hash=${icon.short_hash}&org=${rokkaOrg}`;
  },
};

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
  rokkaOrg: '',
  rokkaKey: '', //default key, only set, if you want people to be able to use the site without a key (or add a read only key)
  orgOptions: {
    chregus: {
      deleteEnabled: true,
    },
    'migros-artikelabfrage': {
      deleteEnabled: true,
      downloads: {
        original: {
          title: 'Open original',
          url: function (icon, rokkaOrg) {
            return rokkaHelper.renderUrl(
              icon,
              rokkaOrg,
              null,
              null,
              null,
              'source'
            );
          },
        },
        maxwidth,
      },
    },
    'gallery-demo': {
      deleteEnabled: false,
      downloads: {
        maxwidth,
      },
    },
    drupal20: {
      deleteEnabled: true,
    },
    playground: {
      deleteEnabled: true,
      downloads: {
        original: {
          title: 'Open original',
          url: function (icon, rokkaOrg) {
            return rokkaHelper.renderUrl(
              icon,
              rokkaOrg,
              null,
              null,
              null,
              'source'
            );
          },
        },
        maxwidth,
        glitchit,
      },
    },
    liip: {
      deleteEnabled: true,

      downloads: {
        original: {
          title: 'Open original',
          url: function (icon, rokkaOrg) {
            return rokkaHelper.renderUrl(
              icon,
              rokkaOrg,
              null,
              null,
              null,
              'www_raw'
            );
          },
        },
        maxwidth,
        glitchit,
      },
    },
    'liip-pictures': {
      deleteEnabled: true,

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
    'liip-development': {
      deleteEnabled: true,
      downloads: {
        original: {
          title: 'Open original',
          url: function (icon, rokkaOrg) {
            return rokkaHelper.renderUrl(
              icon,
              rokkaOrg,
              null,
              null,
              null,
              'www_raw'
            );
          },
        },
        maxwidth,
        glitchit,
      },
    },
    'liip-images': {
      downloads: {
        original: {
          title: 'Open original',
          url: function (icon, rokkaOrg) {
            return rokkaHelper.renderUrl(
              icon,
              rokkaOrg,
              null,
              null,
              null,
              'www_raw'
            );
          },
        },
        maxwidth,
        glitchit,
      },
    },
  },
};
