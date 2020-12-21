import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './Button';
import { FormError } from './Form-error';

interface ISignupModalProps {
  setIsSignup: React.Dispatch<React.SetStateAction<boolean | null>>;
}

interface IFormProps {}

export const SignupModal: React.FC<ISignupModalProps> = ({ setIsSignup }) => {
  const {
    register,
    getValues,
    watch,
    formState,
    handleSubmit,
  } = useForm<IFormProps>();
  return (
    <>
      <div
        onClick={() => setIsSignup(null)}
        className="fixed z-50 w-screen h-screen bg-myGreen-darkest opacity-80"
      />
      <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl">
        <div
          onClick={() => setIsSignup(null)}
          className="absolute top-1 right-1 p-2 group cursor-pointer"
        >
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="text-xl text-myGreen-darkest group-hover:text-opacity-80"
          />
        </div>
        <div className="py-6 text-center text-2xl text-myGreen-darkest font-semibold border-b">
          New account
        </div>
        <form className="grid gap-y-5 p-6">
          <div className="grid grid-cols-2 gap-2">
            <div className="grid">
              <input
                name="firstName"
                type="text"
                placeholder="First name"
                className="input w-full"
              />
              <FormError err="Your first name is required." />
            </div>
            <div className="grid">
              <input
                name="lastName"
                type="text"
                placeholder="Last name"
                className="input w-full"
              />
              <FormError err="Your last name is required." />
            </div>
          </div>
          <div className="grid">
            <input
              ref={register}
              name="email"
              type="email"
              placeholder="Email"
              className="input"
            />
            <FormError err="This email is already taken." />
          </div>
          <div className="grid mb-2">
            <input
              ref={register}
              name="password"
              type="password"
              placeholder="Password"
              className="input"
            />
            <FormError err="You need to enter a new password." />
          </div>
          <Button text="Sign up" type="red-solid" />
        </form>
        <div className="p-6 text-center bg-myGray-lightest border-t border-t-myGray-light rounded-b-2xl hover:bg-myGray-light">
          <span className="text-myGray-dark text-sm mr-1">
            Already have a Polartypes account?
          </span>
          <span
            onClick={() => {
              setIsSignup(false);
            }}
            className="text-myBlue text-sm underline cursor-pointer"
          >
            Log in
          </span>
        </div>
      </div>
    </>
  );
};
