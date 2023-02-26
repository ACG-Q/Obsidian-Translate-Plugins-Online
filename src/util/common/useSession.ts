import {useState} from "react";

interface ISettings {
    toLang: string
}

type Dictionary<T> = {[key in string]: T}

export const useSession = () => {
    const [settings, setSettings] = useState<ISettings>({toLang: ""})

    const setLocalStorage = (key:string, value:string) => {
        window.localStorage.setItem(key, value)
    }

    const getLocalStorage = (key:string):string|null => {
        return window.localStorage.getItem(key)
    }

    const removeLocalStorage = (key:string) => {
        window.localStorage.removeItem(key)
    }


    return {
        settings,
        setSettings,
        setLocalStorage,
        getLocalStorage,
        removeLocalStorage
    }
}