import Vue from 'rollup-plugin-vue'
// import less from "rollup-plugin-less"
import postcss from 'rollup-plugin-postcss'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
export default {
    input:"./src/main.js",
    external:["vue"],
    plugins:[
        Vue(),
        // less(),
        postcss(),
        babel({
            exclude: 'node_modules/**'
        }),
        terser(),
        serve({
            contentBase: '',  //服务器启动的文件夹，默认是项目根目录，需要在该文件下创建index.html
            port: 8020   //端口号，默认10001
        }),    
        livereload('./')   //watch dist目录，当目录中的文件发生变化时，刷新页面
    ],
    output:{
        file:"index.js",
        format:"esm",
        globals:{
            Vue:"Vue"
        }
    }
    
}