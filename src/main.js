import VueAddressPicker from "./components/VueAddressPicker/index.vue"

VueAddressPicker.install = (app) =>{
    app.component(VueAddressPicker.name,VueAddressPicker)
}

export default VueAddressPicker