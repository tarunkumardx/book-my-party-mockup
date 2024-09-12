import React, { useState } from 'react';
import * as yup from 'yup'
import { useFormik } from 'formik';
import { Button, InputField } from '@/stories/form-inputs';
import { toast } from 'react-toastify';
import { closeModal, formatPhoneNumber } from '@/utils/helpers';
import { PhoneNumberField } from '..';

const VenueModal = () => {
  const [loading, setLoading] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      input_1: '',
      input_3: '',
      input_4: '',
      input_5: '',
      input_6: '',
      input_12: '',
      input_8: '',
      input_9: '',
      input_13: ''
    },

    enableReinitialize: true,

    validationSchema: yup.object().shape({
      input_1: yup.string().label('Venue name').required('Venue name is required'),
      input_3: yup.string().label('City').required('City is required'),
      input_4: yup.string().label('Address').required('Address is required'),
      input_5: yup.string().label('Name').required('Name is required'),
      input_6: yup.string().label('Email').required('Email is required').email(),
      input_12: yup.string().label('Phone number').required('Phone number is required'),
      input_13: yup.string().label('Venue Contact Number').required('Venue Contact Details required'),
      input_8: yup.string().label('Designation').required('Designation is required')
    }),

    onSubmit: async (values) => {
      values.input_12 = formatPhoneNumber(formik?.values.input_12)
      values.input_13 = formatPhoneNumber(formik?.values.input_13)
      console.log('values', values);
      setLoading(true)
      const domain = new URL(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}`).hostname;
      const response = await fetch(`https://${domain}/wp-json/gf/v2/forms/3/submissions`, {
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
        closeModal('venueModal')
      } else {
        setLoading(false)
      }
    }
  })

  return (
    <div className="modal fade" id="venueModal" tabIndex={-1} aria-labelledby="venueModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <button onClick={() => formik.resetForm()} type="button" className="btn border-0 modal-close" data-bs-dismiss="modal" aria-label="Close">
						X
          </button>
          <div className="modal-body">
            <h3 className="justify-center">
							List your venue
            </h3>
            <form className="row" onSubmit={formik.handleSubmit}>
              <InputField
                className="col-8"
                placeholder="Name of the venue"
                name="input_1"
                required={true}
                value={formik.values.input_1}
                onChange={formik.handleChange}
                error={formik.touched.input_1 && formik.errors.input_1}
              />
              <InputField
                className="col-4"
                placeholder="City"
                name="input_3"
                required={true}
                value={formik.values.input_3}
                onChange={formik.handleChange}
                error={formik.touched.input_3 && formik.errors.input_3}
              />

              <InputField
                className="col-12"
                placeholder="Address"
                name="input_4"
                required={true}
                value={formik.values.input_4}
                onChange={formik.handleChange}
                error={formik.touched.input_4 && formik.errors.input_4}
              />

              <PhoneNumberField
                args={{
                  placeholder: 'Enter Venue Contact Number',
                  className: 'col',
                  country: 'in',
                  value: formik.values.input_13 || '',
                  onChange: (phone: string) => formik.setFieldValue('input_13', phone),
                  error: formik.touched.input_13 && formik.errors.input_13
                }}
              />

              <InputField
                className="col-12"
                placeholder="Tell Us Something About Your Venue"
                name="input_9"
                required={true}
                value={formik.values.input_9}
                onChange={formik.handleChange}
              />

              <h3 className="pt-2">
								About You
              </h3>
              <InputField
                type="text"
                className="col-6"
                placeholder="Name"
                name="input_5"
                required={true}
                value={formik.values.input_5}
                onChange={formik.handleChange}
                error={formik.touched.input_5 && formik.errors.input_5}
              />
              <InputField
                className="col-6"
                placeholder="Email Address"
                type="email"
                name="input_6"
                required={true}
                value={formik.values.input_6}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.input_6 && formik.errors.input_6}
              />

              {/* <InputField
								type="number"
								className="col-6"
								placeholder="Phone number"
								name="input_12"
								required={true}
								value={formik.values.input_12}
								onChange={formik.handleChange}
								error={formik.touched.input_12 && formik.errors.input_12}
							/> */}

              <PhoneNumberField
                args={{
                  className: 'col',
                  country: 'in',
                  value: formik.values.input_12 || '',
                  onChange: (phone: string) => formik.setFieldValue('input_12', phone),
                  error: formik.touched.input_12 && formik.errors.input_12
                }}
              />

              <InputField
                className="col-6"
                placeholder="Designation"
                name="input_8"
                required={true}
                value={formik.values.input_8}
                onChange={formik.handleChange}
                error={formik.touched.input_8 && formik.errors.input_8}
              />

              <center>
                <Button
                  className="primary mt-4"
                  label="Submit"
                  type="submit"
                  loading={loading}
                />
              </center>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VenueModal