import React from 'react'
import { _Object } from '@/utils/types'
import Link from 'next/link'
import { useRouter } from 'next/router'

export interface NavigationProps {
  items?: { label: string, path: string }[]
  layout: 'horizontal' | 'vertical'
  heading?: string
}

const Navigation = (props: NavigationProps) => {
  const router = useRouter()

  return (
    <>
      {props?.heading && <h6>{props?.heading}</h6>}
      <ul className={props?.layout === 'horizontal' ? 'nav' : 'list-unstyled'}>
        {props?.items?.map((item: _Object, i: number) =>
          <li className={`nav-item ${router.asPath === '/' ? `${router.asPath === item.path ? 'active' : ''}` : `${router.asPath}/` === item.path ? 'active' : ''}`} key={i}>
            <Link className="nav-link text-dark" href={item?.path}>{item?.label}</Link>
          </li>
        )}
      </ul>
    </>
  )
}
export default Navigation