import React, { useState } from 'react'
import { Layout, SEOHead } from '@/components'
import { useFormik } from 'formik'
import { authService } from '@/services/session.service'
import { Button, InputField } from '@/stories/form-inputs'
import * as yup from 'yup'
import { _Object } from '@/utils/types'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const router: _Object = useRouter();
  const { query }: _Object = router;

  const [loading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_password: ''
    },
    enableReinitialize: true,

    validationSchema: yup.object().shape({
      password: yup
        .string()
        .label('Password')
        .required('Password is required')
        .min(4, 'Password must be at least 4 characters'),
      confirm_password: yup
        .string()
        .label('Confirm Password')
        .required('Confirm Password is required')
        .oneOf([yup.ref('password')], 'Confirm Password must match to Password')
        .min(4, 'Confirm Password must be at least 4 characters')
    }),

    onSubmit: async (values) => {
      setLoading(true)
      const data = await authService.resetPassword(values.password, query.login, query.key)
      if (data?.user?.username) {
        toast.success('Password is reset successfully')
        formik.resetForm();
        setLoading(false)
      } else {
        setLoading(false)
      }
    }
  })

  return (
    <>
      <SEOHead seo={{ title: 'Reset-password' }} />
      <Layout>
        <section className="login-form">
          <div className="container">
            <div className="row login-form-row justify-content-center">
              <form className="col-5" onSubmit={formik.handleSubmit}>
                <div className="card p-3">
                  <h3 className="text-center">Reset Password</h3>
                  <InputField
                    type="password"
                    name="password"
                    label="New Password"
                    placeholder="New Password"
                    required={true}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.errors.password}
                  />
                  <InputField
                    type="password"
                    name="confirm_password"
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    required={true}
                    value={formik.values.confirm_password}
                    onChange={formik.handleChange}
                    error={formik.errors.confirm_password}
                  />
                  <div className="btn">
                    <Button label="Reset Password" loading={loading} type="submit" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}

export default ResetPassword
