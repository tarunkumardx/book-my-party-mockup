/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Layout } from '@/components'
import Link from 'next/link';
import React from 'react'

const ComingSoon = () => {
	// eslint-disable-next-line indent
	return (
		<Layout>

			<div className="output bg-light coming-soon2 box my-5">
				<h3 className="text-center">COMING SOON</h3>
				<Link href={'/'}><button className="btn btn-primary">Back to Home</button></Link>
			</div>
			{/* <div className="d-flex justify-content-center align-items-center my-2">
				<Link href={'/'}><button className="btn btn-primary">Back to Home</button></Link>

			</div> */}

		</Layout>
	)
}

export default ComingSoon;