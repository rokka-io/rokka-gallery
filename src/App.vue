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
        <template v-if="!this.$route.params.category">
          <router-view
            :all-albums="allAlbumsFlat"
            :all-tags="allTags"
            :query="this.$route.params.search"
            :reload="reload"
            :global-options="globalOptions"
            :sort="sort"
          />
        </template>
        <template v-else>
          <router-view
            :category="this.$route.params.category"
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
      rokkaKey:
        params.get('key') ||
        localStorage.getItem('rokkaKey') ||
        config.rokkaKey,
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

      let canWrite = JSON.parse(localStorage.getItem('rokkaCanWrite'));
      if (this.canWrite !== canWrite) {
        this.setCanWrite(canWrite);
      }
      let canUpload = JSON.parse(localStorage.getItem('rokkaCanUpload'));
      if (this.canUpload !== canUpload) {
        this.setCanUpload(canUpload);
      }
      return {
        rokkaOrg: this.rokkaOrg,
        rokkaKey: this.rokkaKey,
        downloads: orgOptions.downloads || null,
        deleteEnabled: orgOptions.deleteEnabled || false,
        canWrite: this.canWrite,
        canUpload: this.canUpload,
      };
    },
  },

  created() {
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
    EventBus.$on('credentials-updated', (key, org) => {
      this.credentialsUpdated(key, org);
    });
    this.updateTags();
  },

  methods: {
    credentialsUpdated(key, org) {
      // eslint-disable-next-line
      console.log(`Credentials got updated`);
      this.rokkaOrg = org;
      if (key) {
        localStorage.setItem('rokkaKey', key);
        this.rokkaKey = key;
      } else {
        this.rokkaKey = '';
      }
      localStorage.setItem('rokkaOrg', org);
      this.setCanWrite(null);
      this.setCanUpload(null);
      this.updateTags();
      const query = this.$route.query || {};
      this.$router
        .push({
          path: this.$route.path || '/',
          query,
          hash: window.location.hash,
        })
        .catch(() => {
          this.reload = new Date();
        });
      if (!this.rokkaKey) {
        this.checkLogin();
      }
    },
    setCanWrite(value) {
      localStorage.setItem('rokkaCanWrite', value);
      this.canWrite = value;
    },
    setCanUpload(value) {
      localStorage.setItem('rokkaCanUpload', value);
      this.canUpload = value;
    },
    getInitialRokkaOrg() {
      const uri = window.location.search.substring(1);
      const params = new URLSearchParams(uri);
      if (params.get('org')) {
        // remove login info from url
        this.credentialsUpdated(params.get('key'), params.get('org'));
      }
      return (
        params.get('org') || localStorage.getItem('rokkaOrg') || config.rokkaOrg
      );
    },
    checkLogin(title = '') {
      if ((title !== '' || this.rokkaKey === '') && this.$modal) {
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
        {
          height: '270px',
          width: '600px',
          maxWidth: 1000,
          maxHeight: 400,
          name: 'modal-settings',
        }
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

      if (JSON.parse(localStorage.getItem('rokkaCanWrite')) === null) {
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
            this.setCanWrite(true);
            this.setCanUpload(true);
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
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            });
            this.categories = categories;
          }
        })
        .catch((e) => {
          if (e.statusCode === 403) {
            this.rokkaKey = '';
            this.checkLogin(
              'Your credentials are wrong, please use the correct api-key or org'
            );
            return;
          }
          if (e.statusCode === 404) {
            this.checkLogin('This organization this not exist');
            return;
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
