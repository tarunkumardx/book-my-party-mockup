import React, { useState } from 'react';
import { Button, InputField, RadioButton, TextArea } from '@/stories/form-inputs';
import { closeModal } from '@/utils/helpers';
import { RootState, _Object } from '@/utils/types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { bookingService } from '@/services/booking.service';
import { useSelector } from 'react-redux';
import { PhoneNumberField } from '..';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const EnquiryVenue = ({ props }: _Object) => {
  const { loggedInUser } = useSelector((state: RootState) => state.session);

  const [loading, setLoading] = useState<boolean>(false)

  const formik: _Object = useFormik({
    initialValues: {
      input_1: '',
      input_3: '',
      input_5: '',
      input_6: props?.title,
      input_7: props?.venue_id,
      input_8: loggedInUser?.databaseId || '',
      input_9: '',
      input_10: '',
      input_11: '',
      input_12: 'wedding'
    },
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      input_1: yup.string().label('Name').required('Name is required'),
      input_3: yup.string().label('Email').email().required('Email is required'),
      input_5: yup.string().label('Phone Number').required('Phone Number is required').min(12, 'Phone Number must be at least 10 digits'),
      input_10: yup.string().label('Date').required('Date is required'),
      input_11: yup.string().label('Number Of Guest').required('Number Of Guest is required')
    }),
    onSubmit: async (values: _Object) => {
      setLoading(true)
      const result = await bookingService.create(values, 12)
      if (result.is_valid) {
        setLoading(false)
        toast.success(React.createElement('div', { dangerouslySetInnerHTML: { __html: result.confirmation_message } })); // Use React.createElement instead
        formik.resetForm();
        closeModal('EnquiryNowModalVenue')
      } else {
        setLoading(false)
      }
    }
  });

  return (
    <div className="modal fade" id="EnquiryNowModalVenue" aria-labelledby="EnquiryNowModalVenue" aria-hidden="true">
      <div className="modal-dialog">
        <form onSubmit={formik.handleSubmit} className="modal-content">
          <button type="button" className="modal-close " data-bs-dismiss="modal" aria-label="Close">X</button>

          <div className="modal-body p-0">
            <h3 className="justify-center pb-3">
							Venue Enquiry
            </h3>
            <InputField
              type="text"
              className="col-12"
              placeholder="Name"
              name="input_1"
              required={true}
              value={formik.values.input_1}
              onChange={formik.handleChange}
              error={formik.touched.input_1 && formik.errors.input_1}
            />

            <InputField
              className="col-12"
              placeholder="Email"
              type="email"
              name="input_3"
              required={true}
              value={formik.values.input_3}
              onChange={formik.handleChange}
              error={formik.touched.input_3 && formik.errors.input_3}
            />

            <PhoneNumberField
              args={{
                country: 'in',
                value: formik.values.input_5 || '',
                onChange: (phone: string) => formik.setFieldValue('input_5', phone),
                error: formik.touched.input_5 && formik.errors.input_5
              }}
            />

            <div className={`col-12 mb-3 plan-your-date-1 ${formik.touched.input_10 && formik.errors.input_10 ? 'invalid' : ''}`}>
              <ReactDatePicker
                name="date"
                placeholderText="DD/MM/YYYY"
                selected={formik?.values?.input_10 ? new Date(formik.values.input_10) : null}
                onChange={(date: Date) => { formik.setFieldValue('input_10', moment(date).format('MM-DD-YYYY')) }}
                minDate={new Date()}
                dateFormat="dd/MM/YYYY"
              />

              {formik.touched.input_10 && formik.errors.input_10 && <span className="invalid-feedback text-danger d-block mt-1">{formik.errors.input_10}</span>}

            </div>

            <InputField
              className="col-12"
              placeholder="Number of Guest"
              name="input_11"
              type="number"
              required={true}
              value={formik.values.input_11}
              onChange={formik.handleChange}
              error={formik.touched.input_11 && formik.errors.input_11}
            />

            <div className="ps-2">
              <RadioButton
                displayInline
                label=""
                value={[formik.values.input_12]}
                options={props?.occasions?.map((item: _Object) => { return { label: item.name, value: item.slug } })}
                onChange={(e: _Object) => formik.setFieldValue('input_12', e.target.value)}
              />
            </div>

            <TextArea
              rows={8}
              name="input_9"
              placeholder="Message"
              value={formik.values.input_9}
              onChange={formik.handleChange}
            />

          </div>

          <div className="modal-footer justify-content-start border-0 p-0 mb-3">
            <Button type="submit" label="Submit" loading={loading} className="btn btn-primary text-uppercase" />
          </div>
        </form>
      </div>
    </div >
  )
}

export default EnquiryVenue