type JsonType = object[] | object;

/**
 * 导出JSON文件
 * @param data Json数据 非字符串
 * @param fileName 导出的Json文件名
 * @return 无
 * */
export const  exportJson = (data: JsonType, fileName: string) => {
    let exportData = JSON.stringify(data)
    let blob = new Blob([exportData], { type: 'text/json' }),
        a = document.createElement('a');

    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    a.dispatchEvent(new MouseEvent('click'));
}