import { BigNumber, ethers } from "ethers";
import { HeroFiCT } from "../config";

class HeroFiAPI {
    public getAllHeroes = async (signer: ethers.providers.JsonRpcSigner) => {
        const HeroFi = await HeroFiCT(signer);
        return HeroFi.getAllHeroes();
    };
    public getHeroesOfAccount = async (
        signer: ethers.providers.JsonRpcSigner
    ) => {
        const HeroFi = await HeroFiCT(signer);
        return HeroFi.getHeroesOfAccount();
    };

    public createHero = async (
        signer: ethers.providers.JsonRpcSigner,
        data: CreateHero
    ) => {
        const HeroFi = await HeroFiCT(signer);
        return HeroFi.createHero(
            data.avatar,
            data.class,
            data.sex,
            data.generation,
            data.star
        );
    };

    public transferHero = async (
        signer: ethers.providers.JsonRpcSigner,
        toAccount: string,
        heroId: BigNumber
    ) => {
        const HeroFi = await HeroFiCT(signer);
        const currentAccount = await signer.getAddress();
        return await HeroFi.transferHero(currentAccount, toAccount, heroId);
    };
}

export default new HeroFiAPI();

export interface Heroes {
    avatar: string;
    class: number;
    generation: number;
    id: BigNumber;
    sex: number;
    star: number;
}
export class CreateHero {
    avatar?: string;
    class?: number;
    sex?: number;
    generation?: number;
    star?: number;

    constructor(
        avatar?: string,
        classs?: number,
        sex?: number,
        generation?: number,
        star?: number
    ) {
        this.avatar = avatar;
        this.class = classs;
        this.sex = sex;
        this.generation = generation;
        this.star = star;
    }
}
