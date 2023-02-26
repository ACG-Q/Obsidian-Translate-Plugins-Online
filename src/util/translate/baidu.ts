import {useRef} from "react";
import {MD5} from "crypto-js"

export interface ITranslate  {
    appid: string,
    key: string
}

export const useBaiduTranslate = () => {
    const ref = useRef<ITranslate>()

    // 通用翻译API
    const UniversalTranslationApi = "https://fanyi-api.baidu.com/api/trans/vip/translate"

    const signToken = (q: string, salt: string) => {
        // appid+q+salt+密钥
        // salt 随机数
        let appid = ref.current!.appid
        let key = ref.current!.key
        let string1 = appid + q + salt + key

        return MD5(string1)
    }

    const config = (appid:string,  key:string) => {
        ref.current = {appid, key}
    }

    const translate = (q:string, from: string, to: string) => {
        if(ref.current){
            let salt = Math.random().toString().split(".")[1]
            let sign = signToken(q, salt);
            // http://api.fanyi.baidu.com/api/trans/vip/translate?q=apple&from=en&to=zh&appid=2015063000000001&salt=1435660288&sign=f89f9594663708c1605f3d736d01d2d4
            let url = UniversalTranslationApi + "?" + JSON.stringify({
                q,
                from,
                to,
                appid: ref.current.appid,
                key: ref.current.key,
                salt,
                sign
            })
            return fetch(url).then(res=>res.json())
        }
    }

    return {
        config,
        translate
    }
}