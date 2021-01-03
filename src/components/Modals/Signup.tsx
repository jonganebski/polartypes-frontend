import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { authTokenVar, isLoggedInVar } from '../../apollo';
import {
  AZ_NUM_PATTERN,
  EMAIL_PATTERN,
  PW_MIN_LENGTH,
  TOKEN,
} from '../../constants';
import {
  createAccountMutation,
  createAccountMutationVariables,
} from '../../__generated__/createAccountMutation';
import { Button } from '../Button';
import { FormError } from '../Form-error';
import { ModalBackground } from './partials/Background';
import { ModalCloseIcon } from './partials/CloseIcon';

const CREATE_ACCOUNT_MUTAION = gql`
  mutation createAccountMutation($input: CreateAccountInput!) {
    createAccount(input: $input) {
      ok
      error
      token
      username
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
  const history = useHistory();
  const {
    register,
    getValues,
    formState,
    handleSubmit,
    errors,
  } = useForm<IFormProps>({ mode: 'onChange' });
  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok, error, token, username },
    } = data;
    if (ok && token && username && !error) {
      localStorage.setItem(TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
      history.push(`/${username}`);
    }
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
      <ModalBackground onClick={() => setIsSignup(null)} />
      <div className="modal">
        <ModalCloseIcon onClick={() => setIsSignup(null)} />
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
