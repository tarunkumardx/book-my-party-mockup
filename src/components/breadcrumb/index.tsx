import { _Object } from '@/utils/types';
import React from 'react'

const Breadcrumb = ({ data, className = '' }: _Object) => {
  return (
    <section className="breadcrumb-content">
      <div className={className.length > 0 ? `${className}` : 'container '}>
        <div className="row">
          <div className="col">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                {data && data?.map((item: _Object, i: number) => {
                  return (
                    <li key={i} className={`breadcrumb-item ${(data.length - i) === 1 ? 'active' : ''}`}>
                      {(data.length - i) === 1 ? item?.label : <a href={item.target}>{item?.label}</a>}
                    </li>)
                })}
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Breadcrumb;
