import React from 'react';
import { Layout } from '@/components';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { postService } from '@/services/post.service';
import { _Object } from '@/utils/types';
import PostTemplate from '@/templates/post';

export const getServerSideProps: GetServerSideProps = async ({ params }: GetServerSidePropsContext) => {
	try {
		const data = await postService.getPostBySlug(params?.slug as string);
		if (!data) {
			return {
				notFound: true
			};
		}
		return {
			props: {
				args: data
			}
		};
	} catch (error) {
		console.error('Error in getServerSideProps:', error);
		return {
			notFound: true
		};
	}
};

const BlogDetails = (props: _Object) => {
	return (
		<Layout {...props}>
			<PostTemplate args={props.args} type="link" />
		</Layout>
	)
}

export default BlogDetails