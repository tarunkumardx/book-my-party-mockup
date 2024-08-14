import React from 'react';
import { Layout } from '@/components';
import { GetStaticPaths, GetStaticProps } from 'next';
import { postService } from '@/services/post.service';
import { _Object } from '@/utils/types';
import PostTemplate from '@/templates/post';

export const getStaticPaths: GetStaticPaths = async () => {
  const data: _Object = await postService.getAllPosts()

  const paths = data?.map((item: _Object) => ({ params: { slug: item.slug } }));

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: _Object) => {
  const data = await postService.getPostBySlug(params.slug)

  return {
    props: {
      args: data
    }
  }
}

const BlogDetails = (props: _Object) => {
  return (
    <Layout {...props}>
      <PostTemplate args={props.args} type="link" />
    </Layout>
  )
}

export default BlogDetails