import React from 'react'

import { GetServerSideProps, GetServerSidePropsContext } from 'next'

import { _Object } from '@/utils/types'
import { pageService } from '@/services/page.service'
import PageTemplate from '@/templates/page'
import { Breadcrumb, Layout, PageBuilder, SEOHead } from '@/components'

export const getServerSideProps: GetServerSideProps = async ({ params }: GetServerSidePropsContext) => {
	try {
		const page = await pageService?.getPageBySlug(params?.slug as string) || {};
		const pageBuilder = await pageService.getPageBuilderElements(`/${params?.slug}`) || {};

		return {
			props: {
				page,
				pageBuilder
			}
		};
	} catch (error) {
		console.error('Error fetching page or page builder data:', error);
		return {
			props: {
				page: {},
				pageBuilder: {}
			}
		};
	}
};

const Page = (props: _Object) => {
	return (
		<>
			<Layout {...props}>
				<SEOHead seo={props.page.seo} />
				<section className="page-content-hero">
					<div className="container">
						<div className="row">
							<div className="col">
								<h1>
									{props?.page?.title || ''}
								</h1>
							</div>
						</div>
					</div>
				</section>
				<Breadcrumb
					data={
						[
							{
								label: props?.page.title,
								target: ''
							}
						]
					}
				/>
				<PageTemplate args={props.page} />
				<PageBuilder props={props.pageBuilder} />
			</Layout>
		</>

	)
}

export default Page
