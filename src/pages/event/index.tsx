import React, { useState } from 'react';
import * as yup from 'yup'
import { useFormik } from 'formik';
import { Button, InputField } from '@/stories/form-inputs';
import { toast } from 'react-toastify';
import { Layout, PhoneNumberField, SEOHead } from '@/components';
import SelectField from '@/stories/form-inputs/select-field';
import { _Object } from '@/utils/types';
import { GetStaticProps } from 'next';
import { listService } from '@/services/venue.service';
import { amountFormat } from '@/utils/helpers';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useIsSearchable from '@/components/useIsSearchable';

export const getStaticProps: GetStaticProps = async () => {
  const locations = await listService.getLocations()

  const occasions = await listService.getOccasions()

  return {
    props: {
      locations: locations,
      occasions: occasions
    }
  }
}

const VenueModal = (props: _Object) => {
  const isSearchable = useIsSearchable();
  const [loading, setLoading] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      input_1: '',
      input_3: '',
      input_11: '',
      input_6: '',
      input_7: '',
      input_8: '',
      input_9: '',
      input_10: ''
    },

    enableReinitialize: true,

    validationSchema: yup.object().shape({
      input_1: yup.string().label('Name').required('Name is required'),
      input_3: yup.string().label('Email').required('Email is required').email(),
      input_11: yup.number().label('Phone').required('Phone number is required').min(10, 'Phone number must be at least 10 digits'),
      input_8: yup.string().label('Number of guest').required('Number of guest is required'),
      input_10: yup.string().label('Date').required('Date is required')
    }),

    onSubmit: async (values) => {
      setLoading(true)
      const domain = new URL(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}`).hostname;
      const response = await fetch(`https://${domain}/wp-json/gf/v2/forms/5/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      const result = await response.json()

      if (result.is_valid) {
        setLoading(false)
        toast.success(React.createElement('div', { dangerouslySetInnerHTML: { __html: result.confirmation_message } })); // Use React.createElement instead
        formik.resetForm();
      } else {
        setLoading(false)
      }
    }
  })

  const budgets = [
    { label: `${amountFormat('1600', 'number')}+`, value: 'Rs 1600+' },
    { label: `${amountFormat('1400', 'number')}-${'1600'}`, value: 'Rs 1400-1600' },
    { label: `${amountFormat('1200', 'number')}-${'1400'}`, value: 'Rs 1200-1400' },
    { label: `${amountFormat('1000', 'number')}-${'1200'}`, value: 'Rs 1000-1200' },
    { label: `${amountFormat('800', 'number')}-${'1000'}`, value: 'Rs 800-1000' },
    { label: `${amountFormat('600', 'number')}-${'800'}`, value: 'Rs 600-800' },
    { label: `${amountFormat('400', 'number')}-${'600'}`, value: 'Rs 400-600' }
  ]

  return (
    <Layout {...props}>
      <SEOHead seo={{
        title: 'Plan Your Event - Book My Party', metaDesc: ''
      }} />
      <section className="plan-event-hero">
        <div className="container">
          <div className="row">
            <div className="col">
              <h1>
                Plan Your Event
              </h1>
            </div>
          </div>
        </div>
      </section>
      <section className="plan-event-form">
        <div className="container">
          <form className="row" onSubmit={formik.handleSubmit}>
            <InputField
              type="text"
              // label="Name"
              className="col-12"
              placeholder="Name"
              name="input_1"
              required={true}
              value={formik.values.input_1}
              onChange={formik.handleChange}
              error={formik.touched.input_1 && formik.errors.input_1}
            />
            <InputField
              className="col-12 col-md-6"
              placeholder="Email"
              // label="Email"
              type="email"
              name="input_3"
              required={true}
              value={formik.values.input_3}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.input_3 && formik.errors.input_3}
            />
            {/* <InputField
							className="col-12 col-md-6"
							type="number"
							placeholder="Phone"
							label="Phone"
							name="input_11"
							required={true}
							value={formik.values.input_11}
							onChange={formik.handleChange}
							error={formik.touched.input_11 && formik.errors.input_11}
						/> */}

            <PhoneNumberField
              args={{
                className: 'col',
                country: 'in',
                // label: 'Phone',
                value: formik.values.input_11 || '',
                onChange: (phone: string) => formik.setFieldValue('input_11', phone),
                error: formik.touched.input_11 && formik.errors.input_11
              }}
            />
            <SelectField
              className="col-12"
              placeholder="Select Budget"
              name="input_6"
              value={{ value: formik.values.input_6 }}
              options={budgets}
              onChange={(val: _Object) => {
                formik.setFieldValue('input_6', val.value)
              }}
              getOptionLabel={(option: { [key: string]: string }) => option?.label}
              getOptionValue={(option: { [key: string]: string }) => option?.label}
              error={formik.touched.input_6 && formik.errors.input_6}
              isSearchable={isSearchable}
            />

            <SelectField
              className="col-12 col-md-6"
              placeholder="Choose occasion"
              // label="Occasion"
              name="input_7"
              options={props?.occasions?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
              value={{ value: formik.values.input_7 }}
              onChange={(val: _Object) => {
                formik.setFieldValue('input_7', val.value)
              }}
              getOptionLabel={(option: { [key: string]: string }) => option?.label}
              getOptionValue={(option: { [key: string]: string }) => option?.label}
              error={formik.touched.input_7 && formik.errors.input_7}
              isSearchable={isSearchable}
            />

            <InputField
              className="col-12 col-md-6"
              placeholder="Number of Guest"
              // label="No. of Guest"
              name="input_8"
              type="number"
              required={true}
              value={formik.values.input_8}
              onChange={formik.handleChange}
              error={formik.touched.input_8 && formik.errors.input_8}
            />
            <SelectField
              className="col-12 col-md-6"
              placeholder="Choose location"
              // label="Select Location"
              name="input_9"
              options={(props && props.locations && props?.locations?.map((item: _Object) => {
                return item.slug !== 'india' && { label: item.name, value: item.slug };
              }))?.filter(Boolean)}
              value={{ value: formik.values.input_9 }}
              onChange={(val: _Object) => {
                formik.setFieldValue('input_9', val.value);
              }}
              getOptionLabel={(option: { [key: string]: string }) => option && option.label}
              getOptionValue={(option: { [key: string]: string }) => option && option.label}
              error={formik.touched.input_9 && formik.errors.input_9}
              isSearchable={isSearchable}
            />

            {/* <InputField
							type="date"
							className="col-12 col-md-6"
							label="Date of Event"
							name="input_10"
							required={true}
							value={formik.values.input_10}
							onChange={formik.handleChange}
							error={formik.touched.input_10 && formik.errors.input_10}
						/> */}

            <div className="form-group mb-3 col-12 col-md-6 plan-your-date">
              {/* <label className="label-form mb-1">Date of Event <span className="text-danger">*</span></label> */}
              <ReactDatePicker
                name="date"
                placeholderText="DD/MM/YYYY"
                selected={formik?.values?.input_10 ? new Date(formik.values.input_10) : null}
                onChange={(date: Date) => { formik.setFieldValue('input_10', date) }}
                minDate={new Date()}
                dateFormat="dd/MM/YYYY"
              />
            </div>
            <div className="text-center mt-lg-3 mt-md-2 mt-2 ps-lg-2 ps-md-0 ps-0">
              <Button type="submit" loading={loading} label="Submit"
              />
            </div>
          </form>
        </div>
      </section>
    </Layout>
  )
}

export default VenueModal