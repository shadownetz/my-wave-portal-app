import { createStore , Store} from 'vuex'
import {InjectionKey} from "vue";
import createPersistedState from 'vuex-persistedstate'
import SecureLS from "secure-ls";
const ls = new SecureLS({ isCompression: false });

// define your typings for the store state
export interface State {
  accounts: Array<string>,
  contractAddress: string
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore({
  plugins: [createPersistedState({
        key: "my-wave-portal",
        storage: {
          getItem: key => ls.get(key),
          setItem: (key, value) => ls.set(key, value),
          removeItem: key => ls.remove(key)
        }
      }
  )],
  state: {
    accounts: [],
    contractAddress: "0x83510A6A88F57BB9C318B8FcC20bA6aF148AEfc1"
  },
  getters: {
    account: state => state.accounts.length>0?state.accounts[0]:"",
    accounts: state => state.accounts,
    contractAddress: state => state.contractAddress
  },
  mutations: {
    accounts: (state, payload)=> state.accounts=payload
  },
  actions: {
  },
  modules: {
  }
})
