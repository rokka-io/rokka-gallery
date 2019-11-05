# rokka Gallery

## Project setup

Clone the repository, then install dependencies.

```
git clone https://github.com/rokka-io/rokka-gallery.git
cd rokka-gallery
git submodule update --init
npm install
cp config.js.dist config.js
```

### Compiles and hot-reloads for development
```
npm run start
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

## Deploy a new version

```
npm run build
npm run deploy
```