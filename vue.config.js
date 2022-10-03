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
          @import "assets/liip-styleguide/assets/scss/settings/settings";
          @import "assets/liip-styleguide/assets/scss/settings/kanbasu";
          @import 'assets/kanbasu/src/scss/tools/functions';
          @import "assets/liip-styleguide/assets/scss/tools/functions";
          @import 'assets/kanbasu/src/scss/tools/mixins';
          @import "assets/liip-styleguide/assets/scss/tools/mixins";
        `,
      },
    },
  },
};
