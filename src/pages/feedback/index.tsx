import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Breadcrumb, Layout, SEOHead } from '@/components';
import { Button, InputField, TextArea } from '@/stories/form-inputs';
import Image from 'next/image';
import { feedback3 } from '@/assets/images';
import { toast } from 'react-toastify';
import { bookingService } from '@/services/booking.service';
import { _Object } from '@/utils/types';

const FeedBack = (props: _Object) => {
  const [loading, setLoading] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      input_1: '',
      input_3: '',
      input_4: '',
      input_5: ''
    },
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      input_1: yup.string().label('Name').required('Name is required'),
      input_3: yup.string().label('Email').required('Email is required'),
      input_4: yup.string().label('Phone Number').required('Phone Number is required')
    }),
    onSubmit: async (values: _Object) => {
      setLoading(true)
      const result = await bookingService.create(values, 11)
      if (result.is_valid) {
        setLoading(false)
        toast.success(React.createElement('div', { dangerouslySetInnerHTML: { __html: result.confirmation_message } }));
        formik.resetForm();
      } else {
        setLoading(false)
      }
    }
  });
  return (
    <Layout {...props}>
      <SEOHead seo={{
        title: 'Feedback - Book My Party', metaDesc: ''
      }} />
      <section className="page-content-hero">
        <div className="container">
          <div className="row">
            <div className="col">
              <h1>
								Feedback
              </h1>
            </div>
          </div>
        </div>
      </section>

      <Breadcrumb
        data={
          [
            {
              label: 'Feedback',
              target: ''
            }
          ]
        }
      />

      <section className="feedback">
        <div className="container">
          <div className="row">

            <div className="col-lg-7">
              <form onSubmit={formik.handleSubmit} className="mt-3 mt-lg-0">
                <h5 className="main-head">
									We&#39;d love your feedback!
                </h5>

                <p className="main-description">
									Send us your feedback / suggestions and we&#39;ll work on it.
                </p>

                <hr />

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
                  name="input_3"
                  type="email"
                  value={formik.values.input_3}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.input_3 && formik.errors.input_3}
                />

                <InputField
                  className="col-12"
                  placeholder="Phone"
                  name="input_4"
                  type="number"
                  required={true}
                  value={formik.values.input_4}
                  onChange={formik.handleChange}
                  error={formik.touched.input_4 && formik.errors.input_4}
                />

                <TextArea
                  rows={8}
                  name="input_5"
                  placeholder="Message"
                  value={formik.values.input_5}
                  onChange={formik.handleChange}
                />

                <Button label="Submit" type="submit" loading={loading} className="primary" />
              </form>

              <div className="wp-armour">
                <strong>WP Armour ( Only visible to site administrators. Not visible to other users. )</strong>
                <br />
								This form has a honeypot trap enabled. If you want to act as spam bot for testing purposes, please click the button below.
                <br />

                <Button type="button" label="Act as Spam Bot" className="secondary wpa-button" />
              </div>
            </div>

            <div className="col">
              <Image src={feedback3} alt="" className="img-fluid" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default FeedBack