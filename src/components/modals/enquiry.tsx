import React, { useState } from 'react';
import { Button, InputField, TextArea } from '@/stories/form-inputs';
import { closeModal } from '@/utils/helpers';
import { _Object } from '@/utils/types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { bookingService } from '@/services/booking.service';

const Enquiry = () => {
  const [loading, setLoading] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      input_1: '',
      input_3: '',
      input_6: '',
      input_5: ''

    },
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      input_1: yup.string().label('Name').required('Name is required'),
      input_3: yup.string().label('Email').required('Email is required'),
      input_6: yup.string().label('Phone').required('Phone is required').min(10, 'Phone Number must be at least 10 digits')
    }),
    onSubmit: async (values: _Object) => {
      setLoading(true)
      const result = await bookingService.create(values, 9)
      if (result.is_valid) {
        setLoading(false)
        toast.success(React.createElement('div', { dangerouslySetInnerHTML: { __html: result.confirmation_message } })); // Use React.createElement instead
        formik.resetForm();
        closeModal('EnquiryNowModal')
      } else {
        setLoading(false)
      }
    }
  });

  return (
    <div className="modal fade" id="EnquiryNowModal" aria-labelledby="EnquiryNowModal" aria-hidden="true">
      <div className="modal-dialog">
        <form onSubmit={formik.handleSubmit} className="modal-content">
          <button type="button" className="modal-close " data-bs-dismiss="modal" aria-label="Close">X</button>

          <div className="modal-body p-0">
            <h3 className="justify-center">
							Get a free Quote
            </h3>

            <InputField
              className="col-12"
              placeholder="Name *"
              name="input_1"
              type="text"
              required={true}
              value={formik.values.input_1}
              onChange={formik.handleChange}
              error={formik.touched.input_1 && formik.errors.input_1}
            />

            <InputField
              className="col-12"
              placeholder="Email *"
              name="input_3"
              type="email"
              value={formik.values.input_3}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.input_3 && formik.errors.input_3}
            />

            <InputField
              className="col-12"
              placeholder="Phone *"
              name="input_6"
              type="number"
              value={formik.values.input_6}
              onChange={(e) => {
                const inputValue = e.target.value.replace(/\D/g, '');
                if (inputValue.length <= 10) {
                  formik.handleChange(e);
                }
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.input_6 && formik.errors.input_6}
            />

            <TextArea
              rows={8}
              name="input_5"
              placeholder="Type your message here."
              value={formik.values.input_5}
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

export default Enquiry