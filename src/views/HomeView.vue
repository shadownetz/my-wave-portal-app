<template>
    <div class="mainContainer">
        <div class="messagesContainer">
            <template v-if="waves.length > 0">
                <div class="usr-msg" v-for="(wave, idx) in waves" :key="idx">
                    <h5>👤 {{wave.address}}</h5>
                    <div class="content">
                        👋 {{wave.message}}
                        <span class="tmp">
                        {{wave.timestamp.toLocaleDateString()}}
                    </span>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="no-content">
                    <h4>
                        No one has sent a wave 😭
                    </h4>
                    <p>
                        <i>Send a 👋 wave and it will show up here</i>
                    </p>
                </div>
            </template>
        </div>
        <div class="dataContainer">
            <div class="header">
                👋 Hey there!
            </div>

            <div class="bio">
                I am Jude and I worked on a facial authentication system so that's pretty cool right?
                Connect your Ethereum wallet and wave at me!
            </div>

            <div class="waves-info">
                <h2>I have <span>{{waves.length}}</span> total waves</h2>
                <p v-html="txnOutput"></p>
            </div>

            <template v-if="accounts.length > 0">
                <div class="wave-msg">
                    <textarea v-model="waveMessage" placeholder="Send me a wave alongside your custom message"></textarea>
                </div>
                <button class="waveButton" @click=wave>
                    Wave at Me
                </button>
            </template>
            <button class="waveButton connect-btn" v-else @click=connectWallet>
                Connect wallet
            </button>


            <div id="loader-overlay" v-if="loading">
                <div class="loader">
                    <img src="../assets/images/loader.gif" alt="loader">
                    <p v-html="txnOutput"></p>
                </div>
            </div>
        </div>
    </div>
    <alert-dialog :error="error" :message="message"/>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import AlertDialog from "@/components/alertDialog.vue";
import {useStore} from "vuex";
import {key} from "@/store/index";
import * as ethers from 'ethers/lib.esm/ethers';
import contractABI from "@/utils/WavePortal.json";

class Wave{
    constructor(address: string, message: string, timestamp: Date) {
        this.address = address;
        this.message = message;
        this.timestamp = timestamp;
    }
    address: string
    message: string
    timestamp: Date


}

export default defineComponent({
    name: 'HomeView',
    components: {AlertDialog},
    setup(){
        const store = useStore(key);
        const error = ref(false);
        const message = ref("");
        const {ethereum} = window;
        const accounts = computed(()=>store.state.accounts);
        const totalWaves = ref(0);
        const loading = ref(false);
        const txnOutput = ref("");
        const waves = ref([] as Array<Wave>);
        const waveMessage = ref("");

        const showAlert = (_message: string)=>{
            error.value = !error.value;
            message.value = _message
        }

        const checkIfWalletIsConnected = ()=>{
            if(!ethereum){
                showAlert("Metemask not detected! Ensure you have MetaMask installed");
            }else{
                showAlert("Hurray! Metamask is installed")
            }
            return !!ethereum;
        }

        const connectWallet = async ()=>{
            if(ethereum){
                try{
                    let _accounts = await ethereum.request({ method: "eth_requestAccounts" });
                    store.commit('accounts', _accounts);
                    if(_accounts.value.length > 0){
                        showAlert(`Found account ${accounts.value[0]}`);
                    }else{
                        throw new Error("No Authorized account found")
                    }
                }catch (e: any){
                    showAlert(e.message);
                }
            }
        }

        const fetchTotalWaves = async ()=>{
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const wavePortalContract = new ethers.Contract(
                store.getters['contractAddress'],
                contractABI.abi,
                signer
            );
            let count = await wavePortalContract.getTotalWaves();
            totalWaves.value = count.toNumber();
        }

        const wave =  async ()=>{
            if(ethereum){
                loading.value = true;
                try{
                    txnOutput.value = "";
                    const provider = new ethers.providers.Web3Provider(ethereum);
                    const signer = provider.getSigner();
                    const wavePortalContract = new ethers.Contract(
                        store.getters['contractAddress'],
                        contractABI.abi,
                        signer
                    );
                    const waveTxn = await wavePortalContract.wave(waveMessage.value);
                    showAlert(`Mining... ${waveTxn.hash}`);
                    txnOutput.value = `Mining Transaction: View on etherscan <a href="https://rinkeby.etherscan.io/tx/${waveTxn.hash}" target="_blank">https://rinkeby.etherscan.io/tx/${waveTxn.hash}</a>`;
                    console.log(`Mining Transaction: View on etherscan <a href="https://rinkeby.etherscan.io/tx/${waveTxn.hash}" target="_blank">https://rinkeby.etherscan.io/tx/${waveTxn.hash}</a>`);


                    await waveTxn.wait();
                    showAlert(`Mined... ${waveTxn.hash}`);
                    txnOutput.value = `Mined Transaction: View on etherscan <a href="https://rinkeby.etherscan.io/tx/${waveTxn.hash}" target="_blank">https://rinkeby.etherscan.io/tx/${waveTxn.hash}</a>`;
                    console.log(`Mined Transaction: View on etherscan https://rinkeby.etherscan.io/tx/${waveTxn.hash}`);

                    // await fetchTotalWaves();
                    await getAllWaves();

                    waveMessage.value = "";

                }catch (e: any){
                    showAlert(e.message);
                }
                loading.value = false;
            }
        }

        const getAllWaves = async ()=>{
            const {ethereum} = window;
            if(ethereum){
                try{
                    const provider = new ethers.providers.Web3Provider(ethereum);
                    const signer = provider.getSigner();
                    const wavePortalContract = new ethers.Contract(
                        store.getters['contractAddress'],
                        contractABI.abi,
                        signer
                    );
                    const _waves = await wavePortalContract.getWavers();
                    waves.value = _waves.map((wave: any)=>{
                        return new Wave(
                            wave.waver,
                            wave.message,
                            new Date(wave.timestamp * 1000)
                        )
                    });

                    if(_waves.length > 0){
                        const msgsContainer = document.getElementsByClassName('messagesContainer');
                        if(msgsContainer.length > 0){
                            msgsContainer[0].animate({
                                scrollTop: msgsContainer[0].scrollHeight
                            }, 1000)
                        }
                    }
                }catch (e: any){
                    showAlert(e.message);
                }
            }
        }

        onMounted(()=>{
            const connected = checkIfWalletIsConnected();
            if(connected){
                // fetchTotalWaves();
                getAllWaves();
            }
        })

        return {
            wave,
            connectWallet,
            error,
            message,
            accounts,
            totalWaves,
            loading,
            txnOutput,
            waveMessage,
            waves
        }
    }
});
</script>

<style scoped>

@media screen and (min-width: 320px){
    .mainContainer {
        display: flex;
        width: 100%;
        margin-top: 64px;
        justify-content: center;
        flex-direction: column;
    }


    .dataContainer {
        display: flex;
        flex-direction: column;
        align-self: center;
        max-width: 600px;
        padding-top: 50px;
    }

    .header {
        text-align: center;
        font-size: 32px;
        font-weight: 600;
    }

    .bio {
        text-align: center;
        color: rgb(10,10,10);
        margin-top: 16px;
    }

    .waveButton {
        cursor: pointer;
        margin-top: 30px;
        padding: 8px;
        border: 0;
        border-radius: 5px;
        box-shadow: 1px 1px 3px #000000;
    }

    .connect-btn{
        background-color: rgba(240,171,41,1);
    }
    .waves-info h2,
    .waves-info p{
        text-align: center;
        word-wrap: break-word;
    }
    .waves-info span{
        color: rgb(30,200,30);
    }
    #loader-overlay{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        opacity: .8;
        background-color: #ffffff;
    }
    .loader{
        display: flex;
        justify-content: center;
        align-content: center;
        padding-top: 300px;
        flex-direction: column;
    }
    .loader img{
        width: 197px;
        height: 197px;
        align-self: center;
    }
    .loader p{
        align-self: center;
    }

    .wave-msg{
        width: inherit;
        height: 100px
    }
    .wave-msg textarea{
        width: 90%;
        height: 100%;
        resize: none;
        border-radius: 20px;
        border: 1px solid rgb(100,200,150);
        padding: 10px
    }
    .wave-msg textarea:focus-visible{
        border: 1px solid rgb(99, 198, 148)!important;
        box-shadow: 1px 1px 5px rgb(99, 199, 149), -1px -1px 5px rgb(99, 199, 149);
        outline: none;
    }
    .messagesContainer{
        order: 2;
        width: 90%;
        min-height: 300px;
        max-height: 400px;
        overflow: hidden auto;
        background-color: rgba(255,255,255,0.5);
        padding: 20px;
        border-radius: 20px;
        margin-top: 50px;
    }
    .usr-msg{
        display: flex;
        flex-direction: column;
    }
    .usr-msg:not(:first-child){
        margin-top: 20px
    }
    .usr-msg .content{
        position: relative;
        background-color: rgba(248, 248, 255, 0.98);
        width: 300px;
        min-height: 50px;
        padding: 10px;
        word-wrap: break-word;
        border-radius: 20px 20px 0 20px;
        box-shadow: 1px 1px 2px rgba(123, 104, 238, 0.99);
    }
    .usr-msg .content .tmp{
        display: block;
        position: absolute;
        bottom: -20px;
        right: -1px;
        width: 80%;
        min-height: 20px;
        border-radius: 10px 0 10px 10px;
        background-color: #b1d066;
        text-align: right;
        padding-right: 10px;
        color: #ffffff;
        text-shadow: 1px 1px 1px #000000;
    }
    .no-content{
        text-align: center;
    }
}

@media screen and (min-width: 1024px){
    .mainContainer {
        justify-content: center;
        width: 100%;
        flex-direction: row;
    }
    .dataContainer{
        order: 2;
        padding-top: 200px;
    }
    .messagesContainer{
        width: 30%;
        margin-right: 10%;
        max-height: 700px;
        margin-top: 0;
    }
}
</style>
