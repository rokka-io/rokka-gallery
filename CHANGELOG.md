# Changelog

All notable changes to this project will be documented in this file.

## 2026-02-22

### Changed

- Upgrade Node.js requirement from 18 to 22
- Update GitHub Actions CI to Node 22 and actions/checkout@v4 / actions/setup-node@v4
- Upgrade rokka SDK from 3.x to 4.x
- Update dependencies: core-js, dayjs, lodash-es, vue-gallery, vue-template-compiler, sass, @babel/core and others

### Fixed

- Silence Sass deprecation warnings (legacy-js-api, @import, global-builtin, color-functions)

### Security

- Fix 25 npm audit vulnerabilities via safe dependency updates
