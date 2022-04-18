<template>
  <v-card class="mx-auto mb-5" width="234">
    <v-img class="white--text align-end" height="200px" :src="hero.avatar">
    </v-img>
    <v-card-subtitle class="pb-0"
      >Class: {{ renderTitle("heroClass") }}</v-card-subtitle
    >
    <v-card-text class="text--primary">
      <div>Sex: {{ renderTitle("sex") }}</div>
      <div>Generation: {{ renderTitle("generation") }}</div>
      <div>Star: {{ renderTitle("star") }}</div>
    </v-card-text>
    <v-card-actions class="mx-auto">
      <v-btn
        color="primary"
        v-bind="attrs"
        @click="handleGetHex(hero[0]._hex)"
        v-on="on"
      >
        Transfer
      </v-btn>
      {{hero[0].hex}}
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["hero", "attrs", "on", "sex", "generation", "star", "heroClass"],
  methods: {
    renderTitle(type) {
      let data = "";
      switch (type) {
        case "sex": {
          data = this.sex.filter((item) => item.value === this.hero.sex);
          break;
        }
        case "heroClass": {
          data = this.heroClass.filter(
            (item) => item.value === this.hero.class
          );
          break;
        }
        case "generation": {
          data = this.generation.filter(
            (item) => item.value === this.hero.generation
          );
          break;
        }
        case "star": {
          data = this.star.filter((item) => item.value === this.hero.star);
          break;
        }
      }
      return data[0].label;
    },
    handleGetHex(id) {
      console.log('if',id);
      this.$emit('onIdSelect',id)
    }
  },
};
</script>

<style scoped>
</style>