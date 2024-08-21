import React from 'react'
import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import '../assets/scss/app.scss'
import '../assets/scss/main.scss'
import 'rsuite/dist/rsuite.min.css'

import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from '../redux/store'
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { LayoutProps } from '@/utils/types'
config.autoAddCss = false;

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js')
  }, [])

  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <ToastContainer
        toastStyle={{ backgroundColor: '#5A3483', color: '#ffff' }}
        autoClose={2000}
        pauseOnHover
      />
    </Provider>
  )
}

MyApp.getInitialProps = async () => {
  const pageProps: LayoutProps = {
    footer: {
      menus: []
    }

  }

  // const footer1 = await menuService.getNavigation('FOOTER1')
  // const footer2 = await menuService.getNavigation('FOOTER2')

  // if (footer1) { pageProps.footer.menus.push(footer1) }
  // if (footer2) { pageProps.footer.menus.push(footer2) }

  return { pageProps }
}

export default MyApp

