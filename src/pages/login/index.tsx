import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import store from 'store'

import Link from 'next/link';

import * as yup from 'yup'
import { useFormik } from 'formik';

import { AppDispatch } from '@/redux/store';
import { setAuthToken, setLoggedInUser } from '@/redux/slices/session.slice';

import { authService } from '@/services/session.service';

import { Button, CheckBox, InputField } from '@/stories/form-inputs';

import { _Object } from '@/utils/types';
import { closeModal } from '@/utils/helpers';
import { mail, password } from '@/assets/images';
import { useRouter } from 'next/router';
import ResetPasswordModal from '@/components/auth/reset-password';
import { Breadcrumb, Layout, SEOHead } from '@/components';

const LoginModal = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>()

  const [loading, setLoading] = useState<boolean>(false)

  const reloadPage = () => {
    router.reload(); // Reload the page
  };

  useEffect(() => {
    const token = store.get(`${process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY}`)
    if (token?.length > 0) {
      router.push('/')
    }
  }, [])

  const formik = useFormik({
    initialValues: {
      userName: '',
      password: ''
    },

    enableReinitialize: true,

    validationSchema: yup.object().shape({
      userName: yup.string().label('Username & Email').required('Username & Email is required').min(4, 'Username must be at least 4 characters'),
      password: yup.string().label('Password').required('Password is required').min(4, 'Password must be at least 4 characters')
    }),

    onSubmit: async (values) => {
      setLoading(true)
      authService.customerLogin(values.password, values.userName).then((result: _Object) => {
        if (result?.authToken?.length > 0) {
          toast.success('Login successfully')
          dispatch(setAuthToken(result))
          dispatch(setLoggedInUser())
          formik.resetForm();
          setLoading(false)
          closeModal('LoginModal')
          setTimeout(() => {
            reloadPage()
          }, 4000);
        } else {
          setLoading(false)
        }
      })
    }
  })

  return (
    <Layout>
      <SEOHead seo={{
        title: 'Login - Book My Party', metaDesc: ''
      }} />
      <section className="page-content-hero">
        <div className="container">
          <div className="row">
            <div className="col">
              <h1>
								Login
              </h1>
            </div>
          </div>
        </div>
      </section>

      <Breadcrumb
        data={
          [
            {
              label: 'Login',
              target: ''
            }
          ]
        }
      />

      <section className="login-page-form">
        <div className="container">
          <form onSubmit={formik.handleSubmit}>
            <InputField
              type="text"
              name="userName"
              placeholder="Email or Username"
              required={true}
              value={formik.values.userName}
              onChange={formik.handleChange}
              error={formik.touched.userName && formik.errors.userName}
              image={mail}
            />

            <InputField
              name="password"
              placeholder="Password"
              type="password"
              required={true}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && formik.errors.password}
              image={password}
            />
            <div className="text-center">
              <Button
                className="primary"
                label="Log in"
                loading={loading}
                type="submit"
                disabled={loading}
              />
            </div>
            <div className="remember-me mt-3">

              <ul className="list-unstyled d-flex justify-content-between mb-0">
                <li>
                  <CheckBox
                    className="mt-0"
                    options={[{
                      label: 'Remember me', value: 'Remember me'
                    }]}
                  />
                </li>
                <li>
                  <Link onClick={() => formik.resetForm()} href="" data-bs-toggle="modal" data-bs-target="#ResetPasswordModal" className="text-decoration-none">
										Forgot Password?
                  </Link>
                </li>
              </ul>
            </div>

            <hr />

            <p className="mb-0 mt-3 pt-1 text-center fw-medium">
							Do not have an account?&nbsp;
              <Link onClick={() => formik.resetForm()} href="#" className="text-decoration-none" data-bs-toggle="modal" data-bs-target="#SignUpModal">
								Sign Up
              </Link>
            </p>
          </form>

        </div>
      </section>
      <ResetPasswordModal />
    </Layout>
  )
}

export default LoginModal