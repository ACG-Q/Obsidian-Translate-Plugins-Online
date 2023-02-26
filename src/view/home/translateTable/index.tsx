import {css} from "@emotion/css";
import styled from "@emotion/styled";
import {Button, notification} from "antd";
import React, {FC, useEffect, useRef, useState} from "react";

import {CheckOutlined, FileOutlined, SelectOutlined, TranslationOutlined} from "@ant-design/icons";
import {exportJson, ImportFile} from "util/common/io";

interface ITranslateTable {
    translate?: string[];
    exportFile: (replace: { [key in string]: string }, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => void
    translateMap?: { [key in string]: string }
}

export const TranslateTable: FC<ITranslateTable> = ({translate, exportFile}) => {
    const translateRef = useRef<{ translate: { [key in string]: string } }>({translate: {}})
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [api, contextHolder] = notification.useNotification();
    const handleTextToInput = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>, key: string) => {
        let td = e.currentTarget;
        let textarea = document.createElement("textarea");
        let text = td.innerText;
        textarea.setAttribute("class", TextareaCss);
        textarea.setAttribute("rows", "0");
        textarea.onfocus = (event) => {
            event.preventDefault();
            let i = event.currentTarget as HTMLInputElement;
            i.value = text;
        };
        textarea.onblur = (event) => {
            let i = event.currentTarget as HTMLInputElement;
            let v = i.value;
            td.removeChild(i);
            td.innerText = v;
            translateRef.current.translate[key] = v
        };
        textarea.onkeydown = (event) => {
            if (event.key === "Enter") {
                let i = event.currentTarget as HTMLInputElement;
                let v = i.value;
                td.innerText = v;
                translateRef.current.translate[key] = v
            }
        };

        textarea.ondblclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };

        td.innerText = "";
        td.appendChild(textarea);
        textarea.focus();
    };

    const handleImportDictionary = () => {
        setIsLoading(true)
        ImportFile((result) => {
            api.open({
                message: "上传字典成功",
                description: "正在合并翻译字典",
                icon: <CheckOutlined style={{color: '#108ee9'}}/>
            })

            let translateMap = JSON.parse(result)
            let currentTranslateMap = translateRef.current.translate;

            // info: 已覆盖的形式合并字典
            for (let key in translateMap) {
                currentTranslateMap[key] = translateMap[key]
            }
            setIsLoading(false)
        })
    }

    const handleTranslate = () => {
        api.open({
            message: "暂未建设",
            description: "当前功能暂未完成...暂定为Bing Translate",
            icon: <TranslationOutlined style={{color: '#108ee9'}}/>
        })
    }

    useEffect(() => {
        let currentTranslateMap = translateRef.current.translate;
        translate?.forEach((v) => {
            currentTranslateMap[v] = v
        })
    }, [translate])

    return (
        <Container>
            {contextHolder}
            <ToolContainer hasBg>
                <span>工具栏</span>
                <Button type={"text"} icon={<TranslationOutlined/>} title={"翻译"} onClick={handleTranslate}/>
                <Button type={"text"} icon={<SelectOutlined/>} title={"导入翻译词典"} onClick={handleImportDictionary}/>
            </ToolContainer>
            <Table style={{height: 53}}>
                <Thead>
                    <Tr>
                        <Th>待翻译</Th>
                        <Th>手动修改</Th>
                    </Tr>
                </Thead>
            </Table>
            <ScrollbarContainer>
                <Table>
                    <Tbody>
                        {translate?.map((v, index) => (
                            <Tr key={index}>
                                <Td>{v}</Td>
                                <Td onDoubleClick={(e) => handleTextToInput(e, v)}>
                                    {(translateRef.current && translateRef.current.translate.hasOwnProperty(v)) ? translateRef.current.translate[v] : v}
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </ScrollbarContainer>
            <ToolContainer>
                <Button type={"primary"}
                        onClick={() => exportJson(translateRef.current.translate, `translate_dictionary.json`)}
                        icon={<TranslationOutlined/>}>导出词典</Button>
                <Button type={"primary"} onClick={() => exportFile(translateRef.current.translate, setIsLoading)}
                        loading={isLoading} icon={<FileOutlined/>}>导出文件</Button>
            </ToolContainer>
        </Container>
    );
};

const Container = styled.div``;

const ToolContainer = styled.div<{ hasBg?: boolean }>`

  border-radius: 5px;

  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 10px;

  & > :not(:last-child) {
    margin-right: 10px;
  }

  &:hover {
    background-color: ${({hasBg}) => hasBg ? "#f9f9f9" : null}
  }

  margin-bottom: 2px;
  user-select: none;
`

const ScrollbarContainer = styled.div`
  height: 600px;
  overflow: auto;

  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px;
  }

  &::-webkit-scrollbar-button {
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.3);
  }

  &::-webkit-scrollbar-track {
    background: #ffffff;
  }
`;

const Table = styled.table`
  width: 100%;
  text-align: start;
  border-radius: 8px 8px 0 0;
  border-collapse: separate;
  border-spacing: 0;

  display: table;
  box-sizing: border-box;
  text-indent: initial;
  border-color: grey;
`;

const Thead = styled.thead`
  position: fixed;
`;

const Th = styled.th`
  position: relative;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 600;
  text-align: start;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s ease;
  padding: 16px;
  overflow-wrap: break-word;
  box-sizing: border-box;

  &::before {
    position: absolute;
    top: 50%;
    inset-inline-end: 0;
    width: 1px;
    height: 1.6em;
    background-color: #f0f0f0;
    transform: translateY(-50%);
    transition: background-color 0.2s;
    content: "";
  }

  width: 50vw;
`;

const Tbody = styled.tbody`
  box-sizing: border-box;

  &::-webkit-scrollbar {
    overflow-y: scroll;
  }
`;

const Tr = styled.tr`
  &:hover {
    background: #fafafa;
  }

  box-sizing: border-box;

  display: block;
`;

const Td = styled.td`
  transition: background 0.2s, border-color 0.2s;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  padding: 16px;
  overflow-wrap: break-word;
  box-sizing: border-box;
  margin: 0;

  width: 50vw;
`;

const TextareaCss = css`
  padding: 0;
  border: none;
  width: 100%;
  font-size: 15px;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
  "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
  "Helvetica Neue", sans-serif;
  line-height: inherit;
  outline: none;
  resize: none;
  background-color: transparent;
  overflow: auto;
  max-height: 300px;
  color: rgba(0, 0, 0, 0.88);

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    background-color: #c3c3c3;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;
