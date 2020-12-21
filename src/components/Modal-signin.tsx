import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './Button';
import { FormError } from './Form-error';

interface IFormProps {
  emailOrUsername: string;
  password: string;
  remember: boolean;
}

interface ISigninModalProps {
  setIsSignup: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export const SigninModal: React.FC<ISigninModalProps> = ({ setIsSignup }) => {
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
          Sign in to Polartypes
        </div>
        <form className="grid gap-y-5 p-6">
          <input
            ref={register}
            name="emailOrUsername"
            type="text"
            placeholder="Email or username"
            className="input"
          />
          <FormError err="Please enter your e-mail or username" />
          <input
            ref={register}
            name="password"
            type="password"
            placeholder="Password"
            className="input"
          />
          <FormError err="Please enter your password" />
          <label className="flex items-center cursor-pointer">
            <input name="remember" type="checkbox" className="w-4 h-4 mr-2" />
            <span>Remember me</span>
          </label>
          <FormError err="Sorry, your username or password is wrong." />
          <Button text="Sign in" type="red-solid" />
        </form>
        <div className="p-6 text-center bg-myGray-lightest border-t border-t-myGray-light rounded-b-2xl hover:bg-myGray-light">
          <span className="text-myGray-dark text-sm mr-1">
            New to Polartypes?
          </span>
          <span
            onClick={() => {
              setIsSignup(true);
            }}
            className="text-myBlue text-sm underline cursor-pointer"
          >
            Create an account
          </span>
        </div>
      </div>
    </>
  );
};
