

/**
 * 导出Javascript文件
 * @param data 字符串
 * @param fileName 导出的Json文件名
 * @return 无
 * */
export const  exportJavascript = (data: string, fileName: string) => {
    let blob = new Blob([data], { type: 'text/javascript' }),
        a = document.createElement('a');

    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/javascript', a.download, a.href].join(':');
    a.dispatchEvent(new MouseEvent('click'));
}