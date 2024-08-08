/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable indent */
import { bannerMinus, bannerPlus } from '@/assets/images';
import Image from 'next/image';
import React from 'react'

const Quantity = ({ value = '1', type = 'header', label, onChange, decrementQuantity, incrementQuantity, ...props }: any) => {
  return (
    <>
      {type === 'header' ?
        <div className="quantity">
          {label && (
            <label className="label-form mb-1">
              {label}
            </label>
          )}
          <div className="input-group">
            <button className="btn" type="button" disabled={typeof value === 'string' ? value === '1' : value === 1} onClick={decrementQuantity}>
              <Image src={bannerMinus} alt="" width="13" height="18" />
            </button>

            <input
              type="number"
              name="quantity"
              className="form-control input-number"
              value={value}
              onChange={onChange}
              {...props}
            />

            <button className="btn" type="button" onClick={incrementQuantity}>
              <Image src={bannerPlus} alt="" width="13" height="18" />
            </button>
          </div>
        </div>
        :
        <div className="quantity">
          <div className="input-group">
            <button className="btn" type="button" disabled={typeof value === 'string' ? value === '1' : value === 1} onClick={decrementQuantity}>
              -
            </button>

            <input
              type="number"
              name="quantity"
              className="form-control input-number"
              value={value}
              onChange={onChange}
              {...props}
            />

            <button className="btn" type="button" onClick={incrementQuantity}>
              +
            </button>
          </div>
        </div>
      }
    </>
  )
}
export default Quantity;