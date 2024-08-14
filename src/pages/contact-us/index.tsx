import React, { useState } from 'react'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { contactGirl, locationWhite, mailBox, phoneWhite } from '@/assets/images';
import { Breadcrumb, Layout, SEOHead } from '@/components';
import { Button, InputField, TextArea } from '@/stories/form-inputs';
import Image from 'next/image';
import { _Object } from '@/utils/types';
import { bookingService } from '@/services/booking.service';
import Link from 'next/link';

const ContactUs = (props: _Object) => {
  const [loading, setLoading] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      input_1: '',
      input_3: '',
      input_5: ''

    },
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      input_1: yup.string().label('Name').required('Name is required').min(4, 'Name must be at least 4 characters'),
      input_3: yup.string().label('Email').email().required('Email is required')
    }),
    onSubmit: async (values: _Object) => {
      setLoading(true)
      const result = await bookingService.create(values, 10)
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
    <>
      <SEOHead seo={{
        title: 'Contact Us - Book My Party', metaDesc: 'Connect with us for unforgettable events! Whether it\'s birthdays, weddings, or corporate gatherings, our experts ensure seamless celebrations. Contact us today!'
      }} />
      <Layout {...props
      } >
        <section className="page-content-hero">
          <div className="container">
            <div className="row">
              <div className="col">
                <h1>
									Contact Us
                </h1>
              </div>
            </div>
          </div>
        </section>

        <Breadcrumb
          data={
            [
              {
                label: 'Contact Us',
                target: ''
              }
            ]
          }
        />

        <section className="contact-us">
          <div className="container">
            <div className="row flex-lg-row-reverse">

              <div className="col-lg-4 offset-lg-1 position-relative">
                <Image src={contactGirl} alt="" className="img-fluid w-100" />
                <div className="card info-card">
                  <div className="card-body">
                    <h4>Contact Details</h4>

                    <p className="mt-0">
                      <Image src={phoneWhite} alt="" width={14} height={14} className="me-2" />
                      <Link href="tel:+91-9911412626" className="text-decoration-none text-white">+91-9911412626</Link>
                    </p>
                    <p>
                      <Image src={mailBox} alt="" width={14} height={14} className="me-2" />
                      <Link href="mailto:info@bookmyparty.co.in" className="text-decoration-none text-white">info@bookmyparty.co.in</Link>
                      {/* info@bookmyparty.co.in */}
                    </p>
                    <p>
                      <Image src={locationWhite} alt="" width={14} height={14} className="me-2" />
											Delhi, India
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-7">
                <form onSubmit={formik.handleSubmit} className="mt-3 mt-lg-0">
                  <h5 className="main-head">
										We&#39;re here for you
                  </h5>
                  <p className="main-description">
										Send us a message and we&#39;ll respond as soon as possible
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

                  <TextArea
                    rows={8}
                    name="input_5"
                    placeholder="Message"
                    value={formik.values.input_5}
                    onChange={formik.handleChange}
                  />

                  <Button label="Submit" type="submit" loading={loading} className="primary" />
                </form>
              </div>

            </div>
          </div>
        </section>

        <section className="contact-map">
          <div className="container-fluid">
            <div className="row">
              <div className="col p-0">
                <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1792119.8427282285!2d76.317322!3d28.682644!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi!5e0!3m2!1sen!2sin!4v1709012948933!5m2!1sen!2sin" width="100" height="350" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-100"></iframe>
              </div>
            </div>
          </div>
        </section>
      </Layout >
    </>
  );
};

export default ContactUs;
