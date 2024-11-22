import React from 'react'
import { _Object } from '@/utils/types';

const FAQs = (props: _Object) => {
  const divideArray = (array: _Object) => {
    const midIndex = Math.floor(array?.length / 2);
    const firstArray = array?.slice(0, midIndex);
    const secondArray = array?.slice(midIndex);
    return [firstArray, secondArray];
  }

  const [firstHalf, secondHalf] = divideArray(props?.items?.listItems);

  return (
    <section className="faqs-listing">
      <div className="container">
        <div className="row accordion accordion-flush gx-lg-5" id="accordionFlushFaqsListing">

          <div className="col-12 col-lg-6">
            {firstHalf?.map((item: _Object, i: number) => {
              return (
                <div key={i} className="accordion-item">
                  <h2 className="accordion-header" id={`flush-headingsSecond${i}`}>
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapseSecond${i}`} aria-expanded="true" aria-controls={`flush-collapseSecond${i}`}>
                      {item.question}
                    </button>
                  </h2>
                  <div id={`flush-collapseSecond${i}`} className="accordion-collapse collapse" aria-labelledby="headingsSecond" data-bs-parent="#accordionFlushFaqsListing">
                    <div className="accordion-body">
                      {item.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="col-12 col-lg-6">
            {secondHalf?.map((item: _Object, i: number) => {
              return (
                <div key={i} className="accordion-item">
                  <h2 className="accordion-header" id={`flush-headingOne${i}`}>
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapseOne${i}`} aria-expanded="true" aria-controls={`flush-collapseOne${i}`}>
                      {item.question}
                    </button>
                  </h2>
                  <div id={`flush-collapseOne${i}`} className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionFlushFaqsListing">
                    <div className="accordion-body">
                      {item.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;