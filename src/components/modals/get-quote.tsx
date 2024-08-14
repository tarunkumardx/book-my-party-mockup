import React, { useEffect, useState } from 'react';
import * as yup from 'yup'
import { useFormik } from 'formik';

import { Button, InputField } from '@/stories/form-inputs';
import SelectField from '@/stories/form-inputs/select-field';
import { toast } from 'react-toastify';
import { _Object } from '@/utils/types';
import { amountFormat, closeModal } from '@/utils/helpers';
import { PhoneNumberField } from '..';
import { listService } from '@/services/venue.service';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useIsSearchable from '../useIsSearchable';

const GetQuotesModal = () => {
  const isSearchable = useIsSearchable();

  const [loading, setLoading] = useState<boolean>(false)
  const [locations, setLocations] = useState<_Object>([])
  const [occasions, setOccasions] = useState<_Object>([])

  const formik = useFormik({
    initialValues: {
      input_1: '',
      input_3: '',
      input_11: '',
      input_6: 'Rs 1600+',
      input_7: 'alumni-meets',
      input_8: '',
      input_9: 'east-delhi',
      input_10: ''
    },

    enableReinitialize: true,

    validationSchema: yup.object().shape({
      input_1: yup.string().label('Name').required('Name is required'),
      input_3: yup.string().label('Email').required('Email is required').email(),
      input_6: yup.string().label('Per Person Budget').required('Per Person Budget is required'),
      input_7: yup.string().label('Occasion').required('Occasion is required'),
      input_9: yup.string().label('Location').required('Location is required'),
      input_11: yup.number().label('Phone').required('Phone number is required').min(10, 'Phone number must be at least 10 digits'),
      input_8: yup.string().label('Number of guest').required('Number of guest is required'),
      input_10: yup.string().label('Date').required('Date is required')
    }),

    onSubmit: async (values) => {
      setLoading(true)
      const domain = new URL(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}`).hostname;
      const response = await fetch(`https://${domain}/wp-json/gf/v2/forms/2/submissions`, {
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
        closeModal('getQuotesModal')
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

  useEffect(() => {
    async function name() {
      const locations: _Object = await listService.getLocations()
      const finalLocations = locations.filter((item: _Object) => item.slug != 'india')
      setLocations(finalLocations)

      const occasionData: _Object = await listService.getOccasions()
      setOccasions(occasionData)
    }
    name()
  }, [])

  return (
    <div className="modal fade" id="getQuotesModal" tabIndex={-1} aria-labelledby="getQuotesModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <button type="button" className="btn border-0 modal-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => formik.resetForm()}>
						X
          </button>

          <div className="modal-body">
            <h3 className="justify-center">
							Get a free Quote
            </h3>
            <form className="row" onSubmit={formik.handleSubmit}>
              <InputField
                type="text"
                className="col-12"
                placeholder="Name"
                name="input_1"
                required={true}
                value={formik.values.input_1}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.input_1 && formik.errors.input_1}
              />
              <InputField
                className="col-6"
                placeholder="Email"
                type="email"
                name="input_3"
                required={true}
                value={formik.values.input_3}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.input_3 && formik.errors.input_3}
              />
              {/* <InputField
								className="col-6"
								type="number"
								placeholder="Phone"
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
                  value: formik.values.input_11 || '',
                  onChange: (phone: string) => formik.setFieldValue('input_11', phone),
                  error: formik.touched.input_11 && formik.errors.input_11
                }}
              />
              <SelectField
                className="col-12"
                placeholder="Per Person Budget"
                name="input_6"
                required={true}
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
                className="col-6"
                placeholder="Choose occasion"
                name="input_7"
                required={true}
                options={occasions?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
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
                className="col-6"
                placeholder="Number of Guest"
                name="input_8"
                type="number"
                required={true}
                value={formik.values.input_8}
                onChange={formik.handleChange}
                error={formik.touched.input_8 && formik.errors.input_8}
              />
              <SelectField
                className="col-6"
                placeholder="Choose location"
                name="input_9"
                required={true}
                options={locations?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
                value={{ value: formik.values.input_9 }}
                onChange={(val: _Object) => {
                  formik.setFieldValue('input_9', val.value)
                }}
                getOptionLabel={(option: { [key: string]: string }) => option?.label}
                getOptionValue={(option: { [key: string]: string }) => option?.label}
                error={formik.touched.input_9 && formik.errors.input_9}
                isSearchable={isSearchable}
              />

              <div className="col-6 get-free-quote">
                <ReactDatePicker
                  id="datepicker-herobanner-11"
                  name="date"
                  className="form-group"
                  placeholderText="DD/MM/YYYY"
                  selected={formik?.values?.input_10 ? new Date(formik.values.input_10) : null}
                  onChange={(date: Date) => { formik.setFieldValue('input_10', date) }}
                  minDate={new Date()}
                  dateFormat="dd/MM/YYYY"
                />
              </div>
              <center>
                <Button type="submit" loading={loading} label="Submit" />
              </center>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

export default GetQuotesModal