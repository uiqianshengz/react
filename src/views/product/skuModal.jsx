import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Table, Modal, message, Upload } from 'antd';
import { PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import styles from './index.module.css'
import { updateSkuInfo, delSku, addProductSkus, getSku } from '../../untils/product'

const { confirm } = Modal;


// 请求图片前的函数
const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('图片格式必须为JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('图片不能超过2MB!');
    }
    return isJpgOrPng && isLt2M;
};


const EditableContext = React.createContext(null);
// 可编辑行
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};
const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);
    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };
    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({
                ...record,
                ...values,
            });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };
    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
            // rules={[
            //     {
            //         required: true,
            //         message: `${title} is required.`,
            //     },
            // ]}
            >
                <Input placeholder={title} ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className={styles.editableCellCalueWrap}
                style={{
                    paddingRight: 24,
                    height: "32px",
                    border: "1px solid #dcdfe6",
                    borderRadius: "5px",
                    lineHeight: "32px"
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};
const SkuModal = ({ skuData, skuId }) => {
    // 表格数据
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        setDataSource(skuData)
    }, [skuData])

    // const [count, setCount] = useState(skuData.length + 1);

    // 点击删除按钮     ==》    打开删除 sku 对话框相关内容
    const showConfirm = (data) => {
        confirm({
            title: '提示',
            icon: <ExclamationCircleFilled />,
            content: '是否删除sku?',
            closable: true,
            okText: "确认",
            cancelText: "取消",
            onOk() {
                const newData = dataSource.filter((item) => item.key !== data.key);
                setDataSource(newData);
                deleteSku(data.id)
            },
            onCancel() {
                message.error('您取消了删除')
            },
        });
    };
    // 删除请求
    const deleteSku = async (id) => {
        let res = await delSku(id)
        if (res.code === 20000) return message.success('删除成功')
    }


    const [upImgHeader] = useState({
        token: localStorage.getItem('token') ? localStorage.getItem('token') : ''
    })

    const handleChange = (info, index) => {
        if (info.file.status === 'done') {
            const arr = [...dataSource]
            arr[index].pic = info.file.response.data.fileUrl
            setDataSource(arr)
        }
    };


    // 表格内容
    const defaultColumns = [
        {
            title: 'id',
            width: 180,
            dataIndex: 'id',
            key: 'key',
            fixed: 'left',
            align: 'center',
        },
        {

            title: '图片',
            dataIndex: 'pic',
            key: 'key',
            width: 150,
            align: 'center',
            render: (_, data, index) => {
                return (
                    <Upload
                        headers={upImgHeader}
                        action="http://leju.bufan.cloud/lejuAdmin/material/uploadFileOss"
                        listType="picture-card"
                        maxCount={1}
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={(e) => handleChange(e, index)}
                    >
                        {data.pic ? (
                            <img
                                src={data.pic}
                                alt="avatar"
                                style={{
                                    width: '100%',
                                    height: "100%"
                                }}
                            />
                        ) : (
                            <PlusOutlined />
                        )}
                    </Upload>
                )
            }
        },
        {
            title: '颜色',
            dataIndex: 'color',
            key: 'key',
            width: 150,
            align: 'center',
            editable: true
        },
        {
            title: '大小',
            dataIndex: 'size',
            key: 'key',
            width: 150,
            align: 'center',
            editable: true
        },
        {
            title: '库存',
            dataIndex: 'stock',
            key: 'key',
            width: 150,
            align: 'center',
            editable: true
        },
        {
            title: '预警库存',
            dataIndex: 'lowStock',
            key: 'key',
            width: 150,
            align: 'center',
            editable: true
        },
        {
            title: '锁定库存',
            dataIndex: 'lockStock',
            key: 'key',
            width: 150,
            align: 'center',
            editable: true
        },
        {
            title: 'sku编码',
            dataIndex: 'skuCode',
            key: 'key',
            width: 150,
            align: 'center',
            editable: true
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'key',
            width: 150,
            align: 'center',
            editable: true
        },
        {
            title: '销量',
            dataIndex: 'sale',
            key: 'key',
            width: 150,
            align: 'center',
            editable: true,
            defaultValue: '销量'
        },
        {
            title: '操作',
            fixed: 'right',
            width: 100,
            dataIndex: 'operation',
            render: (_, record) => (
                <>
                    <Button className={styles.editBtn} type="link" size='small' onClick={() => handleSave(record)}>保存</Button>
                    <Button className={styles.deleteBtn} type="link" danger size='small' onClick={() => showConfirm(record)}>删除</Button>
                </>
            )
        },
    ];

    // 新增按钮的点击事件
    const handleAdd = () => {
        const newData = {
            id: ``,
            pic: ``,        // 图片
            color: '',      // 颜色
            size: ``,       // 大小
            stock: '',      // 库存
            lowStock: ``,   // 预警库存
            lockStock: '',  // 锁定库存
            skuCode: ``,    // sku编码
            price: '',      // 价格
            sale: ``,       // 销量
            productId: skuId,
            key: dataSource.length + 1
        };
        addSku(newData, skuId)


    };
    // 新增 sku 的请求
    const addSku = async (data, skuId) => {
        await addProductSkus(data)
        let res1 = await getSku(skuId)
        let arr = res1.data.items
        arr = arr.map(item => {
            let aa = dataSource.filter(item1 => item1.id === item.id)
            if (aa.length) {
                item = aa[0]
            }
            return item
        })
        arr.forEach((item, index) => item.key = index + 1)
        setDataSource(arr)
    }

    // 保存事件 --- 自动保存    ==》    发送修改数据的请求
    const handleSave = (row) => {
        const newData = [...dataSource];
        // 找到改动项的行数
        const index = newData.findIndex((item) => row.key === item.key);
        // 提取改动行的数据
        const item = newData[index];
        const spData = JSON.stringify([
            { key: '颜色', value: row.color },
            { key: '大小', value: row.size },
        ])
        row.spData = spData
        // 改动数据
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        for (const key in row) {
            if (!row[key]) {
                row[key] = ""
            }
        }
        if (row.lockStock === "") row.lockStock = 0
        if (row.lowStock === "") row.lowStock = 0
        if (row.price === "") row.price = 0
        if (row.promotionPrice === "") row.promotionPrice = 0
        if (row.sale === "") row.sale = 0
        if (row.stock === "") row.stock = 0
        setDataSource(newData);
        upDateSku(row)
    };

    const upDateSku = async (data) => {
        await updateSkuInfo(data)
    }

    // 表格相关
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
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    return (
        <div>
            <Button
                onClick={handleAdd}
                type="primary"
                style={{
                    float: "right",
                    marginBottom: 16,
                }}
            >
                新增
            </Button>
            <Table
                components={components}
                rowClassName={styles.editableRow}
                bordered
                dataSource={dataSource}
                columns={columns}
                scroll={{
                    x: 1300,
                }}
                pagination={false}
            />
        </div>
    );
};
export default SkuModal;