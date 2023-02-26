import React, {FC, useRef} from "react";
import {Button, Col, Collapse, Drawer, Input, Row, Select} from "antd";
import styled from "@emotion/styled";
import {useSession} from "util/common/useSession";
import {ITranslate as BaiduTranslate} from "util/translate/baidu";

const { Panel } = Collapse;

interface ISettingSideProps {
    open?: boolean;
    onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
}

interface IToken {
    bingTranslate?: IBingTranslate,
    baiduTranslate?: BaiduTranslate
}

interface IBingTranslate {

}

// 目标语言
const TOLANGUAGE: string = "toLang"

export const SettingSide:FC<ISettingSideProps> = ({open, onClose}) => {

    const {settings, setSettings, setLocalStorage, getLocalStorage} = useSession()

    const settingRef = useRef<IToken>(Object.create(null))

    const handleChangeLanguage = (v:string) => {
        setSettings({...settings, ...{[TOLANGUAGE]: v}})
    }

    return <Container>
        <Drawer
            title={"设置"}
            {...{open,onClose}}
            // size={"large"}
        >
            <Collapse defaultActiveKey={['1']} style={{marginBottom: "10px"}}>
                <MyPanel header="基础设置" key="1" extra={<span>22w</span>}>
                    <Row>
                        <Col span={8} style={{lineHeight: "32px"}}>目标语言</Col>
                        <Col span={16}>
                            <Select
                                defaultValue={settings?.toLang || "zh-cn"}
                                style={{ width: "100%" }}
                                onChange={handleChangeLanguage}
                                options={[
                                    { value: 'zh-cn', label: '中文(简体)' },
                                    { value: 'zh-tw', label: '中文(繁体)' },
                                ]}
                            />
                        </Col>
                    </Row>
                </MyPanel>
            </Collapse>
            <Collapse>
                <MyPanel header="设置必应密钥" key="bingTranslate" extra={<span>BingTranslate</span>}>
                    <Row>
                        <Col span={8} style={{lineHeight: "32px"}}>目标语言</Col>
                        <Col span={16}>
                            <Input placeholder={"输入密钥"} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} style={{lineHeight: "32px"}}>目标语言</Col>
                        <Col span={16}>
                            <Input placeholder={"输入密钥"} />
                        </Col>
                    </Row>
                    <Row>
                        <Button type={"primary"} onClick={()=>{
                            // setLocalStorage()
                        }
                        }>确定</Button>
                    </Row>
                </MyPanel>
                <MyPanel header="设置百度密钥" key="baiduTranslate" extra={<span><a href={"https://fanyi-api.baidu.com/doc/21"} target={"_blank"}>BaiduTranslate</a></span>}>
                    <Row>
                        <Col span={8} style={{lineHeight: "32px"}}>appid</Col>
                        <Col span={16}>
                            <Input placeholder={"输入Appid"} onChange={(ev)=>{
                                !settingRef.current.baiduTranslate && (settingRef.current.baiduTranslate = {
                                    appid: "",
                                    key: ""
                                })

                                settingRef.current.baiduTranslate!.appid = ev.target.value
                            }}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} style={{lineHeight: "32px"}}>Key</Col>
                        <Col span={16}>
                            <Input placeholder={"输入密钥"} onChange={(ev)=>{
                                !settingRef.current.baiduTranslate && (settingRef.current.baiduTranslate = {
                                    appid: "",
                                    key: ""
                                })

                                settingRef.current.baiduTranslate!.key = ev.target.value
                            }}/>
                        </Col>
                    </Row>
                    <Row>
                        <Button type={"primary"}>确定</Button>
                        <Button type={"dashed"}>测试</Button>
                    </Row>
                </MyPanel>
            </Collapse>
        </Drawer>
    </Container>
  
}

const Container = styled.div`

`

const MyPanel = styled(Panel)`
  .ant-collapse-content-box>.ant-row:not(:last-child) {
    margin-bottom: 10px!important;
  }
`

