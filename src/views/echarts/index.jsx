import React from 'react'
import styles from './index.module.css'
import { Col, Row, Statistic } from 'antd';
import CountUp from 'react-countup';



import { useRef } from 'react';

export default function Echarts() {
    //销量动画组件
    const formatter = (value) => <CountUp end={value} separator="," />;
  

 
    const centerBar = useRef()
    const option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar'
            }
        ]
    };

    return (
        <div className={styles.ecahrtsBox}>
            {/* //头部的线条 */}
            <div className={styles.titleechart}>
                电商数据大屏
            </div>
            <div className={styles.ecahrtsContene} >
                <div className={styles.left}>
                    <div style={{ margin: '20px' }}>
                        <div className={styles.leftTitel}>电商数据 <span style={{ fontWeight: 'normal' }}>Shell Data</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: "10px 0" }}><div>销量量</div><div>万元</div></div>
                        <div className={styles.sacleNumb}>
                            <Statistic valueStyle={{
                                color: '#ffffff', fontSize: '50px'
                            }} value={222888822} formatter={formatter} />
                        </div>
                        <div  >完成百分百</div>
                      
                    </div>

                </div>
                <div id='qqq' className={styles.center} ref={centerBar}>
                    11111
                </div>
                <div className={styles.right}></div>
            </div>
        </div>
    )
}
