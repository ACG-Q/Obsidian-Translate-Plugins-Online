import styled from "@emotion/styled";
import React, {FC, useEffect, useRef, useState} from "react";

import {HomeOutlined, InboxOutlined, RollbackOutlined,} from "@ant-design/icons";
import {Button, message, Spin} from "antd";
import {TranslateTable} from "view/Home/translateTable";
import {exportJavascript} from "util/common/io";

interface IMainRef {
    files: File[];
    translate: string[];
}

export const Home: FC = () => {
    const uploadRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const mainRef = useRef<IMainRef>({files: [], translate: []});

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [step, setStep] = useState<number>(0);

    // 拖拽上传事件
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleEvent = (event: DragEvent) => {
        // 阻止事件的默认行为
        event.preventDefault();
        if (event.type === "drop" && !!event.dataTransfer) {
            let files = event.dataTransfer.items;
            if (files.length > 0) {
                for (let file of files) {
                    if (
                        file.kind === "file" &&
                        file.webkitGetAsEntry()?.isFile
                    ) {
                        let file_ = file.getAsFile();
                        if (file_ && file_.name.match(/main/) !== null) {
                            // 把文件保存到文件数组中
                            mainRef.current.files.push(file_);
                            message.success(`找到${file_.name}`);
                            handleMainFile(file_);
                        }
                    }
                }
            }
        }
    };

    const handleMainFile = (file: File, replace?: { [key in string]: string }, set?: React.Dispatch<React.SetStateAction<boolean>>) => {
        set && set(true)
        // 提取代码段
        let matchCode = new RegExp(
            "(title|message|setName|setDesc|subtitle|text|description|createTitle|name|setTooltip)[:(]+s*(\".*?\"|'.*?'|`.*?`)",
            "g"
        );
        // 提取字符串
        let extractText = new RegExp("[:(]+s*(\"(.*?)\"|'(.*?)'|`(.*?)`)", "g");

        // 创建文件对象
        let reader = new FileReader();
        // 文件转为文件流
        reader.readAsText(file, "UTF-8");
        // 文件读取完成，根据类型不同显示不同的图标
        reader.onload = (e: ProgressEvent<FileReader>) => {
            let result = e.target?.result;
            if (result && !replace) {
                result = result.toString();
                let matchArray = result.matchAll(matchCode);
                for (let match of matchArray) {
                    let s = match[0];
                    let ex = extractText.exec(s);
                    if (ex && ex![2] && ex![2] !== null && ex![2] !== "") { // 双引号
                        mainRef.current.translate.push(ex![2]);
                    }else if(ex && ex![3] && ex![3] !== null && ex![3] !== "") { // 单引号
                        mainRef.current.translate.push(ex![3]);
                    }else if(ex && ex![4] && ex![4] !== null && ex![4] !== "") { // 转义符
                        mainRef.current.translate.push(ex![4]);
                    }
                }
                setStep(1);
            }

            if (result && replace) {
                let r = result as string
                for (let key in replace) {
                    r = r.replace(key, replace[key])
                }
                exportJavascript(r, "main.js")
            }
            set && set(false)
        };
        reader.onloadstart = () => setIsLoading(true);
        reader.onloadend = () => setIsLoading(false);
    };

    const handleInputFileChange: React.ReactEventHandler<HTMLInputElement> = (
        e
    ) => {
        let files = e.currentTarget.files;
        if (files && files.length > 0) {
            for (let file of files) {
                if (file && file.name.match(/main/) !== null) {
                    // 把文件保存到文件数组中
                    mainRef.current.files.push(file);
                    message.success(`找到${file.name}`);
                    handleMainFile(file);
                }
            }
        }
    };

    useEffect(() => {
        if (uploadRef.current) {
            let upload = uploadRef.current;
            upload.addEventListener("drop", handleEvent);
            upload.addEventListener("dragenter", handleEvent);
            upload.addEventListener("dragover", handleEvent);
            upload.addEventListener("dragleave", handleEvent);
        }
        return () => {
            if (uploadRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                let upload = uploadRef.current;
                upload.removeEventListener("drop", handleEvent);
                upload.removeEventListener("dragenter", handleEvent);
                upload.removeEventListener("dragover", handleEvent);
                upload.removeEventListener("dragleave", handleEvent);
            }
        };
    }, [handleEvent]);

    return (
        <Container>
            <Header>
                <HeaderLeft>
                    <H1>Obsidian 插件汉化</H1>
                </HeaderLeft>
                <HeaderRight>
                    <Button
                        type={"text"}
                        icon={<HomeOutlined/>}
                        onClick={() => window.location.reload()}
                    />
                    <Button
                        type={"text"}
                        icon={<RollbackOutlined/>}
                        onClick={() => window.history.go(-1)}
                    />
                </HeaderRight>
            </Header>
            {step === 0 &&
                (isLoading ? (
                    <Spin/>
                ) : (
                    <UploadContainer
                        ref={uploadRef}
                        onClick={() => inputRef.current?.click()}>
                        <UploadIcon>
                            <InboxOutlined/>
                        </UploadIcon>
                        <UploadTitle>
                            单击或拖动 <code>main.js</code> 到此区域进行上传
                        </UploadTitle>
                        <UploadDesc>
                            仅支持单次. 严禁上传公司数据或其他频段文件.
                        </UploadDesc>
                        <UploadInput
                            ref={inputRef}
                            type="file"
                            name=""
                            id="file"
                            onChange={handleInputFileChange}
                        />
                    </UploadContainer>
                ))}
            {step === 1 ? (
                <TranslateTable translate={mainRef.current.translate}
                                exportFile={(replace, setIsLoading) => handleMainFile(mainRef.current.files[0], replace, setIsLoading)}/>
            ) : null}
        </Container>
    );
};

const Container = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 800px;
  width: 80vw;
`;

const HeaderLeft = styled.div`
  display: flex;
`;

const HeaderRight = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

const H1 = styled.h1`
  user-select: none;
`;

const UploadContainer = styled.div`
  border: 1px dashed #dedede;
  border-radius: 10px;

  &:hover {
    border: 1px dashed #4482ff;
  }

  min-width: 800px;
  width: 80vw;
  height: 200px;
  box-sizing: border-box;
  padding: 10px;

  text-align: center;
  user-select: none;
`;

const UploadIcon = styled.div`
  color: #1677ff;
  font-size: 48px;
`;

const UploadTitle = styled.div`
  margin: 0 0 4px;
  color: rgba(0, 0, 0, 0.88);
  font-size: 16px;
`;

const UploadDesc = styled.div`
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
`;

const UploadInput = styled.input`
  display: none;
`;
