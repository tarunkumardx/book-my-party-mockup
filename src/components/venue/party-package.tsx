/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useState } from 'react';

import { useFormik } from 'formik';
import * as yup from 'yup'

import { Button, InputField, RadioButton, TextArea } from '@/stories/form-inputs';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { _Object } from '@/utils/types';
import Image from 'next/image';
import { modalClose } from '@/assets/images';
import { useRouter } from 'next/router';
import { AppDispatch } from '@/redux/store';
import { venueData } from '@/redux/slices/venue.slice';
import { uploadImages } from '@/utils/helpers';
import { CKEditor } from 'ckeditor4-react';
import SelectField from '@/stories/form-inputs/select-field';

const PartyPackage = ({ venueMenuItems, props }: _Object) => {
  const router: _Object = useRouter();
  const dispatch = useDispatch<AppDispatch>()

  const { venueState } = useSelector((state: _Object) => state.venueDetails);

  const defaultMenuItem: _Object = {
    title: '',
    image: {},
    image_url: '',
    price: '',
    content: '',
    minPax: '',
    shortDescription: '',
    menuDetail: '',
    freeCancellation: 'true',
    salePrice: '',
    validOn: '',
    timing: '',
    dietaryPreference: 'vegetarian',
    package_settings: {
      menuitem_145: {},
      menuitem_197: {},
      menuitem_192: {},
      menuitem_149: {}
    },
    package_settings1: []
  }

  const packageStartingFrom: _Object = {
    package_starting_type: 'Non Vegetarian',
    package_starting_title: '',
    package_starting_price: ''
  }

  const [initialData, setInitialData] = useState<_Object>({
    packages: venueState?.packages || [
      {
        title: '',
        image: {},
        image_url: '',
        price: '',
        content: '',
        minPax: '',
        shortDescription: '',
        menuDetail: '',
        freeCancellation: 'true',
        salePrice: '',
        validOn: '',
        timing: '',
        dietaryPreference: 'vegetarian',
        package_settings: {
          menuitem_145: {},
          menuitem_197: {},
          menuitem_192: {},
          menuitem_149: {}
        },
        package_settings1: []
      }
    ],
    paxPrice: venueState?.paxPrice,
    package_starting_from: venueState?.package_starting_from || [
      {
        package_starting_type: 'Non Vegetarian',
        package_starting_title: '',
        package_starting_price: ''
      }
    ]
  });

  function getWordForValue(value: number) {
    const wordMap: _Object = {
      1: 'First',
      2: 'Second',
      3: 'Third',
      4: 'Fourth',
      5: 'Fifth',
      6: 'Six',
      7: 'Seven',
      8: 'Eight',
      9: 'Nine',
      10: 'Ten',
      11: 'Eleven',
      12: 'Twelve'
    };

    return wordMap[value] || 'Unknown';
  }

  useEffect(() => {
    if (venueState?.title?.length === 0 || !venueState?.title) {
      router.push(router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}` : '/dashboard/venues/create')
    }

    if (venueState?.location === 0 || !venueState?.location) {
      router.push({
        pathname: router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}` : '/dashboard/venues/create',
        query: 'step=5'
      })
    }
  }, [])

  const formik: _Object = useFormik({
    initialValues: initialData,

    enableReinitialize: true,

    validationSchema: yup.object().shape({
      packages: yup.array().of(
        yup.object().shape({
          title: yup.string().required().label('Title'),
          price: yup.string().required().label('Price'),
          salePrice: yup.string().required().label('Sale Price'),
          minPax: yup.string().required().label('Min Pax'),
          timing: yup.string().required().label('Timing'),
          validOn: yup.string().required().label('Valid On'),
          shortDescription: yup.string().required().label('Short Description'),
          menuDetail: yup.string().required().label('Menu Detail'),
          content: yup.string().required().label('Content')
        })
      ),
      paxPrice: yup.string().required().label('Pax Price')
    }),

    onSubmit: async (values: _Object) => {
      dispatch(venueData({ ...venueState, ...values, packages: values.packages, paxPrice: values.paxPrice }))
      props.setSteps((prev: _Object) => ({
        ...prev,
        step7: true
      }))
      router.push({
        pathname: router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}` : '/dashboard/venues/create',
        query: 'step=7'
      })
    }
  })

  const menuItemCount = async (action: string, i = -1) => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    if (action === 'Add') setInitialData({ ...formik.values, packages: [...formik.values?.packages, defaultMenuItem] })
    if (action === 'Remove') {
      formik.values.packages.splice(i, 1);
      setInitialData({ ...formik.values, packages: formik.values.packages })
    }
  }

  const menuItemCount1 = async (action: string, i = -1) => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    if (action === 'Add') setInitialData({ ...formik.values, package_starting_from: [...formik.values?.package_starting_from, packageStartingFrom] })
    if (action === 'Remove') {
      formik.values.package_starting_from.splice(i, 1);
      setInitialData({ ...formik.values, package_starting_from: formik.values.package_starting_from })
    }
  }

  const handleImage = async (e: _Object, i: number) => {
    const file = e?.target?.files && e?.target?.files[0];
    if (file) {
      formik.setFieldValue(`packages[${i}].image`, file);
      formik.setFieldValue(`packages[${i}].image_url`, await uploadImages(file));
    }
  };

  const removeImage = (indexToRemove: number) => {
    formik.setFieldValue(`packages[${indexToRemove}].image`, {})
    formik.setFieldValue(`packages[${indexToRemove}].image_url`, '')
  }

  const backButton = () => {
    dispatch(venueData({ ...venueState, packages: formik.values.packages, paxPrice: formik.values.paxPrice }))
  }

  const handleInputBox = (e: React.ChangeEvent<HTMLInputElement>, category: number, subCategory: number, index: number) => {
    const data = formik?.values?.packages[index]?.package_settings1?.find((menuItemChild: _Object) => menuItemChild?.item_subcategory === subCategory)

    if (data) {
      const filterData = formik?.values?.packages[index]?.package_settings1?.filter((item: _Object) => item?.item_subcategory != subCategory)

      const itemData = { items: parseInt(e.target.value), item_subcategory: subCategory, item_category: category }

      formik.setFieldValue(`packages[${index}].package_settings1`, [...filterData, itemData])
    } else {
      const itemData = { items: parseInt(e.target.value), item_subcategory: subCategory, item_category: category }
      formik.setFieldValue(`packages[${index}].package_settings1`, [...formik?.values?.packages[index]?.package_settings1, itemData])
    }
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="card">
        <div className="card-body">
          <InputField
            className="mb-30"
            required={true}
            label="Pax Price"
            type="number"
            name="paxPrice"
            value={formik.values.paxPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue('paxPrice', e.target.value)}
            onBlur={formik.handleBlur}
            error={formik.touched.paxPrice && formik.errors.paxPrice}
          />

          <div className="mb-4">
            <h5 className="text-uppercase">Package Starting From</h5>
            {
              formik?.values?.package_starting_from?.map((item: _Object, i: number) => {
                return (
                  <div key={i} className="row mb-4">
                    <div className="col">
                      <RadioButton
                        label="Type"
                        name={`package-ddd${i}`}
                        value={[item.package_starting_type]}
                        required={true}
                        options={[
                          { label: 'Vegetarian', value: 'Vegetarian' },
                          { label: 'Non Vegetarian', value: 'Non Vegetarian' },
                          { label: 'Special', value: 'Special' }
                        ]}
                        displayInline={true}
                        onChange={(e: _Object) => {
                          formik.setFieldValue(`package_starting_from[${i}].package_starting_type`, e.target.value)
                        }}
                      />
                    </div>

                    <div className="col">
                      <InputField
                        className="mb-30"
                        required={true}
                        label="Title"
                        name={`package_starting_from[${i}].package_starting_title`}
                        value={item.package_starting_title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue(`package_starting_from[${i}].package_starting_title`, e.target.value)}
                        onBlur={formik.handleBlur}
                        error={formik.touched.package_starting_from && formik.errors.package_starting_from && formik.errors.package_starting_from[i] && formik.errors.package_starting_from[i].package_starting_title && formik.errors.package_starting_from[i].package_starting_title}
                      />
                    </div>

                    <div className="col">
                      <InputField
                        className="mb-30"
                        required={true}
                        label="Price"
                        type="number"
                        name={`package_starting_from[${i}].package_starting_price`}
                        value={item.package_starting_price}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue(`package_starting_from[${i}].package_starting_price`, e.target.value)}
                        onBlur={formik.handleBlur}
                        error={formik.touched.package_starting_from && formik.errors.package_starting_from && formik.errors.package_starting_from[i] && formik.errors.package_starting_from[i].package_starting_price && formik.errors.package_starting_from[i].package_starting_price}
                      />
                    </div>

                    <div className="d-flex justify-content-between">
                      <Button
                        type="button"
                        className="outline-danger"
                        label="Remove"
                        onClick={() => menuItemCount1('Remove', i)}
                        disabled={formik.values.package_starting_from.length === 1}
                      ></Button>
                      <Button
                        type="button"
                        className="primary" label="Add NEW"
                        onClick={() => menuItemCount1('Add')}
                        disabled={formik.values.package_starting_from.length === 3}
                      />
                    </div>
                  </div>
                )
              })
            }
          </div>

          {formik?.values?.packages?.map((item: _Object, i: number) => {
            return (
              <>
                <div className="mb-3">
                  <div key={i} className="row mb-3">
                    <div className="col-12">
                      <h5 className="text-uppercase">{getWordForValue(i + 1)} Package</h5>
                    </div>

                    <div className="col">
                      <InputField
                        className="mb-30"
                        required={true}
                        label="Title"
                        name={`packages[${i}].title`}
                        value={item.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue(`packages[${i}].title`, e.target.value)}
                        onBlur={formik.handleBlur}
                        error={formik.touched.packages && formik.errors.packages && formik.errors.packages[i] && formik.errors.packages[i].title && formik.errors.packages[i].title}
                      />
                    </div>

                    <div className="col">
                      <InputField
                        className="mb-30"
                        required={true}
                        label="Price"
                        type="number"
                        name={`packages[${i}].price`}
                        value={item.price}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue(`packages[${i}].price`, e.target.value)}
                        onBlur={formik.handleBlur}
                        error={formik.submitCount > 0 && formik.touched.packages && formik.errors.packages && formik.errors.packages[i] && formik.errors.packages[i].price && formik.errors.packages[i].price}
                      />
                    </div>

                    <div className="col">
                      <InputField
                        className="mb-30"
                        label="Sale Price"
                        type="number"
                        required={true}
                        name={`packages[${i}].salePrice`}
                        value={item.salePrice}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue(`packages[${i}].salePrice`, e.target.value)}
                        onBlur={formik.handleBlur}
                        error={formik.submitCount > 0 && formik.touched.packages && formik.errors.packages && formik.errors.packages[i] && formik.errors.packages[i].salePrice && formik.errors.packages[i].salePrice}
                      />
                    </div>

                    <div className="col-3">
                      <label className="form-label">Package Image</label>

                      {item?.image_url?.length > 0 &&
												<div className="d-flex gap-3">
												  <div className="Sketch-close-wrap">
												    <Image src={item.image_url} width="100" height="100" alt="tourDetailImg" className="item-img" />
												    <button onClick={() => removeImage(i)} type="button" className="border-0">
												      <Image src={modalClose} width="8" height="8" alt="tourDetailImg" />
												    </button>
												  </div>
												</div>
                      }

                      {(!item?.image_url || item?.image_url?.length === 0) &&
												<div className="form-group mb-30 uploadfile">
												  <input
												    type="file"
												    accept="image/*"
												    className="form-control"
												    onChange={(e: _Object) => handleImage(e, i)}
												  />

												  <div className="inner">
												    <span className="add">+</span>
												    <span className="text">Upload</span>
												  </div>
												</div>
                      }
                    </div>

                    <div className="form-group">
                      <ul className="list-inline">
                        <li className="list-inline-item">
                          <InputField
                            className="mb-30"
                            label="Min Pax"
                            type="number"
                            required={true}
                            name={`packages[${i}].minPax`}
                            value={item.minPax}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue(`packages[${i}].minPax`, e.target.value)}
                            onBlur={formik.handleBlur}
                            error={formik.submitCount > 0 && formik.touched.packages && formik.errors.packages && formik.errors.packages[i] && formik.errors.packages[i].minPax && formik.errors.packages[i].minPax}
                          />
                        </li>

                        <li className="list-inline-item">
                          <RadioButton
                            label="Dietary Preference"
                            value={[item.dietaryPreference]}
                            required={true}
                            options={[
                              { label: 'Vegetarian', value: 'vegetarian' },
                              { label: 'Non vegetarian', value: 'nonvegetarian' }
                            ]}
                            displayInline={true}
                            onChange={(e: _Object) => {
                              formik.setFieldValue(`packages[${i}].dietaryPreference`, e.target.value)
                            }}
                          />
                        </li>

                        <li className="list-inline-item">
                          <RadioButton
                            label="Free Cancellation"
                            value={[item.freeCancellation]}
                            required={true}
                            options={[
                              { label: 'Yes', value: 'true' },
                              { label: 'No', value: 'false' }
                            ]}
                            displayInline={true}
                            onChange={(e: _Object) => {
                              formik.setFieldValue(`packages[${i}].freeCancellation`, e.target.value)
                            }}
                          />
                        </li>
                      </ul>
                    </div>

                    <div className="row mt-3">
                      <div className="col-3">
                        <SelectField
                          className="col"
                          name={`packages[${i}].timing`}
                          label="Timing"
                          required={true}
                          options={
                            [
                              { label: '10:00AM - 10:00PM', value: '10:00AM - 10:00PM' },
                              { label: '08:00AM - 10:00PM', value: '08:00AM - 10:00PM' },
                              { label: '09:00AM - 10:00PM', value: '09:00AM - 10:00PM' },
                              { label: '12:00PM - 06:00PM', value: '12:00pM - 06:00PM' }
                            ]
                          }
                          value={{ value: item.timing }}
                          onChange={(e: _Object) => formik.setFieldValue(`packages[${i}].timing`, e.value)}
                          getOptionLabel={(option: { [key: string]: string }) => option?.label}
                          getOptionValue={(option: { [key: string]: string }) => option?.label}
                          error={formik.submitCount > 0 && formik.touched.packages && formik.errors.packages && formik.errors.packages[i] && formik.errors.packages[i].timing && formik.errors.packages[i].timing}
                        />
                      </div>

                      <div className="col-3">
                        <SelectField
                          className="col"
                          name={`packages[${i}].validOn`}
                          label="Valid On"
                          required={true}
                          options={
                            [
                              { label: 'All Days', value: 'All Days' },
                              { label: 'Mon-Fri', value: 'Mon-Fri' },
                              { label: 'Sat-Sun', value: 'Sat-Sun' },
                              { label: 'Weekend', value: 'Weekend' }
                            ]
                          }
                          value={{ value: item.validOn }}
                          onChange={(e: _Object) => formik.setFieldValue(`packages[${i}].validOn`, e.value)}
                          getOptionLabel={(option: { [key: string]: string }) => option?.label}
                          getOptionValue={(option: { [key: string]: string }) => option?.label}
                          error={formik.submitCount > 0 && formik.touched.packages && formik.errors.packages && formik.errors.packages[i] && formik.errors.packages[i].validOn && formik.errors.packages[i].validOn}
                        />
                      </div>
                    </div>

                    <div className="row mt-3">

                      <div className="col-12 mb-3">
                        <div>
                          <TextArea
                            rows={8}
                            name="input_9"
                            label="Short Description"
                            required={true}
                            placeholder="Short Description"
                            value={item.shortDescription}
                            onChange={(e: _Object) => {
                              formik.setFieldValue(`packages[${i}].shortDescription`, e.target.value)
                            }}
                            error={formik.submitCount > 0 && formik.touched.packages && formik.errors.packages && formik.errors.packages[i] && formik.errors.packages[i].shortDescription && formik.errors.packages[i].shortDescription}
                          />
                        </div>
                      </div>

                      <div className="col-12 mb-3">
                        <label>Description <span className="text-danger">*</span></label>
                        <div>
                          <CKEditor
                            initData={item.content}
                            onChange={(event) => {
                              const editorData = event.editor.getData(); // Pura data
                              const parser = new DOMParser();
                              const parsedHtml = parser.parseFromString(editorData, 'text/html');
                              const bodyContent = parsedHtml.body.innerHTML; // <body> tag ke andar ka content
                              formik.setFieldValue(`packages[${i}].content`, bodyContent);
                            }}
                            config={{
                              allowedContent: true,
                              fullPage: true
                            }}
                          />
                          {formik?.submitCount > 0 && formik?.touched?.packages && formik.errors?.packages && formik?.errors?.packages[i] && formik?.errors?.packages[i]?.content && <span className="text-danger">{formik?.errors?.packages[i]?.content}</span>}
                        </div>
                      </div>

                      <div className="col-12 mb-3">
                        <label>Menu Details <span className="text-danger">*</span></label>
                        <div>
                          <CKEditor
                            initData={item.menuDetail}
                            onChange={(event) => {
                              const editorData = event.editor.getData(); // Pura data
                              const parser = new DOMParser();
                              const parsedHtml = parser.parseFromString(editorData, 'text/html');
                              const bodyContent = parsedHtml.body.innerHTML; // <body> tag ke andar ka content
                              formik.setFieldValue(`packages[${i}].menuDetail`, bodyContent);
                            }}
                            config={{
                              allowedContent: true,
                              fullPage: true
                            }}
                          />
                          {formik?.submitCount > 0 && formik?.touched?.packages && formik?.errors?.packages && formik?.errors?.packages[i] && formik?.errors?.packages[i]?.menuDetail && <span className="text-danger">{formik?.errors?.packages[i]?.menuDetail}</span>}
                        </div>
                      </div>

                      {(venueState?.type === 'banquet' || venueState.type === 'farm-house') &&
												<div className="col setting-wrap">
												  <h5 className="text-uppercase">Settings</h5>

												  <div className="row row-cols-4">
												    {
												      venueState?.menuItems?.length > 0 &&
															venueMenuItems?.map((menuItem: _Object, k: number) => {
															  return (
															    menuItem?.children?.nodes?.length > 0 && venueState?.menuItems?.some((item: _Object) => item?.item_category === menuItem?.databaseId) && (
															      <>
															        <div key={k} className="col-12">
															          <strong className="form-label text-uppercase">{menuItem.name}</strong>
															        </div>
															        {menuItem?.children?.nodes?.map((children: _Object, j: number) => {
															          return (
															            venueState?.menuItems?.find((subCategory: _Object) => subCategory.item_subcategory === children?.databaseId)?.items?.length > 0 &&
																					<>
																					  <div key={j} className="col">
																					    <div className="form-group d-flex align-items-center gap-2">
																					      <label className="form-label">{children.name}</label>
																					      <input
																					        type="number"
																					        min={1}
																					        className="form-control"
																					        name={children.slug}
																					        value={formik?.values?.packages[i]?.package_settings1?.find((menuItemChild: _Object) => menuItemChild?.item_subcategory === children?.databaseId)?.items}
																					        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { handleInputBox(e, menuItem?.databaseId, children?.databaseId, i) }}
																					      />
																					    </div>
																					  </div>
																					</>
															          )
															        })}
															      </>
															    )
															  )
															})}

												  </div>

												</div>
                      }
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <Button
                      type="button"
                      className="outline-danger"
                      label="Remove"
                      onClick={() => menuItemCount('Remove', i)}
                      disabled={formik.values.packages.length === 1}
                    ></Button>
                    <Button
                      type="button"
                      className="primary" label="Add NEW"
                      onClick={() => menuItemCount('Add')}
                    />
                  </div>
                </div>
              </>
            )
          })}
        </div>
      </div>

      <div className="d-flex justify-content-center gap-3 continue-btn">
        <Link onClick={() => backButton()} href={router?.query?.slug ? `/dashboard/venues/${router?.query?.slug}?step=5` : '/dashboard/venues/create?step=5'} className="btn btn-primary">Back</Link>
        <Button type="submit" label="Continue" className="btn btn-primary" />
      </div>
    </form>
  )
}

export default PartyPackage