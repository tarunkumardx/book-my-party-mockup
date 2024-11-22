/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react'

import { _Object } from '@/utils/types'

import Link from 'next/link'
import Image from 'next/image'
import { truncateText } from '@/utils/helpers'
import { Breadcrumb, SEOHead } from '@/components'
import { postService } from '@/services/post.service'
import { calender } from '@/assets/images'
import moment from 'moment'
import { useRouter } from 'next/router'

const PostTemplate = ({ args, type, short }: _Object) => {
  const router: _Object = useRouter();

  const [recentPosts, setRecentPosts] = useState<_Object>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function name() {
      setLoading(true)
      const { data } = await postService.getRecentPosts()
      setRecentPosts(data.posts.edges)
      setLoading(false)
    }

    if (router?.query?.slug) {
      name()
    }
  }, [])

  return (
    <>
      {router.query.slug && <SEOHead seo={args?.seo} />}
      {type === 'list' ?
        <div className="card blog-post">
          <div className="img-wrapper">
            <Link href={`/blog/${args.slug}`}>
              <Image src={args?.featuredImage?.node?.mediaItemUrl} width="458" height="302" alt="" />
            </Link>
          </div>
          <div className="card-body">
            <h3>
              <Link href={`/blog/${args.slug}`}>
                {args?.title}
              </Link>
            </h3>
            {short === 'true' ? <Link className="btn btn-link" href={`/blog/${args.slug}`}>Read More</Link> : <div dangerouslySetInnerHTML={{ __html: truncateText(args.content || '', 20) }} />}
          </div>
        </div>
        :
        <>
          <section className="page-content-hero pie-container">
            <div className="container">
              <div className="row">
                <div className="col">
                  <h1>
                    {args.title}
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
                  target: '/blog'
                },
                {
                  label: args?.title || '',
                  target: ''
                }
              ]
            }
          />
          <section className="blog-single pie-container">
            <div className="container">
              <div className="row  gy-3">
                <div className="col-12 col-lg-8">
                  <div className="card">
                    <div className="card-body">
                      <div className="img-wrapper">
                        <Image src={args.featuredImage.node.mediaItemUrl} alt="" width={700} height={500} />
                      </div>
                      <div className="author-details">
                        <h4 className="main-head">{args.title}</h4>
                        <div className="justify-between">
                          <small>By: <b>{args.author.node.name}</b></small>
                          <small className="text-muted">
                            <Image src={calender} width={12} height={14} alt="" />&nbsp;{moment(args.date).format('DD MMM, YYYY')}</small>
                        </div>
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: args.content }} className="blog-content" />
                    </div>
                  </div>

                </div>
                <div className="col-12 col-lg-4">
                  <div className="card recent-post">
                    <div className="card-body">
                      <h4 className="border-bottom pb-2">
												Latest Posts
                      </h4>
                      <div className="row">
                        {
                          loading &&
													<div className="col-md-12 my-2">
													  <div className="row">
													    <div className="col-sm-4 placeholder-glow">
													      <p className="placeholder mb-0 thumbnail-img" style={{ width: '111px', height: '80px' }} />
													    </div>
													    <div className="col-sm-8">
													      <h6 className="mb-2 text-transform-none placeholder-glow">
													        <span className="placeholder w-100"></span>
													      </h6>
													      <p className="mb-0 placeholder-glow">
													        <span className="placeholder w-100"></span>
													        <span className="placeholder w-100"></span>
													      </p>
													    </div>
													  </div>
													</div>
                        }
                        <div className="col-md-12 my-2">
                          {
                            recentPosts?.map((item: _Object, i: number) => {
                              return (
                                <div key={i} className="row">
                                  <div className="col-sm-4">
                                    <Link href={`/blog/${item.node.slug}`}>
                                      <Image src={item.node.featuredImage.node.mediaItemUrl} width="111" height="80" alt="" className="w-100 thumbnail-img" />
                                    </Link>
                                  </div>
                                  <div className="col-sm-8">
                                    <h6 className="mb-2 text-transform-none">
                                      <Link href={`/blog/${item.node.slug}`} className="text-decoration-none ">{item.node.title}</Link>
                                    </h6>
                                    <div className="mb-0" dangerouslySetInnerHTML={{ __html: truncateText(item.node.content || '', 15) }} />
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      }
    </>
  )
}

export default PostTemplate
