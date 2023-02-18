import React from 'react'
import echarts from "echarts"
import styles from './index.module.css'
import ReactCanvasNest from 'react-canvas-nest'

export default function Echarts() {
  return (
      <div   className={styles.echartsBox}>
      <ReactCanvasNest
      config={{
            pointColor: ' 255, 255, 255 ',
            lineColor: '255,255,255',
            pointOpacity: 0.5,
            pointR: 2,
            count:100
        }}>
      </ReactCanvasNest>
      </div>
  )
}
