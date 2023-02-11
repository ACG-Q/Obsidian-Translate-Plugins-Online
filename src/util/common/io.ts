type fileTypes = string | "text/javascript" | 'text/json' | 'application/json'

export const exportFile = (data: string, fileName: string, fileType: fileTypes) => {
    let blob = new Blob([data], {type: fileType}),
        a = document.createElement('a');

    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.dispatchEvent(new MouseEvent('click'));
}

type JsonType = object[] | object;

/**
 * 导出JSON文件
 * @param data Json数据 非字符串
 * @param fileName 导出的Json文件名
 * @return 无
 * */
export const exportJson = (data: JsonType, fileName: string) => {
    let exportData = JSON.stringify(data)
    exportFile(exportData, fileName, 'text/json')
}

/**
 * 导出JSON文件
 * @param data 字符串
 * @param fileName 导出的Json文件名
 * @return 无
 * */
export const exportJavascript = (data: string, fileName: string) => exportFile(data, fileName, 'text/javascript')


export const ImportFile = (onSuccess: (result: string) => void, fileType: fileTypes = "application/json") => {
    let i = document.createElement("input")
    i.setAttribute("type", "file")
    i.setAttribute("accept", fileType)
    i.onchange = (ev) => {
        let files = (ev.currentTarget as HTMLInputElement).files
        if (files) {
            let reader = new FileReader()
            for (let file of files) {
                reader.readAsText(file, "utf-8")
                reader.onload = (ev) => {
                    let result = ev.target?.result;
                    result && onSuccess(result.toString())
                }
            }
        }
    }
    i.click()
}