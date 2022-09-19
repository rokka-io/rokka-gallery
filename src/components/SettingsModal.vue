<template>
  <div id="modal">
    <TitleLine title="Settings / Credentials" modal-name="modal-settings" />
    <div>
      <form @submit.prevent="save">
        <div>
          <div class="settings-form-container">
            <div v-if="title">
              <b>{{ title }}</b>
            </div>
            <div v-if="!rokkaKey">
              Please provide your rokka api key and organization:
            </div>
            <div>
              <label class="field-label" for="rokkaOrg"
                >rokka Organization:</label
              >
              <input
                id="rokkaOrg"
                v-model.trim="rokkaOrgField"
                class="field"
                size="64"
                autocomplete="username"
              />
            </div>
            <div>
              <label class="field-label" for="rokkaApi">rokka Api-Key: </label>
              <input
                id="rokkaApi"
                v-model.trim="rokkaKeyField"
                class="field"
                type="password"
                size="64"
                autocomplete="current-password"
              />
            </div>
          </div>
          <div class="settings-form-actions">
            <button type="submit" class="button" value="Save">Save</button>
            <button
              type="reset"
              class="button cancel"
              @click="$modal.hide('modal-settings')"
            >
              Cancel
            </button>
          </div>
          <div class="data"></div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { EventBus } from '../eventBus';
import TitleLine from './Modal/TitleLine';

export default {
  name: 'SettingsModal',
  components: { TitleLine },
  props: {
    rokkaOrg: {
      type: String,
      required: true,
    },
    rokkaKey: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      rokkaOrgField: this.rokkaOrg,
      rokkaKeyField: this.rokkaKey,
    };
  },
  methods: {
    save(e) {
      // e.preventDefault();
      const rokka = this.$rokka(this.rokkaKeyField);
      rokka.user
        .getNewToken(this.rokkaKeyField)
        .then((response) => {
          EventBus.$emit('credentials-updated', {
            org: this.rokkaOrgField,
            token: response.body.token,
            key: this.rokkaKeyField,
          });
          this.$emit('close');
        })
        .catch((error) => {
          console.log(error);
          this.$toast.error('Could not update credentials');
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '_modal.scss';

form {
  height: 100%;
}
</style>
