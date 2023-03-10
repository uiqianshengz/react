import { Button, Form, Input, Popconfirm, Table, message, Modal, Upload } from 'antd';
import React, { useContext, useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import styles from './index.module.css'
const { confirm } = Modal;
const EditableContext = React.createContext(null);
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

// ????????????????????????
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('?????????????????????JPG/PNG!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('??????????????????2MB!');
  }
  return isJpgOrPng && isLt2M;
};


const SkuTable = forwardRef(({ skuData, sendSkuData }, ref) => {
  const arr = JSON.parse(JSON.stringify(skuData))
  arr && arr.forEach((item, index) => {
    item.lockStock = item.lockStock ? item.lockStock : 0
    item.lowStock = item.lowStock ? item.lowStock : 1000    //????????????
    item.price = item.price ? item.price : 0          // ??????  ?????? 0
    item.sale = item.sale ? item.sale : 0           // ??????
    item.skuCode = item.skuCode ? item.skuCode : "10000"    // sku ??????  ?????? 10000
    item.stock = item.stock ? item.stock : 0          // ??????
    item.key = index + 1
    item.pic = item.pic ? item.pic : ""
  })


  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    setDataSource(arr)
  }, [skuData])

  useImperativeHandle(ref, () => ({
    handleAdd: handleAdd,
  }))

  // ????????????
  const [upImgHeader] = useState({
    token: localStorage.getItem('token') ? localStorage.getItem('token') : ''
  })
  const handleChange = (info, index) => {
    if (info.file.status === 'done') {
      // let arr = [...dataSource]
      const arr2 = JSON.parse(JSON.stringify(dataSource))
      arr2[index].pic = info.file.response.data.fileUrl
      setDataSource(arr2)
    }
  };

  // ????????????
  const defaultColumns = [
    {
      title: '#',
      width: 50,
      dataIndex: 'key',
      key: 'key',
      fixed: 'left',
      align: 'center',
    },
    {

      title: '??????',
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
      title: '??????',
      dataIndex: 'color',
      key: 'key',
      width: 150,
      align: 'center',
      editable: true
    },
    {
      title: '??????',
      dataIndex: 'size',
      key: 'key',
      width: 150,
      align: 'center',
      editable: true
    },
    {
      title: '??????',
      dataIndex: 'stock',
      key: 'key',
      width: 150,
      align: 'center',
      editable: true
    },
    {
      title: '????????????',
      dataIndex: 'lowStock',
      key: 'key',
      width: 150,
      align: 'center',
      editable: true
    },
    {
      title: '????????????',
      dataIndex: 'lockStock',
      key: 'key',
      width: 150,
      align: 'center',
      editable: true
    },
    {
      title: 'sku??????',
      dataIndex: 'skuCode',
      key: 'key',
      width: 150,
      align: 'center',
      editable: true
    },
    {
      title: '??????',
      dataIndex: 'price',
      key: 'key',
      width: 150,
      align: 'center',
      editable: true
    },
    {
      title: '??????',
      dataIndex: 'sale',
      key: 'key',
      width: 150,
      align: 'center',
      editable: true,
      defaultValue: '??????'
    },
    {
      title: '??????',
      fixed: 'right',
      width: 100,
      dataIndex: 'operation',
      render: (_, record) => (
        <>
          <Button className={styles.deleteBtn} type="link" danger size='small' onClick={() => showConfirm(record)}>??????</Button>
        </>
      )
    },
  ];
  const handleAdd = (arr) => {
    if (dataSource.length === 0) {
      arr && arr.forEach((item, index) => {
        item.lockStock = 0
        item.lowStock = 1000    //????????????
        item.price = 0          // ??????  ?????? 0
        item.sale = 0           // ??????
        item.skuCode = "10000"    // sku ??????  ?????? 10000
        item.stock = 0          // ??????
        item.key = index + 1
        item.pic = item.pic ? item.pic : ""
      })
      setDataSource(arr)
    } else {
      const newData = []
      arr.forEach((item, index) => newData.push({
        color: item.color,
        key: dataSource.length + index + 1,
        lowStock: 1000,
        lockStock: 0,
        price: 0,
        sale: 0,
        size: item.size,
        skuCode: "10000",
        stock: 0
      }))
      setDataSource([...dataSource, ...newData]);
    }
  };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  // ???????????????????????????
  useEffect(() => {
    sendSkuData(dataSource)
  }, [dataSource])

  // ??????????????????     ==???    ???????????? sku ?????????????????????
  const showConfirm = (data) => {
    confirm({
      title: '??????',
      icon: <ExclamationCircleFilled />,
      content: '????????????sku?',
      closable: true,
      okText: "??????",
      cancelText: "??????",
      onOk() {
        const arr = JSON.parse(JSON.stringify(dataSource))
        const newData = arr.filter((item) => item.key !== data.key);
        newData.forEach((item, index) => item.key = index + 1)
        setDataSource(newData);
      },
      onCancel() {
        message.error('??????????????????')
      },
    });
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
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  if (dataSource.length === 0) return null
  return (
    <div>
      {/* <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        ??????
      </Button> */}
      <Table
        components={components}
        rowClassName={styles.editableRow}
        bordered
        dataSource={dataSource}
        columns={columns}
        scroll={{
          x: 1300,
        }}
      />
    </div>
  );
});
export default SkuTable;