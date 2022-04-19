<template>
  <v-container>
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-row>
          <v-col cols="12" md="4">
            <p>Avatar</p>
            <input
              type="file"
              accept="image/png, image/jpeg"
              ref="myFile"
              @change="previewFile"
            />
            <span style="color: red" class="d-block" v-if="sizePhoto"
              >Size img too large. Reselect</span
            >
            <span v-if="validPhoto" style="color: red" class="d-block"
              >Please choose photo</span
            >
            <p>Class</p>
            <div class="select">
              <select
              class="d-block py-2 px-3 rounded"
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
            </div>
            <p>Sex</p>

            <div class="select">
              <select
              class="d-block py-2 px-3 rounded"
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
            </div>

            <p>Generation</p>
            <div class="select">
              <select
              class="d-block py-2 px-3 rounded"
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
            </div>
            <p>Star</p>
            <div class="select">
              <select
              class="d-block py-2 px-3 rounded"
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
            </div>
            <v-btn
              elevation="2"
              large
              color="success"
              class="mt-4"
              @click="createHero()"
              :disabled="isConnect === 1"
              >Create hero</v-btn
            >
          </v-col>
          <!-- =======================col2===================== -->
          <v-col class="mb-4" cols="12" md="8">
            <v-row>
              <v-col cols="12">
                <div class="d-flex flex-wrap">
                  <v-btn
                    elevation="2"
                    class="mr-3 mb-3 mb-md-2 white--text"
                    :style="[
                      tabActive
                        ? { background: '#78f271' }
                        : { background: '#999' },
                    ]"
                    @click="getAllHeroes()"
                    >All heros</v-btn
                  >
                  <v-btn
                    elevation="2"
                    @click="getHeroesOfAccount()"
                    :style="[
                      tabActive
                        ? { background: '#999' }
                        : { background: '#78f271' },
                    ]"
                    class="mr-5 mt-xs-0 white--text"
                    :disabled="isConnect === 1"
                    >My Heros</v-btn
                  >
                  <v-btn
                    color="primary"
                    class="mt-2 mt-sm-0"
                    @click="connectMetamask()"
                    v-if="connectMetamaskSuccess"
                    >Connect Metamask</v-btn
                  >
                  <div
                    v-else
                    class="my-auto mt-6 mt-lg-0"
                  >
                    <span style="overflow: hidden; fontsize: 11px">{{
                      addressWallet
                    }}</span>
                  </div>
                </div>
              </v-col>
              <!-- =================all=================== -->
              <v-alert type="success" v-if="isSuccess">{{
                successMes
              }}</v-alert>
              <v-alert type="error" v-if="isError">{{ errorMes }}</v-alert>
              <!-- ==============total============ -->
              <v-col cols="12"> Total Hero: ({{ totalHero }}) </v-col>
              <div
                class="d-block mx-auto d-flex justify-center"
                v-if="isLoading"
              >
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </div>
              <v-col cols="12">
                <v-row>
                  <v-col v-for="(hero, index) in newAllHeroFi" :key="index">
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
                  </v-col>
                </v-row>
                <v-row>
                  <!-- ============panigation========= -->
                  <div class="text-center mx-auto">
                    <v-pagination
                      v-model="page"
                      :length="pages"
                      @input="changePage"
                      :total-visible="6"
                    ></v-pagination>
                  </div>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row> </v-row>
      </template>
      <v-card v-if="dialog">
        <v-card-title class="text-h5 grey lighten-2">
          Enter wallet address
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
      newAllHeroFi: [],
      listCount: 0,
      isLoading: false,
      redirectTab: true,
      signer: null,
      isSuccess: false,
      isError: false,
      addressWallet: "",
      dialog: false,
      inputAdressWallet: "",
      idSelect: null,
      tabActive: true,
      totalHero: 0,
      sizePhoto: false,
      validPhoto: false,
      isConnect: 1,
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
      page: 1,
      pageSize: 6,
      isExtention: false,
    };
  },
  async created() {
    await this.checkExtention();
    if (this.isExtention) {
      await this.getAllHeroes();
      this.initPage();
      this.changePage(this.page);
    }
  },
  computed: {
    pages() {
      if (this.pageSize == null || this.listCount == null) return 0;
      return Math.ceil(this.listCount / this.pageSize);
    },
  },
  methods: {
    initPage() {
      this.listCount = this.allHeroFi.length;
      if (this.listCount < this.pageSize) {
        this.newAllHeroFi = this.allHeroFi;
      } else {
        this.newAllHeroFi = this.allHeroFi.slice(0, this.pageSize);
      }
    },
    changePage(pageIndex) {
      let start = (pageIndex - 1) * this.pageSize;
      let end = pageIndex * this.pageSize;
      this.newAllHeroFi = this.allHeroFi.slice(start, end);
      this.page = pageIndex;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    previewFile() {
      this.selectAvatar = this.$refs.myFile.files[0];
    },
    checkExtention() {
      if (typeof window.ethereum === "undefined") {
        this.connectMetamaskSuccess = false;
        this.isConnect = true
        this.isExtention = false;
        this.isLoading = false;
        this.isError = true;
        this.errorMes = "You need to install the extension Metamask";
        setTimeout(() => {
          this.isError = false;
        }, 5000);
      } else {
        this.isExtention = true;
        // this.connectMetamaskSuccess = false;
      }
    },
    async connectMetamask() {
      this.isConnect = 0;
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
    async getAllHeroes() {
      this.page = 1;
      this.tabActive = true;
      this.isLoading = true;
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const contract = new ethers.Contract(this.address, this.abi, provider);
      const allHero = await contract.getAllHeroes();
      this.allHeroFi = [...allHero];
      this.changePage(this.page);
      this.totalHero = allHero.length;
      this.isLoading = false;
    },
    async getHeroesOfAccount() {
      this.page = 1;
      this.tabActive = false;
      this.isLoading = true;
      // const provider = new ethers.providers.Web3Provider(
      //   window.ethereum,
      //   "any"
      // );
      // await provider.send("eth_requestAccounts", []);
      // this.signer = await provider.getSigner();
      const contract = new ethers.Contract(this.address, this.abi, this.signer);
      const heroAccount = await contract.getHeroesOfAccount();
      this.allHeroFi = [...heroAccount];
      this.changePage(this.page);
      this.totalHero = heroAccount.length;
      this.isLoading = false;
    },
    async createHero() {
      const sizeImg = this.selectAvatar.size;
      console.log(this.selectAvatar.size);
      if (sizeImg < 100000) {
        console.log("Upload");
        this.validPhoto = false;
        this.sizePhoto = false;
        try {
          this.isLoading = true;
          const provider = new ethers.providers.Web3Provider(
            window.ethereum,
            "any"
          );
          await provider.send("eth_requestAccounts", []);
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
            this.isSuccess = true;
            await setTimeout(() => {
              this.isLoading = false;
              this.isSuccess = false;
            }, 2000);
            this.getHeroesOfAccount();
          } else {
            this.errorMes = "Create error";
            this.isError = true;
            await setTimeout((this.isError = false), 2000);
          }
        } catch (error) {
          this.errorMes = "Create error";
          console.log("Error uploading file: ", error);
        }
      } else if (this.selectAvatar === "") {
        this.validPhoto = true;
        this.sizePhoto = false;
      } else {
        this.sizePhoto = true;
        this.validPhoto = false;
        this.$refs.myFile.value = "";
        console.log((this.$refs.myFile.value = ""));
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
          this.isSuccess = true;
          await setTimeout(() => {
            this.isLoading = false;
            this.isSuccess = false;
          }, 2000);
        } else {
          this.errorMes = "Tranfer fail";
          this.isError = true;
          await setTimeout((this.isError = false), 2000);
        }
      } else if (this.inputAdressWallet == 0) {
        this.isLoading = false;
        this.errorMes = "address wallet invalid";
        this.isError = true;
        await setTimeout((this.isError = false), 2000);
      }
    },
    changeSelectedHero(id) {
      this.idSelect = id;
    },
  },
};
</script>
<style scoped>
.setTabActive {
  background: red;
}
.select {
  /* Reset Select */
  appearance: none;
  outline: 0;
  border: 0;
  box-shadow: none;
  /* Personalize */
  flex: 1;
  padding: 0 0;
  color: #fff;
  background-color: var(--darkgray);
  background-image: none;
  cursor: pointer;
}
/* Remove IE arrow */
select::-ms-expand {
  display: none;
}
/* Custom Select wrapper */
.select {
  position: relative;
  display: flex;
  width: 20em;
  /* height: 3em; */
  border-radius: .25em;
  overflow: hidden;
}
.select select {
  cursor: pointer;
}
/* Arrow */
.select::after {
  content: '\25BC';
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.7em;
  background-color: #34495e;
  transition: .25s all ease;
  pointer-events: none;
}
/* Transition */
.select:hover::after {
  color: #f39c12;
}
</style>
