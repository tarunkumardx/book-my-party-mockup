import * as React from 'react'

import { Enquiry, Header } from '..'
import Footer from '../footer'
import { _Object } from '@/utils/types'

type DashboardLayoutProps = {
	children?: React.ReactNode,
	footer?: _Object
}

const Layout = ({ footer, children }: DashboardLayoutProps) => {
  return (
    <>
      <Header />
      {children}
      <Footer {...footer || {}} />
      {/* <div className="phone">
				<Link href="tel:+91%2098180%2000526">
					<Image src={MassesIcon} width="40" height="40" alt="Masses Icon" />
				</Link>
			</div> */}

      <Enquiry />
    </>
  )
}

export default Layout
