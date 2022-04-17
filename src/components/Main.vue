<template>
  <v-container>
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-row>
          <v-col cols="4">
            <p>Avatar</p>
            <input type="file" ref="myFile" @change="previewFile" />
            <p>Class</p>
            <select
              class="d-block py-2 px-3 rounded-lg"
              style="width: 100%; border: 1px solid black; outline: none"
              v-model="selectClass"
            >
              <option
                v-for="(item, index) in heroClass"
                :key="index"
                :value="item.value"
              >
                {{ item.label }}
              </option>
            </select>
            <p>Sex</p>

            <select
              class="d-block py-2 px-3 rounded-lg"
              style="width: 100%; border: 1px solid black; outline: none"
              v-model="selectSex"
            >
              <option
                v-for="(item, index) in sex"
                :key="index"
                :value="item.value"
              >
                {{ item.label }}
              </option>
            </select>

            <p>Generation</p>
            <select
              class="d-block py-2 px-3 rounded-lg"
              style="width: 100%; border: 1px solid black; outline: none"
              v-model="selectGeneration"
            >
              <option
                v-for="(item, index) in generation"
                :key="index"
                :value="item.value"
              >
                {{ item.label }}
              </option>
            </select>
            <p>Star</p>
            <select
              class="d-block py-2 px-3 rounded-lg"
              style="width: 100%; border: 1px solid black; outline: none"
              v-model="selectStar"
            >
              <option
                v-for="(item, index) in star"
                :key="index"
                :value="item.value"
              >
                {{ item.label }}
              </option>
            </select>
            <v-btn
              elevation="2"
              large
              color="success"
              class="mt-4"
              @click="createHero()"
              >Create hero</v-btn
            >
          </v-col>
          <!-- =======================col2===================== -->
          <v-col class="mb-4" cols="8">
            <v-row>
              <v-col cols="12">
                <div class="d-flex">
                  <v-btn
                    elevation="2"
                    class="mr-3"
                    color="success"
                    @click="getAllHeroes()"
                    >All heros</v-btn
                  >
                  <v-btn
                    elevation="2"
                    color="success"
                    @click="getHeroesOfAccount()"
                    class="mr-5"
                    >My Heros</v-btn
                  >
                  <v-btn
                    color="primary"
                    @click="connectMetamask()"
                    v-if="connectMetamaskSuccess"
                    >connect Metamask</v-btn
                  >
                  <div v-else class="my-auto">
                    <span>{{ addressWallet }}</span>
                  </div>
                </div>
              </v-col>
              <!-- =================all=================== -->
              <v-alert type="success" v-if="isSuccess">{{ successMes}}</v-alert>
              <v-alert type="error" v-if="isError">{{ errorMes }}</v-alert>
              <div class="mx-auto d-flex justify-center" v-if="isLoading">
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </div>
              <v-col cols="12">
                <div class="">
                  <div class="d-flex flex-wrap">
                    <div
                      v-for="(hero, index) in allHeroFi"
                      :key="index"
                      class="mr-5"
                    >
                      <Card
                        :hero="hero"
                        :attrs="attrs"
                        :on="on"
                        :sex="sex"
                        :heroClass="heroClass"
                        :generation="generation"
                        :star="star"
                        @onIdSelect="changeSelectedHero"
                      />
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </template>

      <v-card v-if="dialog">
        <v-card-title class="text-h5 grey lighten-2">
          Nhập địa chỉ ví
        </v-card-title>
        <v-card-text>
          <input
            type="text"
            style="
              border: 1px solid black;
              outline: none;
              width: 100%;
              font-size: 20px;
            "
            class="px-6 py-2 rounded mt-6"
            v-model="inputAdressWallet"
          />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="handleTranfer()">Tranfer</v-btn>
          <v-btn color="danger" text @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ethers } from "ethers";
import * as herofi from "../HeroFi.json";
import Card from "./Card.vue";
import { create } from "ipfs-http-client";
export default {
  name: "Main",
  components: {
    Card,
  },
  data() {
    return {
      selectAvatar: "",
      selectClass: 0,
      selectSex: 0,
      selectGeneration: 0,
      selectStar: 0,
      connectMetamaskSuccess: true,
      abi: herofi.default.abi,
      allHeroFi: [],
      isLoading: false,
      redirectTab: true,
      signer: null,
      isSuccess: false,
      isError: false,
      addressWallet: "",
      dialog: false,
      inputAdressWallet: "",
      idSelect: null,
      address: "0x7575c71C24091954d219d59E3513b59f8F8a552f",
      successMes: "",
      errorMes: "",
      sex: [
        { label: "Male", value: 0 },
        { label: "Female", value: 1 },
      ],
      generation: [
        { label: "GENESIS", value: 0 },
        { label: "NORMAL", value: 1 },
      ],
      heroClass: [
        { label: "WATER", value: 0 },
        { label: "PLANT", value: 1 },
        { label: "FIRE", value: 2 },
        { label: "THUNDER", value: 3 },
        { label: "DARK", value: 4 },
        { label: "LIGHT", value: 5 },
      ],
      star: [
        { label: "ONE", value: 0 },
        { label: "TWO", value: 1 },
        { label: "THREE", value: 2 },
        { label: "FOUR", value: 3 },
        { label: "FIVE", value: 4 },
        { label: "SIX", value: 5 },
      ],
    };
  },
  created() {
    this.connectMetamask();
  },
  mounted() {
    this.getAllHeroes();
  },
  methods: {
    previewFile() {
      this.selectAvatar = this.$refs.myFile.files[0];
    },
    async getAllHeroes() {
      this.isLoading = true;
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      this.signer = await provider.getSigner();
      const contract = new ethers.Contract(this.address, this.abi, this.signer);
      const allHero = await contract.getAllHeroes();
      this.allHeroFi = [...allHero];
      this.isLoading = false;
    },
    async getHeroesOfAccount() {
      this.isLoading = true;
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      this.signer = await provider.getSigner();
      const contract = new ethers.Contract(this.address, this.abi, this.signer);
      const heroAccount = await contract.getHeroesOfAccount();
      this.allHeroFi = [...heroAccount];
      this.isLoading = false;
    },
    async connectMetamask() {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      this.signer = provider.getSigner();
      this.addressWallet = await signer.getAddress();
      this.connectMetamaskSuccess = false;
    },
    async createHero() {
      try {
        this.isLoading = true;
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        await provider.send("eth_requestAccounts", []);
        this.signer = provider.getSigner();
        const contract = new ethers.Contract(
          this.address,
          this.abi,
          this.signer
        );
        const client = create("https://ipfs.infura.io:5001/api/v0");
        const added = await client.add(this.selectAvatar);
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        this.selectAvatar = url;
        const createHero = await contract.createHero(
          this.selectAvatar,
          this.selectClass,
          this.selectSex,
          this.selectGeneration,
          this.selectStar
        );
        const { status } = await createHero.wait();
        if (status == 1) {
          this.successMes = "Create hero success";
          await setTimeout((this.isSuccess = true), 2000);
          this.isLoading = false;
          this.isSuccess = false;
          this.getHeroesOfAccount();
        } else {
          this.errorMes = "Create error";
          await setTimeout((this.isError = true), 2000);
          this.isError = false;
        }
      } catch (error) {
        this.errorMes = "Create error";
        console.log("Error uploading file: ", error);
      }
    },
    async handleTranfer() {
      this.dialog = false;
      this.isLoading = true;
      if (this.inputAdressWallet !== "") {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        await provider.send("eth_requestAccounts", []);
        this.signer = provider.getSigner();
        const contract = new ethers.Contract(
          this.address,
          this.abi,
          this.signer
        );
        const tranfer = await contract.transferHero(
          this.addressWallet,
          this.inputAdressWallet,
          this.idSelect
        );
        const { status } = await tranfer.wait();
        if (status == 1) {
          this.getHeroesOfAccount();
          this.successMes = "Transfer hero success";
          await ((this.isSuccess = true), 2000);
          this.isLoading = false;
        } else {
          this.errorMes = "Tranfer fail";
          await ((this.isError = true), 2000);
          this.isError = false;
        }
      } else if (this.inputAdressWallet == 0) {
        this.isLoading = false
        console.log("ua");
        this.errorMes = "address wallet invalid";
        await ((this.isError = true), 2000);
        this.isError = false;
      }
    },
    changeSelectedHero(id) {
      this.idSelect = id;
    },
  },
};
</script>
<style scoped>
</style>
