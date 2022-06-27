import React from 'react'
import top from '../../assets/images/top.webp'
import bottom from '../../assets/images/bottom.webp'

const Layout = ({ children }) => {
  return (
    <div className='bg-black relative max-w-[1920px] min-h-[1080px] xl:px-[170px] px-[50px] mx-auto z-20'>
      <img
        src={top}
        className='absolute top-0 right-0 z-10'
        alt='top'
        width={1462}
        height={668}
      />
      {children}
      <img
        src={bottom}
        className='absolute bottom-0 left-0'
        alt='bottom'
        width={1419}
        height={668}
      />
    </div>
  )
}

export default Layout
