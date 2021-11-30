<template lang="">
    <div class="address-picker" v-show="visible"  @click.stop :style="{height:height}">
        <ul class="address-picker__level">
            <li @click="checkLevel(0)"  :class="{'bg-white':level===0}">省份</li>
            <li @click="checkLevel(1)"  :class="{'bg-white':level===1}">城市</li>
            <li @click="checkLevel(2)"  :class="{'bg-white':level===2}">地区</li>
            <li @click="checkLevel(3)"  :class="{'bg-white':level===3}">街道</li>
        </ul>
        <div class="address-picker__selector">
            <ol  v-show="level === 0">
                <li @click="choiceProvince(province)"  v-for="province in provinceListComp" :key="province.code">{{province.name}}</li>
            </ol>

            <ol  v-show="level === 1">
                <li @click="choiceCity(city)"  v-for="city in cityListComp" :key="city.code">{{city.name}}</li>
            </ol>

            <ol  v-show="level === 2">
                <li @click="choiceArea(area)"  v-for="area in areaListComp" :key="area.code">{{area.name}}</li>
            </ol>

            <ol  v-show="level === 3">
                <li @click="choiceStreet(street)"  v-for="street in streetListComp" :key="street.code">{{street.name}}</li>
            </ol>
        </div>

    </div>
</template>
<script>

import {defineComponent,ref,computed,onMounted} from "vue"
import addressData from "./pcas"

export default defineComponent({
    props:{
        borderColor:{type:String,default:"#f1f2f6"},
        highlightBg:{type:String,default:"#ff4400"},
        width:{type:String,default:"100%"},
        height:{type:String,default:"300px"},
        visible:{type:Boolean,default:false},
        pickerLevel:{type:Number,default:4},
    },
    setup(props,{emit}){
        const addressInfoRef = ref({
            province: "",
            provinceCode:"",
            city: "",
            cityCode:"",
            area:"",
            areaCode:"",
            street:"",
            streetCode:""
        })
        const level = ref(0)
        
        const provinceListComp = computed(()=>{
            return addressData.map(item=>{
                return {
                    name:item.name,
                    code:item.code
                }
            })
        })

        const cityListComp = computed(()=>{
            if(addressInfoRef.value.provinceCode){
                return addressData.find(item=>item.code===addressInfoRef.value.provinceCode).children || [];
            }else{
                return [];
            }
        })
        const areaListComp = computed(()=>{
            if(addressInfoRef.value.cityCode){
                return cityListComp.value.find(item=>item.code===addressInfoRef.value.cityCode).children || [];
            }
        })

        const streetListComp = computed(()=>{
            if(addressInfoRef.value.areaCode){
                return areaListComp.value.find(item=>item.code===addressInfoRef.value.areaCode).children || [];
            }
        })

        const choiceProvince = (province) =>{
            addressInfoRef.value.province = province.name
            addressInfoRef.value.provinceCode = province.code
            addressInfoRef.value.city = ""
            addressInfoRef.value.cityCode = ""
            addressInfoRef.value.area = ""
            addressInfoRef.value.areaCode = ""
            addressInfoRef.value.street = ""
            addressInfoRef.value.streetCode = ""
            if(props.pickerLevel == 1){
                return emitChoice();
            }
            level.value = 1;
        }

        const choiceCity = (city) =>{
            addressInfoRef.value.city = city.name
            addressInfoRef.value.cityCode = city.code
            addressInfoRef.value.area = ""
            addressInfoRef.value.areaCode = ""
            addressInfoRef.value.street = ""
            addressInfoRef.value.streetCode = ""
            if(areaListComp.value.length === 0 || props.pickerLevel == 2){
                // 没有下级数据,为最终数据，触发事件
                return emitChoice()
            }
            level.value = 2;
        }

        const choiceArea = (area) =>{
            addressInfoRef.value.area = area.name
            addressInfoRef.value.areaCode = area.code
            addressInfoRef.value.street = ""
            addressInfoRef.value.streetCode = ""
            if(streetListComp.value.length === 0 || props.pickerLevel == 3){
                // 没有下级数据,为最终数据，触发事件
                return emitChoice()
            }
            level.value = 3;

        }

        const choiceStreet = (street) =>{
            addressInfoRef.value.street = street.name
            addressInfoRef.value.streetCode = street.code
            //emit 事件，关闭窗口
            emitChoice()    
        }

        
        

        const checkLevel = targetLevel=>{
            if(targetLevel > level.value){
                // 禁止越级向下切换
                return ;
            }else{
                switch(targetLevel){    // 每一级都会清空子级的数据
                    case 0:
                        addressInfoRef.value.province = ""
                        addressInfoRef.value.provinceCode = ""
                    case 1:
                        addressInfoRef.value.city = ""
                        addressInfoRef.value.cityCode = ""
                    case 2:
                        addressInfoRef.value.area = ""
                        addressInfoRef.value.areaCode = ""
                    case 3:
                        addressInfoRef.value.street = ""
                        addressInfoRef.value.streetCode = ""
                }
                level.value = targetLevel
            }
        }

        const emitClose = () =>{
            checkLevel(0);
            emit('close')
        }

        const emitChoice = () =>{
            const emitData= {};

            switch(props.pickerLevel){
                case 4:
                    emitData.street = addressInfoRef.value.street;
                case 3:
                    emitData.area = addressInfoRef.value.area;
                case 2:
                    emitData.city = addressInfoRef.value.city;
                case 1:
                    emitData.province = addressInfoRef.value.province;
            }
            emit('choice',emitData)
            emitClose()
        }


        onMounted(()=>{
            document.body.addEventListener("click",(e)=>{
                emitClose();
            })
        })

        return {
            addressInfoRef,
            level,
            addressData,
            provinceListComp,
            cityListComp,
            areaListComp,
            streetListComp,
            choiceProvince,
            choiceCity,
            choiceArea,
            choiceStreet,
            checkLevel,

        }
    }
})
</script>
<style lang="less" scoped>
    .address-picker{
        border:1px solid v-bind(borderColor);
        height:0;
        width:v-bind(width);
        overflow: hidden;
        display:flex;
        flex-direction: column;
        transition:all .3s;
        z-index:4001;
        background:#fff;
        .address-picker__level{
            display:flex;
            border-bottom:1px solid v-bind(borderColor);
            background: v-bind(borderColor);
            text-align:center;
            height:50px;
            li{
                flex:1;
                cursor:pointer;
            }
        }

        .address-picker__selector{
            height:calc(v-bind(height) - 50px);
            ol{
                width:v-bind(width);
                height:100%;
                transition:all .3s;
                overflow-y:scroll;
                li{
                    cursor: pointer;
                    padding:0 20px;
                    &:hover{
                        background:v-bind(highlightBg);
                        color:#fff
                    }
                }
            }
        }

    }

</style>