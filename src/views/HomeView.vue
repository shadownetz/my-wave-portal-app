<template>
    <div class="mainContainer">
        <div class="dataContainer">
            <div class="header">
                👋 Hey there!
            </div>

            <div class="bio">
                I am Jude and I worked on a facial authentication system so that's pretty cool right?
                Connect your Ethereum wallet and wave at me!
            </div>

            <div class="waves-info">
                <h2>I have <span>{{totalWaves}}</span> total waves</h2>
                <p v-html="txnOutput"></p>
            </div>

            <button class="waveButton" @click=wave>
                Wave at Me
            </button>

            <button class="waveButton connect-btn" v-if="accounts.length <= 0" @click=connectWallet>
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
                    const waveTxn = await wavePortalContract.wave();
                    showAlert(`Mining... ${waveTxn.hash}`);
                    txnOutput.value = `Mining Transaction: View on etherscan <a href="https://rinkeby.etherscan.io/tx/${waveTxn.hash}" target="_blank">https://rinkeby.etherscan.io/tx/${waveTxn.hash}</a>`;
                    console.log(`Mining Transaction: View on etherscan <a href="https://rinkeby.etherscan.io/tx/${waveTxn.hash}" target="_blank">https://rinkeby.etherscan.io/tx/${waveTxn.hash}</a>`);


                    await waveTxn.wait();
                    showAlert(`Mined... ${waveTxn.hash}`);
                    txnOutput.value = `Mined Transaction: View on etherscan <a href="https://rinkeby.etherscan.io/tx/${waveTxn.hash}" target="_blank">https://rinkeby.etherscan.io/tx/${waveTxn.hash}</a>`;
                    console.log(`Mined Transaction: View on etherscan https://rinkeby.etherscan.io/tx/${waveTxn.hash}`);

                    await fetchTotalWaves();


                }catch (e: any){
                    showAlert(e.message);
                }
                loading.value = false;
            }
        }

        onMounted(()=>{
            const connected = checkIfWalletIsConnected();
            if(connected){
                fetchTotalWaves();
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
            txnOutput
        }
    }
});
</script>

<style scoped>
.mainContainer {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 64px;
}

.dataContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 600px;
    padding-top: 200px;
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
</style>
