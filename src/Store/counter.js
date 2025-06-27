
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
    state: () => ({
        
        selected_data: null,
    }),
    actions: {
       
        addData(payload) {
            this.selected_data = payload
        }
    }
})