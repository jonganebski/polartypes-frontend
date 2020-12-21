import { gql, useMutation } from '@apollo/client';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useForm } from 'react-hook-form';
import { PW_MIN_LENGTH } from '../constants';
import {
  signInMutation,
  signInMutationVariables,
} from '../__generated__/signInMutation';
import { Button } from './Button';
import { FormError } from './Form-error';

const SIGN_IN_MUTATION = gql`
  mutation signInMutation($input: LoginInput!) {
    login(input: $input) {
      ok
      error
      token
    }
  }
`;

interface IFormProps {
  usernameOrEmail: string;
  password: string;
  rememberMe: boolean;
}

interface ISigninModalProps {
  setIsSignup: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export const SigninModal: React.FC<ISigninModalProps> = ({ setIsSignup }) => {
  const {
    register,
    getValues,
    formState,
    handleSubmit,
    errors,
  } = useForm<IFormProps>({ mode: 'onChange' });
  const onCompleted = (data: signInMutation) => {
    console.log(data);
  };
  const [signInMutation, { loading, data: MutationResult }] = useMutation<
    signInMutation,
    signInMutationVariables
  >(SIGN_IN_MUTATION, { onCompleted });
  const onSubmit = () => {
    const { usernameOrEmail, password } = getValues();
    signInMutation({ variables: { input: { usernameOrEmail, password } } });
  };
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
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-5 p-6">
          <div className="grid">
            <input
              ref={register({
                required: 'Please enter your e-mail or username',
              })}
              name="usernameOrEmail"
              type="text"
              placeholder="Email or username"
              className="input"
            />
            {errors.usernameOrEmail?.message && (
              <FormError err={errors.usernameOrEmail.message} />
            )}
          </div>
          <div className="grid">
            <input
              ref={register({
                required: 'Please enter your password',
                minLength: PW_MIN_LENGTH,
              })}
              name="password"
              type="password"
              placeholder="Password"
              className="input"
            />
            {errors.password?.message && (
              <FormError err={errors.password.message} />
            )}
          </div>
          <label className="flex items-center cursor-pointer">
            <input
              ref={register}
              name="rememberMe"
              type="checkbox"
              className="w-4 h-4 mr-2"
            />
            <span>Remember me</span>
          </label>
          {MutationResult?.login.error && (
            <FormError err={MutationResult.login.error} />
          )}
          <Button
            text="Sign in"
            type="red-solid"
            disabled={!formState.isValid}
            loading={loading}
          />
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
