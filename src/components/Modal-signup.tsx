import { gql, useMutation } from '@apollo/client';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useForm } from 'react-hook-form';
import { AZ_NUM_PATTERN, EMAIL_PATTERN, PW_MIN_LENGTH } from '../constants';
import {
  createAccountMutation,
  createAccountMutationVariables,
} from '../__generated__/createAccountMutation';
import { Button } from './Button';
import { FormError } from './Form-error';

const CREATE_ACCOUNT_MUTAION = gql`
  mutation createAccountMutation($input: CreateAccountInput!) {
    createAccount(input: $input) {
      ok
      error
    }
  }
`;

interface ISignupModalProps {
  setIsSignup: React.Dispatch<React.SetStateAction<boolean | null>>;
}

interface IFormProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const SignupModal: React.FC<ISignupModalProps> = ({ setIsSignup }) => {
  const {
    register,
    getValues,
    formState,
    handleSubmit,
    errors,
  } = useForm<IFormProps>({ mode: 'onChange' });
  const onCompleted = ({
    createAccount: { ok, error },
  }: createAccountMutation) => {
    console.log(ok, error);
  };
  const [
    createAccountMutation,
    { loading, data: mutationResult },
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTAION,
    { onCompleted },
  );
  const onSubmit = () => {
    createAccountMutation({ variables: { input: { ...getValues() } } });
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
          New account
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-5 p-6">
          <div>
            <div className="grid grid-cols-2 gap-2">
              <input
                ref={register({
                  required: 'Your first name is required.',
                  pattern: AZ_NUM_PATTERN,
                })}
                name="firstName"
                type="text"
                placeholder="First name"
                className="input w-full"
              />
              <input
                ref={register({
                  required: 'Your last name is required.',
                  pattern: AZ_NUM_PATTERN,
                })}
                name="lastName"
                type="text"
                placeholder="Last name"
                className="input w-full"
              />
            </div>
            {(errors.firstName?.message || errors.lastName?.message) && (
              <div className="grid grid-cols-2 gap-2">
                <FormError err={errors.firstName?.message} />
                <FormError err={errors.lastName?.message} />
              </div>
            )}
          </div>
          <div className="grid">
            <input
              ref={register({
                required: 'Your e-mail address is required.',
                pattern: EMAIL_PATTERN,
              })}
              name="email"
              type="email"
              placeholder="Email"
              className="input"
            />
            {errors.email?.message && <FormError err={errors.email.message} />}
          </div>
          <div className="grid mb-2">
            <input
              ref={register({
                required: 'You need to enter a password.',
                minLength: PW_MIN_LENGTH,
              })}
              name="password"
              type="password"
              placeholder="Password"
              className="input"
            />
            {errors.password?.message && (
              <FormError err={errors.password?.message} />
            )}
          </div>
          {mutationResult?.createAccount.error && (
            <FormError err={mutationResult.createAccount.error} />
          )}
          <Button
            text="Sign up"
            type="red-solid"
            disabled={!formState.isValid}
            loading={loading}
          />
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
