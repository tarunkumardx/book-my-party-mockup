import React, { useEffect, useState } from 'react';
import { Breadcrumb, Layout, SEOHead } from '@/components';
import { _Object } from '@/utils/types';
import { postService } from '@/services/post.service';
import PostTemplate from '@/templates/post';
import { GetStaticProps } from 'next';
import { Button } from '@/stories/form-inputs';

export const getStaticProps: GetStaticProps = async () => {
  const data = await postService.getAll()

  return {
    props: {
      data
    }
  }
}

const Blogs = (props: _Object) => {
  const [posts, setPost] = useState<_Object>(props?.data)
  const [endCursor, setEndCursor] = useState<string>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (loading) {
      postService.getAll(endCursor).then((data: _Object) => {
        setPost({ nodes: [...posts.nodes, ...data.nodes], pageInfo: data.pageInfo })
        setLoading(false)
      })
    }
  }, [endCursor])

  const loadMore = () => {
    setLoading(true)
    setEndCursor(posts.pageInfo.endCursor)
  }

  return (
    <Layout {...props}>
      <SEOHead seo={{ title: 'Our Latest Blogs - Book My Party', metaDesc: 'Discovеr еndlеss party inspiration & planning tips at our blog sеction. Your go-to rеsourcе for crеating mеmorablе еvеnts. Chеck thе ultimatе cеlеbration guidе now!' }} />
      <section className="page-content-hero pie-container">
        <div className="container">
          <div className="row">
            <div className="col">
              <h1>
								Blog
              </h1>
            </div>
          </div>
        </div>
      </section>
      <Breadcrumb
        className="container pie-container"
        data={
          [
            {
              label: 'Blog',
              target: ''
            }
          ]
        }
      />
      <section className="blog-listing pie-container">
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3">
            {posts?.nodes?.map((item: _Object, i: number) => {
              return (
                <div className="col" key={i} >
                  <PostTemplate args={item} type="list" short="false" />
                </div>
              )
            })}
          </div>
          {posts?.pageInfo?.hasNextPage &&
						<Button label="Load More" loading={loading} onClick={loadMore} className="primary mx-auto mt-5" />
          }
        </div>
      </section>
    </Layout>
  )
}

export default Blogs