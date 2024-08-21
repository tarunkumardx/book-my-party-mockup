/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { modalClose } from '@/assets/images';
import { _Object } from '@/utils/types';
import { uploadImages } from '@/utils/helpers';

const ImageUploader = ({ state, setState, multiple }: _Object) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [previewUrl, setPreviewUrl] = useState<any>('');
  const [previewUrls, setPreviewUrls] = useState<_Object>([]);

  useEffect(() => {
    async function imageFunction() {
      if (multiple && state.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const previewUrls = state?.map(async (item: any) => {
          if (typeof item === 'string') {
            return item
          } else {
            return await uploadImages(item)
          }
        })

        setPreviewUrls(previewUrls)
      } else {
        if (typeof state == 'object' && state.length != 0) {
          setPreviewUrl(await uploadImages(state));
        } else {
          setPreviewUrl('');
        }

        if (typeof state === 'string') {
          setPreviewUrl(state);
        }
      }
    }

    imageFunction()
  }, [state])

  const handleImageChange = (e: _Object) => {
    const file = e?.target?.files && e?.target?.files[0];
    if (file) {
      setState(file);
    }
  };

  const handleMultipleIMages = (e: _Object) => {
    const file = e?.target?.files && e?.target?.files[0];
    if (file) {
      setState((prev: string[]) => ([...prev, file]))
    }
  }

  const removeImage = (indexToRemove: number) => {
    setState(state.filter((image: _Object, index: number) => index !== indexToRemove));
  }

  return (
    <>
      {
        !multiple &&
				<div className="d-flex gap-3">
				  {previewUrl.length > 0 &&
						<div className="Sketch-close-wrap">
						  <Image src={previewUrl} width="100" height="100" alt="tourDetailImg" className="item-img" />
						  <button onClick={() => setState()} type="button" className="border-0">
						    <Image src={modalClose} width="8" height="8" alt="tourDetailImg" />
						  </button>
						</div>
				  }
				  {previewUrl.length === 0 &&
						<div className="form-group mb-30 uploadfile">
						  <input
						    type="file"
						    accept="image/*"
						    className="form-control"
						    onChange={handleImageChange}
						  />

						  <div className="inner">
						    <span className="add">+</span>
						    <span className="text">Upload</span>
						  </div>
						</div>
				  }
				</div>
      }

      {
        multiple &&
				<div className="d-flex gap-3">
				  {previewUrls?.length > 0 &&
						previewUrls?.map((item: string, i: number) => {
						  return (
						    <div key={i} className="Sketch-close-wrap">
						      <Image src={item} width="100" height="100" alt="tourDetailImg" className="item-img" />
						      <button onClick={() => removeImage(i)} type="button" className="border-0">
						        <Image src={modalClose} width="8" height="8" alt="tourDetailImg" />
						      </button>
						    </div>
						  )
						})
				  }
				  <div className="form-group mb-30 uploadfile">
				    <input
				      type="file"
				      accept="image/*"
				      className="form-control"
				      onChange={handleMultipleIMages}
				    />

				    <div className="inner">
				      <span className="add">+</span>
				      <span className="text">Upload</span>
				    </div>
				  </div>
				</div>
      }
    </>
  )
}

export default ImageUploader