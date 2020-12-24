import { gql, useMutation } from '@apollo/client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { authTokenVar, isLoggedInVar } from '../../apollo';
import { PW_MIN_LENGTH, TOKEN } from '../../constants';
import {
  signInMutation,
  signInMutationVariables,
} from '../../__generated__/signInMutation';
import { Button } from '../Button';
import { FormError } from '../Form-error';
import { ModalCloseIcon } from './partials/CloseIcon';
import { ModalBackground } from './partials/Background';

const SIGN_IN_MUTATION = gql`
  mutation signInMutation($input: LoginInput!) {
    login(input: $input) {
      ok
      error
      token
      username
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
  const history = useHistory();
  const {
    register,
    getValues,
    formState,
    handleSubmit,
    errors,
  } = useForm<IFormProps>({ mode: 'onChange' });
  const onCompleted = (data: signInMutation) => {
    const {
      login: { ok, error, token, username },
    } = data;
    console.log(data);
    if (ok && token && username && !error) {
      localStorage.setItem(TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
      history.push(`/${username}`);
    }
  };
  const [signInMutation, { loading, data: MutationResult }] = useMutation<
    signInMutation,
    signInMutationVariables
  >(SIGN_IN_MUTATION, { onCompleted });
  const onSubmit = () => {
    signInMutation({ variables: { input: { ...getValues() } } });
  };
  return (
    <>
      <ModalBackground onClick={() => setIsSignup(null)} />
      <div className="modal">
        <ModalCloseIcon onClick={() => setIsSignup(null)} />
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
