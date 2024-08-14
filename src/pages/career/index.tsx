import React, { useState } from 'react'
import * as yup from 'yup'
import { useFormik } from 'formik';
import { Breadcrumb, Layout, SEOHead } from '@/components';
import { Button, FileUpload, InputField, TextArea } from '@/stories/form-inputs';
import SelectField from '@/stories/form-inputs/select-field';
import { toast } from 'react-toastify';
import { closeModal } from '@/utils/helpers';
import { _Object } from '@/utils/types';
import useIsSearchable from '@/components/useIsSearchable';

const Career = (props: _Object) => {
  const isSearchable = useIsSearchable();
  const [loading, setLoading] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      input_1: '',
      input_3: '',
      input_7: '',
      input_4: 'web-developer',
      input_5: '',
      input_6: ''
    },

    enableReinitialize: true,

    validationSchema: yup.object().shape({
      input_1: yup.string().label('Name').required('Name is required').min(4, 'Name must be at least 4 characters'),
      input_3: yup.string().label('Email').email().required('Email is required'),
      input_7: yup.string().label('Phone').required('Phone number is required').min(10, 'Phone number must be at least 10 digits')
    }),

    onSubmit: async (values) => {
      setLoading(true)
      const domain = new URL(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}`).hostname;
      const response = await fetch(`https://${domain}/wp-json/gf/v2/forms/7/submissions`, {
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
  const openings = [
    { label: 'Web Developer', value: 'web-developer' },
    { label: 'SEO Executive', value: 'seo-executive' },
    { label: 'Social Media', value: 'social-media' },
    { label: 'Digital Marketing', value: 'digital-marketing' },
    { label: 'Business Development Manager', value: 'business-development-manager' },
    { label: 'Event Manager', value: 'event-manager' }
  ]

  return (
    <>
      <Layout {...props}>
        <SEOHead seo={{
          title: 'Career - Book My Party', metaDesc: ''
        }} />
        <section className="page-content-hero">
          <div className="container">
            <div className="row">
              <div className="col">
                <h1>
									Career
                </h1>
              </div>
            </div>
          </div>
        </section>

        <Breadcrumb
          data={
            [
              {
                label: 'Career',
                target: ''
              }
            ]
          }
        />

        <section className="career">
          <div className="container">
            <div className="row">
              <h3 className="main-head">Join Us</h3>
              <p className="main-description">Ready to take the next step in your career? Apply to join the BookMyParty team.</p>
              <div className="col-lg-5">
                <h4>
									Why Join BookMyParty?
                </h4>
                <ul>
                  <li><strong>Impact:</strong> Be a part of a team that is shaping the future of BookMyParty.</li>
                  <li><strong>Collaboration:</strong> Work alongside talented professionals who value teamwork and innovation.</li>
                  <li><strong>Opportunity:</strong> Grow your career in a supportive environment that encourages learning and development.</li>
                  <li><strong>Culture:</strong> Enjoy a positive and inclusive workplace culture where your contributions are valued and recognized.</li>
                </ul>

              </div>
              <div className="col-lg-6 offeset-lg-1 mx-auto">
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

                  <InputField
                    className="col-12 col-md-6"
                    type="number"
                    placeholder="Phone"
                    // label="Phone"
                    name="input_7"
                    required={true}
                    value={formik.values.input_7}
                    onChange={(e) => {
                      const inputValue = e.target.value.replace(/\D/g, '');
                      if (inputValue.length <= 10) {
                        formik.handleChange(e);
                      }
                    }}
                    error={formik.touched.input_7 && formik.errors.input_7}
                  />

                  <SelectField
                    clasName="col-12"
                    // label="Opening"
                    name="input_6"
                    value={{ value: formik.values.input_4 }}
                    options={openings}
                    onChange={(val: _Object) => {
                      formik.setFieldValue('input_4', val.value)
                    }}
                    getOptionLabel={(option: { [key: string]: string }) => option?.label}
                    getOptionValue={(option: { [key: string]: string }) => option?.label}
                    error={formik.touched.input_4 && formik.errors.input_4}
                    isSearchable={isSearchable}
                  />

                  <FileUpload
                    // label="Upload Your CV"
                    onChange={(e: string) =>
                      formik.setFieldValue('input_5', e)
                    }
                  />

                  <TextArea
                    className="col-12"
                    placeholder="Something About Yourself"
                    // label="Message"
                    rows={6}
                    name="input_6"
                    value={formik.values.input_6}
                    onChange={formik.handleChange}
                  />
                  <div className="submit-btn">
                    <Button
                      // label="Submit"
                      type="submit"
                      loading={loading}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Career;
