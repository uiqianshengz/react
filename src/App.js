import React, { Suspense } from 'react'
import { useRoutes } from "react-router-dom";
import router from './router'
import { Spin } from 'antd';
export default function App() {
  return (
    <div>

      <Suspense fallback={<>loading.......</>}>

        {useRoutes(router)}

      </Suspense>
    </div>
  )
}
