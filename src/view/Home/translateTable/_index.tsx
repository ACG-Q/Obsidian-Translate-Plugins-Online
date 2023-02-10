import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, InputRef, Spin } from "antd";
import { Form, Input, Table } from "antd";
import type { FormInstance } from "antd/es/form";
import styled from "@emotion/styled"
import { translate } from 'bing-translate-api';


const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: string;
    name: string;
    age: string;
    address: string;
}

interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log("Save failed:", errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}>
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingRight: 24 }}
                onClick={toggleEdit}>
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
    key: React.Key;
    ToBeTranslated: string;
    BingTranslate: string|false;
    ManualAdjustment: string;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

export const TranslateTable: React.FC = () => {
    const [dataSource, setDataSource] = useState<DataType[]>([
        {
            key: "0",
            ToBeTranslated: "Edward King 0",
            BingTranslate: "",
            ManualAdjustment: "Edward King 0",
        },
        {
            key: "1",
            ToBeTranslated: "Edward King 0",
            BingTranslate: "",
            ManualAdjustment: "Edward King 0",
        },
        {
            key: "2",
            ToBeTranslated: "Edward King 0",
            BingTranslate: "",
            ManualAdjustment: "Edward King 0",
        },
        {
            key: "3",
            ToBeTranslated: "Edward King 0",
            BingTranslate: "",
            ManualAdjustment: "Edward King 0",
        },
        {
            key: "4",
            ToBeTranslated: "Edward King 0",
            BingTranslate: "",
            ManualAdjustment: "Edward King 0",
        },
        {
            key: "5",
            ToBeTranslated: "Edward King 0",
            BingTranslate: "",
            ManualAdjustment: "Edward King 0",
        },
        {
            key: "6",
            ToBeTranslated: "Edward King 0",
            BingTranslate: "",
            ManualAdjustment: "Edward King 0",
        },
        {
            key: "7",
            ToBeTranslated: "Edward King 0",
            BingTranslate: "",
            ManualAdjustment: "Edward King 0",
        },
    ]);

    const [count, setCount] = useState(2);

    const handleDelete = (key: React.Key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };

    const defaultColumns: (ColumnTypes[number] & {
        editable?: boolean;
        dataIndex: string;
    })[] = [
        {
            title: "待翻译",
            dataIndex: "ToBeTranslated",
            width: "30%",
        },
        {
            title: "必应翻译",
            dataIndex: "BingTranslate",
            width: "30%",
            render: (value, record, index) => {
                return !value ? <Spin/> : <span>{value}</span>
            },
        },
        {
            title: "手动调整",
            dataIndex: "ManualAdjustment",
            editable: true,
        },
    ];

    const handleSave = (row: DataType) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: DataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    // https://ghproxy.net/https://raw.githubusercontent.com/plainheart/bing-translate-api/master/src/lang.json
    // const handleTranslate = async (v:DataType,to:string="zh-Hans") => {
    //     await translate(v.ToBeTranslated, null, to, true).then(res=>{
    //         console.log(res.translation);
    //         v.BingTranslate = res.translation;
    //         v.ManualAdjustment = res.translation;
    //     }).catch(e=>{
    //         v.BingTranslate = "";
    //     })
    //     return v
    // }

    const toTranslate = () => {
        for(let i =0;i < dataSource.length ; i++){
            let newDataSource = dataSource
            newDataSource[i].BingTranslate = false
            setDataSource(newDataSource)
            // translate(newDataSource[i].ToBeTranslated, null)
            // handleTranslate(newDataSource[i]).then(v=>{
            //     newDataSource[i] = v
            //     setDataSource(newDataSource)
            // })
        }
    }

    useEffect(()=>{
        // toTranslate()
    },[])

    return (
        <Container>
            <Table
                components={components}
                rowClassName={() => "editable-row"}
                bordered
                dataSource={dataSource}
                columns={columns as ColumnTypes}
            />
        </Container>
    );
};

const Container = styled.div`
    width: 80vw;
`;
