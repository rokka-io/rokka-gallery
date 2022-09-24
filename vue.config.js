module.exports = {
  devServer: {
    port: 3000,
    historyApiFallback: {
      disableDotRule: true,
    },
  },
  publicPath: process.env.FOR_ROKKA === 'true' ? '/gallery/' : '/',
  runtimeCompiler: false,
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "~@liip/styleguide/assets/scss/settings/settings";
          @import "~@liip/styleguide/assets/scss/settings/kanbasu";
          @import '~kanbasu/src/scss/tools/functions';
          @import "~@liip/styleguide/assets/scss/tools/functions";
          @import '~kanbasu/src/scss/tools/mixins';
          @import "~@liip/styleguide/assets/scss/tools/mixins";
        `,
      },
    },
  },
};
