import React from 'react'
import {
	Layout,
	PageBuilder,
	SEOHead
} from '@/components'

import { GetServerSideProps } from 'next';
import { pageService } from '@/services/page.service';
import { _Object } from '@/utils/types';
import HeroBanner from '@/components/hero-banner';
import { listService } from '@/services/venue.service';

export const getServerSideProps: GetServerSideProps = async () => {
	try {
		const pageData: _Object = await pageService.getPageBuilderElements('/home');
		const locations: _Object = await listService.getLocations();
		const occasions: _Object = await listService.getOccasions();

		return {
			props: {
				pageData,
				locations,
				occasions
			}
		};
	} catch (error) {
		console.error('Error fetching data for page, locations, or occasions:', error);
		return {
			props: {
				pageData: {},
				locations: [],
				occasions: []
			}
		};
	}
};

const Home = (props: _Object) => {
	return (
		<>
			<Layout {...props}>
				<SEOHead seo={props.pageData.seo || ''} />
				<HeroBanner props={props} />
				<PageBuilder props={props.pageData} />
			</Layout >
		</>
	)
}

export default Home

