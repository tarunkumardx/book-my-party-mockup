import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import Link from 'next/link';

import * as yup from 'yup'
import { useFormik } from 'formik';

import { AppDispatch } from '@/redux/store';
import { setAuthToken, setLoggedInUser } from '@/redux/slices/session.slice';

import { authService } from '@/services/session.service';

import { Button, CheckBox, InputField } from '@/stories/form-inputs';

import { _Object } from '@/utils/types';
import { closeModal } from '@/utils/helpers';
import ResetPasswordModal from './reset-password';
import { mail, modalClose, password } from '@/assets/images';
import Image from 'next/image';
// import { useRouter } from 'next/router';

const LoginModal = () => {
  // const router = useRouter();
  const dispatch = useDispatch<AppDispatch>()

  const [loading, setLoading] = useState<boolean>(false)

  // const reloadPage = () => {
  //   router.reload(); // Reload the page
  // };

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
          console.log(result)
          toast.success('Login successfully')
          dispatch(setAuthToken(result))
          dispatch(setLoggedInUser())
          formik.resetForm();
          setLoading(false)
          closeModal('LoginModal')
          // if (router.pathname != '/booking/[slug]') {
          //   setTimeout(() => {
          //     reloadPage()
          //   }, 4000);
          // }
        } else {
          setLoading(false)
        }
      })
    }
  })

  return (
    <>
      <div className="modal fade" id="LoginModal" tabIndex={-1} aria-labelledby="LoginModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h4 className="d-flex align-items-center justify-content-center">
                Log In
                <button type="button" onClick={() => formik.resetForm()} className="btn border-0 p-0 px-2 modal-close" data-bs-dismiss="modal" aria-label="Close">
                  <Image style={{ position: 'absolute', right: '20px' }} src={modalClose} alt="" />
                </button>
              </h4>

              <form className="mt-3" onSubmit={formik.handleSubmit}>
                <div className="input-container">
                  <InputField
                    type="text"
                    name="userName"
                    placeholder="Email or Username"
                    required={true}
                    value={formik.values.userName}
                    onChange={formik.handleChange}
                    error={formik.touched.userName && formik.errors.userName}
                  />
                  <Image src={mail} alt="password-icon" className="password-icon" />
                </div>

                <div className="input-container">
                  <InputField
                    name="password"
                    placeholder="Password"
                    type="password"
                    required={true}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && formik.errors.password}
                  />
                  <Image src={password} alt="password-icon" className="password-icon" />
                </div>

                <div className="btn-login">
                  <Button
                    className="primary w-100"
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

                {/* <p className="text-center fw-normal continue-with">
									or continue with
								</p>

								<div className="row">
									<div className="col-4">
										<Link href="" className="btn p-0">
											<svg width="100%" viewBox="0 0 140 40" version="1.1" xmlns="http://www.w3.org/2000/svg">

												<defs></defs>
												<g id="Hotel-layout" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
													<g id="Log-In" transform="translate(-496.000000, -560.000000)">
														<g id="login" transform="translate(466.000000, 80.000000)">
															<g id="social" transform="translate(0.000000, 417.000000)">
																<g id="fb" transform="translate(30.000000, 63.000000)">
																	<rect id="Rectangle-2" fill="#395899" x="0" y="0" width="140" height="40" rx="3"></rect>
																	<g transform="translate(26.000000, 9.000000)">
																		<text id="Facebook" fontFamily="Poppins-Medium, Poppins" fontSize="14" fontWeight="400" fill="#F9F9F9">
																			<tspan x="19" y="16">Facebook</tspan>
																		</text>
																		<g id="facebook-logo" transform="translate(0.000000, 3.000000)" fill="#FFFFFF" fillRule="nonzero">
																			<path d="M8.24940206,0.00329896907 L6.19331959,0 C3.88338144,0 2.39059794,1.53154639 2.39059794,3.90202062 L2.39059794,5.7011134 L0.323298969,5.7011134 C0.144659794,5.7011134 0,5.84593814 0,6.02457732 L0,8.63125773 C0,8.80989691 0.144824742,8.9545567 0.323298969,8.9545567 L2.39059794,8.9545567 L2.39059794,15.5320412 C2.39059794,15.7106804 2.53525773,15.8553402 2.71389691,15.8553402 L5.41113402,15.8553402 C5.5897732,15.8553402 5.73443299,15.7105155 5.73443299,15.5320412 L5.73443299,8.9545567 L8.15158763,8.9545567 C8.3302268,8.9545567 8.4748866,8.80989691 8.4748866,8.63125773 L8.47587629,6.02457732 C8.47587629,5.93880412 8.44173196,5.85665979 8.38119588,5.79595876 C8.32065979,5.73525773 8.23818557,5.7011134 8.15241237,5.7011134 L5.73443299,5.7011134 L5.73443299,4.176 C5.73443299,3.44296907 5.9091134,3.07084536 6.864,3.07084536 L8.24907216,3.07035052 C8.42754639,3.07035052 8.57220619,2.92552577 8.57220619,2.74705155 L8.57220619,0.326597938 C8.57220619,0.14828866 8.42771134,0.00362886598 8.24940206,0.00329896907 Z" id="Shape"></path>
																		</g>
																	</g>
																</g>
															</g>
														</g>
													</g>
												</g>
											</svg>
										</Link>
									</div>
									<div className="col-4">
										<Link href="" className="btn p-0">
											<svg width="100%" viewBox="0 0 140 40" version="1.1" xmlns="http://www.w3.org/2000/svg">

												<defs></defs>
												<g id="Hotel-layout" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
													<g id="Log-In" transform="translate(-816.000000, -560.000000)">
														<g id="login" transform="translate(466.000000, 80.000000)">
															<g id="social" transform="translate(0.000000, 417.000000)">
																<g id="g+" transform="translate(350.000000, 63.000000)">
																	<rect id="Rectangle-2" fill="#F34A38" x="0" y="0" width="140" height="40" rx="3"></rect>
																	<g id="Group-3" transform="translate(24.000000, 9.000000)" fill="#FFFFFF">
																		<g id="google-plus" transform="translate(10.000000, 3.000000)" fillRule="nonzero">
																			<path d="M8.74974949,9.62441417 L12.6460216,9.62441417 C11.9621032,11.5580196 10.1098039,12.9443598 7.9412597,12.9283598 C5.3100216,12.9089312 3.13434813,10.804006 3.03219847,8.17467268 C2.92270187,5.3562237 5.18387194,3.02838696 7.97842977,3.02838696 C9.25619847,3.02838696 10.4222393,3.51524411 11.3013141,4.31301281 C11.5095318,4.50201962 11.8264842,4.5032169 12.0312733,4.31045499 L13.4623481,2.96357064 C13.6861304,2.75290397 13.6869468,2.39714887 13.4638175,2.18577472 C12.0696951,0.865012814 10.1995454,0.0417747189 8.13723249,0.00150261009 C3.73853861,-0.0843749409 0.0308379286,3.52210125 0.000198472791,7.92155703 C-0.0307130918,12.3540468 3.55312364,15.9568768 7.97842977,15.9568768 C12.2341577,15.9568768 15.7107291,12.6246863 15.9435998,8.42718968 C15.9498039,8.37456383 15.9538855,6.59600601 15.9538855,6.59600601 L8.74974949,6.59600601 C8.45445698,6.59600601 8.21511004,6.83535295 8.21511004,7.13064547 L8.21511004,9.08977472 C8.21511004,9.38506724 8.4545114,9.62441417 8.74974949,9.62441417 Z" id="Shape"></path>
																		</g>
																		<text id="Google" fontFamily="Poppins-Medium, Poppins" fontSize="14" fontWeight="400">
																			<tspan x="36" y="16">Google</tspan>
																		</text>
																	</g>
																</g>
															</g>
														</g>
													</g>
												</g>
											</svg>
										</Link>
									</div>
									<div className="col-4">
										<Link href="" className="btn p-0">
											<svg width="100%" viewBox="0 0 140 40" version="1.1" xmlns="http://www.w3.org/2000/svg">

												<defs></defs>
												<g id="Hotel-layout" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
													<g id="Log-In" transform="translate(-656.000000, -560.000000)">
														<g id="login" transform="translate(466.000000, 80.000000)">
															<g id="social" transform="translate(0.000000, 417.000000)">
																<g id="tt" transform="translate(190.000000, 63.000000)">
																	<rect id="Rectangle-2" fill="#03A9F4" x="0" y="0" width="140" height="40" rx="3"></rect>
																	<g id="Group-2" transform="translate(31.000000, 9.000000)" fill="#FFFFFF">
																		<text id="Twitter" fontFamily="Poppins-Medium, Poppins" fontSize="14" fontWeight="400">
																			<tspan x="30" y="16">Twitter</tspan>
																		</text>
																		<g id="twitter" transform="translate(0.000000, 3.000000)" fillRule="nonzero">
																			<path d="M19.6923077,1.89415385 C18.96,2.21538462 18.1796923,2.42830769 17.3661538,2.53169231 C18.2030769,2.032 18.8418462,1.24676923 19.1421538,0.300307692 C18.3618462,0.765538462 17.5003077,1.09415385 16.5821538,1.27753846 C15.8412308,0.488615385 14.7852308,0 13.6332308,0 C11.3981538,0 9.59876923,1.81415385 9.59876923,4.03815385 C9.59876923,4.35815385 9.62584615,4.66584615 9.69230769,4.95876923 C6.336,4.79507692 3.36615385,3.18646154 1.37107692,0.736 C1.02276923,1.34030769 0.818461538,2.032 0.818461538,2.77661538 C0.818461538,4.17476923 1.53846154,5.41415385 2.61169231,6.13169231 C1.96307692,6.11938462 1.32676923,5.93107692 0.787692308,5.63446154 C0.787692308,5.64676923 0.787692308,5.66276923 0.787692308,5.67876923 C0.787692308,7.64061538 2.18707692,9.27015385 4.02215385,9.64553846 C3.69353846,9.73538462 3.33538462,9.77846154 2.96369231,9.77846154 C2.70523077,9.77846154 2.44430769,9.76369231 2.19938462,9.70953846 C2.72246154,11.3083077 4.20676923,12.4836923 5.97169231,12.5218462 C4.59815385,13.5963077 2.85415385,14.2436923 0.966153846,14.2436923 C0.635076923,14.2436923 0.317538462,14.2289231 -5.68434189e-14,14.1883077 C1.78830769,15.3415385 3.90769231,16 6.19323077,16 C13.6221538,16 17.6836923,9.84615385 17.6836923,4.512 C17.6836923,4.33353846 17.6775385,4.16123077 17.6689231,3.99015385 C18.4701538,3.42153846 19.1433846,2.71138462 19.6923077,1.89415385 Z" id="Shape"></path>
																		</g>
																	</g>
																</g>
															</g>
														</g>
													</g>
												</g>
											</svg>
										</Link>
									</div>
								</div> */}

                <hr />

                <p className="mb-0 mt-3 pt-1 text-center fw-medium">
                  Do not have an account?&nbsp;
                  <Link onClick={() => formik.resetForm()} href="#" className="text-decoration-none" data-bs-toggle="modal" data-bs-target="#SignUpModal">
                    Sign Up
                  </Link>
                </p>
              </form>

            </div>
          </div>
        </div>
      </div>
      <ResetPasswordModal />
    </>
  )
}

export default LoginModal