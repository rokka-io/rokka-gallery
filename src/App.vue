<template>
  <div id="app">
    <Header
      :images-count="imagesCount"
      :all-tags="allTags"
      :all-albums="allAlbumsFlat"
      :rokka-key="rokkaKey"
      :rokka-org="rokkaOrg"
      :global-options="globalOptions"
      :sort="sort"
      @show-settings-modal="showSettingsModal"
    />

    <div :class="['page', allAlbums.length === 0 ? 'nonav' : null]">
      <Nav
        :categories="allAlbums"
        class="site-nav"
        :show="allAlbums.length > 0"
      />

      <section class="section">
        <template v-if="!$route.params.category">
          <router-view
            :all-albums="allAlbumsFlat"
            :all-tags="allTags"
            :query="$route.params.search"
            :reload="reload"
            :global-options="globalOptions"
            :sort="sort"
          />
        </template>
        <template v-else>
          <router-view
            :category="$route.params.category"
            :all-albums="allAlbumsFlat"
            :all-tags="allTags"
            :global-options="globalOptions"
            :sort="sort"
            :reload="reload"
          />
        </template>
      </section>
    </div>
  </div>
</template>

<script>
import { map, forEach, debounce } from 'lodash-es';
import Header from './components/Header';
import Nav from './components/nav/Nav';
import { EventBus } from './eventBus';
import SettingsModal from './components/SettingsModal';
import config from '../config';
import pathsToTree from 'paths-to-tree-structure';
import { ROKKA_ORG, ROKKA_TOKEN } from '@/main';
import { settingsModalProps, uploadModalProps } from '@/consts';
import UploadModal from '@/components/UploadModal';

export default {
  name: 'App',

  components: {
    Header,
    Nav,
  },

  data() {
    const uri = window.location.search.substring(1);
    const params = new URLSearchParams(uri);
    return {
      imagesCount: 0,
      categories: [],
      allTags: [],
      canWrite: null,
      canUpload: null,
      rokkaKey: params.get('key') || config.rokkaKey,
      rokkaToken: localStorage.getItem(ROKKA_TOKEN),
      rokkaOrg: this.getInitialRokkaOrg(),
      reload: '',
      //sort: 'taken_or_created asc'
    };
  },
  computed: {
    sort() {
      if (this.$route.query && this.$route.query.sort) {
        return this.$route.query.sort;
      }
      return 'created desc';
    },
    allAlbums() {
      return pathsToTree(this.categories.map((c) => `/${c.name}`)).items.map(
        (c) => {
          return { ...c, slug: c.name };
        }
      );
    },
    allAlbumsFlat() {
      return map(this.categories, (a) => {
        return { text: a.name };
      });
    },
    globalOptions() {
      const orgOptions =
        config.orgOptions && config.orgOptions[this.rokkaOrg]
          ? config.orgOptions[this.rokkaOrg]
          : {};

      let canWrite = JSON.parse(
        sessionStorage.getItem('rokka-gallery-canWrite')
      );
      if (this.canWrite !== canWrite) {
        this.setCanWrite(canWrite);
      }
      let canUpload = JSON.parse(
        sessionStorage.getItem('rokka-gallery-canUpload')
      );
      if (this.canUpload !== canUpload) {
        this.setCanUpload(canUpload);
      }
      return {
        rokkaOrg: this.rokkaOrg,
        downloads: orgOptions.downloads || null,
        deleteEnabled: orgOptions.deleteEnabled || false,
        favoriteHideEnabled: orgOptions.favoriteHideEnabled || false,
        canWrite: this.canWrite,
        canUpload: this.canUpload,
        rokkaToken: this.rokkaToken,
        rokkaKey: this.rokkaKey,
      };
    },
  },

  async created() {
    this.checkLogin();

    this.debouncedUpdate = debounce(this.updateTags, 10000);

    EventBus.$on('image-updated', (hash) => {
      // eslint-disable-next-line
      console.log(`${hash} got updated`);
      this.debouncedUpdate();
    });
    EventBus.$on('search-reload', () => {
      this.reload = new Date().getTime();
      // eslint-disable-next-line
      console.log('reload search');
    });
    EventBus.$on('credentials-updated', (values) => {
      this.credentialsUpdated(values);
    });
    this.updateTags();
    const uri = window.location.search.substring(1);
    const params = new URLSearchParams(uri);
    if (params.has('upload')) {
      this.$modal.show(
        UploadModal,
        {
          allAlbums: this.allAlbums,
          allTags: this.allTags,
          globalOptions: this.globalOptions,
        },
        uploadModalProps,
        { closed: this.uploadClosed }
      );
    }
  },

  methods: {
    uploadClosed() {
      const uri = window.location.search.substring(1);
      const params = new URLSearchParams(uri);
      if (params.has('upload')) {
        const query = { ...this.$route.query } || {};
        delete query.upload;
        this.$router.push({
          path: this.$route.path || '/',
          query: query,
          hash: window.location.hash,
        });
      }
    },
    credentialsUpdated({ token, org, key, logout }) {
      // eslint-disable-next-line
      console.log(`Credentials got updated`, token, org, key);
      if (org) {
        this.rokkaOrg = org;
      } else {
        this.rokkaOrg = '';
      }

      if (logout === true) {
        this.$rokka().user.setToken(null);
        this.rokkaToken = null;
        this.rokkaKey = '';
      } else {
        if (token) {
          this.$rokka().user.setToken(token);
          this.rokkaToken = token;
        }
        if (key) {
          this.rokkaKey = key;
        }
      }

      localStorage.setItem(ROKKA_ORG, this.rokkaOrg);
      this.setCanWrite(null);
      this.setCanUpload(null);
      this.updateTags();
      const query = { ...this.$route.query } || {};
      delete query.org;
      delete query.key;
      this.$router
        .push({
          path: this.$route.path || '/',
          query: query,
          hash: window.location.hash,
        })
        .catch(() => {
          this.reload = new Date();
        });
      if (!this.rokkaToken) {
        this.checkLogin();
      }
    },
    setCanWrite(value) {
      sessionStorage.setItem('rokka-gallery-canWrite', value);
      this.canWrite = value;
    },
    setCanUpload(value) {
      sessionStorage.setItem('rokka-gallery-canUpload', value);
      this.canUpload = value;
    },
    getInitialRokkaOrg() {
      const uri = window.location.search.substring(1);
      const params = new URLSearchParams(uri);
      if (params.get('org')) {
        // remove login info from url
        this.$rokka(params.get('key'))
          .user.getNewToken()
          .then((result) => {
            this.credentialsUpdated({
              token: result.body.token,
              org: params.get('org'),
            });
          })
          .catch((e) => {
            this.credentialsUpdated({ logout: true, org: params.get('org') });
          });
      }
      return (
        params.get('org') ||
        localStorage.getItem(ROKKA_ORG) ||
        config.rokkaOrg ||
        ''
      );
    },
    checkLogin(title = '') {
      if (
        (title !== '' || !(this.$rokka().user.getToken() || this.rokkaKey)) &&
        this.$modal
      ) {
        this.showSettingsModal(title);
      }
    },
    showSettingsModal(title = null) {
      this.$modal.show(
        SettingsModal,
        {
          title: title,
          rokkaKey: this.rokkaKey,
          rokkaOrg: this.rokkaOrg,
        },
        settingsModalProps
      );
    },
    updateTags() {
      const rokka = this.$rokka(this.rokkaKey);
      if (rokka === null) {
        this.categories = [];
        this.allTags = [];
        this.imagesCount = 0;
        return;
      }

      if (
        JSON.parse(sessionStorage.getItem('rokka-gallery-canWrite')) === null
      ) {
        rokka.memberships
          .get(this.rokkaOrg, 'current')
          .then((result) => {
            const roles = result.body.roles;

            this.setCanWrite(
              roles.includes('admin') || roles.includes('write')
            );
            this.setCanUpload(this.canWrite || roles.includes('upload'));
          })
          .catch((err) => {
            // could be a super admin
            if (this.rokkaKey || this.rokkaToken) {
              this.setCanWrite(true);
              this.setCanUpload(true);
            }
            // eslint-disable-next-line
            console.log('Could not get user data', err);
          });
      }

      rokka.sourceimages
        .list(this.rokkaOrg, {
          limit: 0,
          facets: 'user:array:albums',
        })
        .then((response) => {
          this.imagesCount = response.body.total;
          if (response.body['facets']['user:array:albums']) {
            const categories = map(
              response.body['facets']['user:array:albums'],
              (a) => {
                return { name: a.value };
              }
            );
            categories.sort((a, b) => {
              return a.name.localeCompare(b.name);
            });
            this.categories = categories;
          }
        })
        .catch((e) => {
          if (e.statusCode === 403) {
            this.rokkaKey = '';
            this.credentialsUpdated({ logout: true });
            return;
          }
          if (e.statusCode === 401) {
            this.credentialsUpdated({ logout: true });
            return;
          }
          if (e.statusCode === 404) {
            this.checkLogin('This organization this not exist');
          }
        });

      const facets = [
        'user:array:labels',
        'user:array:autolabels:labels',
        'static:array:exif:keywords',
        'static:str:location:country',
        'static:str:location:state',
        'static:str:location:city',
      ];
      rokka.sourceimages
        .list(this.rokkaOrg, {
          limit: 0,
          facets: facets.join(','),
        })
        .then((response) => {
          let tags = {};
          forEach(facets, (facet) => {
            if (response.body['facets'][facet]) {
              forEach(response.body['facets'][facet], (a) => {
                tags[a.value] = true;
              });
            }
          });
          const allTags = map(tags, (a, key) => {
            return { text: key };
          });
          allTags.sort((a, b) => {
            if (a.text.toLowerCase() < b.text.toLowerCase()) {
              return -1;
            }
            return 1;
          });
          this.allTags = allTags;
        });
    },
  },
};
</script>

<style lang="scss">
.page {
  display: grid;
  grid-template-columns: minmax(0, 220px) auto;

  position: relative;
  &.nonav {
    grid-template-columns: 0 auto;
  }
}

.site-nav {
  height: calc(100vh - 98px);

  position: sticky;
  top: 98px;
  bottom: 0;
  overflow-y: auto;

  background-color: white;
}

.alert {
  max-width: 60em;

  color: $orange-700;
  font-size: rem(20px);
  line-height: 1.3;
  font-weight: bold;
}
</style>
