import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { isLoggedInVar } from '../../../apollo';
import { AZ_NUM_PATTERN, PW_MIN_LENGTH, TOKEN } from '../../../constants';
import { useWhoAmI } from '../../../hooks/useWhoAmI';
import {
  deleteAccountMutation,
  deleteAccountMutationVariables,
} from '../../../__generated__/deleteAccountMutation';
import { FormError } from '../../Form-error';
import { ISettingsFormProps } from '../Settings';

const DELETE_ACCOUNT_MUTAION = gql`
  mutation deleteAccountMutation($input: DeleteAccountInput!) {
    deleteAccount(input: $input) {
      ok
      error
    }
  }
`;

interface IAccountProps {
  hidden: boolean;
}

export const Account: React.FC<IAccountProps> = ({ hidden }) => {
  const history = useHistory();
  const { data: userData } = useWhoAmI();
  const { register, errors } = useFormContext<ISettingsFormProps>();
  const onCompleted = async (data: deleteAccountMutation) => {
    const {
      deleteAccount: { ok, error },
    } = data;
    console.log(ok, error);
    if (ok && !error && userData) {
      localStorage.removeItem(TOKEN);
      isLoggedInVar(false);
      history.push('/');
    }
  };
  const [deleteAccountMutation] = useMutation<
    deleteAccountMutation,
    deleteAccountMutationVariables
  >(DELETE_ACCOUNT_MUTAION, { onCompleted });
  const onDeleteAccountClick = () => {
    deleteAccountMutation({ variables: { input: { password: null } } });
  };
  return (
    <div className={`${hidden ? 'hidden' : 'block'}`}>
      <div className="px-6 mb-6 rounded-lg border border-myGray-light bg-white overflow-hidden">
        <div className="py-6 flex items-center justify-between border-b border-myGray-light">
          <span className="text-myGreen-dark text-xl font-semibold">
            Account information
          </span>
          <span
            className="text-xs text-myGray underline cursor-pointer hover:text-myGray-dark"
            onClick={onDeleteAccountClick}
          >
            Delete account
          </span>
        </div>
        <div className="py-6 grid gap-6 grid-cols-oneToThree">
          <h6 className="pt-1.5 whitespace-pre text-myGreen-dark font-semibold">
            Personal link
          </h6>
          <div className="grid">
            <div className="grid grid-cols-2">
              <div className="flex items-center justify-center bg-myGray-light text-myGray-dark border-t border-b border-l border-myGray rounded-l-sm">
                xxx.netlyfy.com/
              </div>

              <input
                className="px-4 py-3 border border-solid border-myGray rounded-r-sm focus:border-myBlue focus:outline-none"
                ref={register({
                  required: 'Enter a profile link',
                  pattern: {
                    value: AZ_NUM_PATTERN,
                    message: 'Only english characters and numbers are allowed.',
                  },
                })}
                name="username"
                type="text"
                placeholder="Your link name"
              />
            </div>
            {errors.username?.message && (
              <FormError err={errors.username.message} />
            )}
          </div>
        </div>
      </div>
      <div className="px-6 rounded-lg border border-myGray-light bg-white overflow-hidden">
        <div className="py-6 flex items-center justify-between border-b border-myGray-light">
          <span className="text-myGreen-dark text-xl font-semibold">
            Password
          </span>
          <span className="text-xs text-myGray-dark">
            Leave blank if you don't want to change it
          </span>
        </div>
        <div className="py-6 grid gap-6 grid-cols-oneToThree">
          <h6 className="pt-1.5 whitespace-pre text-myGreen-dark font-semibold">
            Current password
          </h6>
          <div className="grid">
            <input
              className="input"
              ref={register({
                minLength: {
                  value: PW_MIN_LENGTH,
                  message: `Password length should be at least ${PW_MIN_LENGTH}.`,
                },
              })}
              name="password"
              type="password"
            />
            {errors.password?.message && (
              <FormError err={errors.password?.message} />
            )}
          </div>
          <h6 className="pt-1.5 whitespace-pre text-myGreen-dark font-semibold">
            New password
          </h6>
          <div className="grid">
            <input
              className="input"
              ref={register({
                minLength: {
                  value: PW_MIN_LENGTH,
                  message: `Password length should be at least ${PW_MIN_LENGTH}.`,
                },
              })}
              name="newPasswords[0]"
              type="password"
            />
            {errors.newPasswords && errors.newPasswords[0]?.message && (
              <FormError err={errors.newPasswords[0]?.message} />
            )}
          </div>
          <h6 className="pt-1.5 whitespace-pre text-myGreen-dark font-semibold">
            New password again
          </h6>
          <div className="grid">
            <input
              className="input"
              ref={register({
                minLength: {
                  value: PW_MIN_LENGTH,
                  message: `Password length should be at least ${PW_MIN_LENGTH}.`,
                },
              })}
              name="newPasswords[1]"
              type="password"
            />
            {errors.newPasswords && errors.newPasswords[1]?.message && (
              <FormError err={errors.newPasswords[1]?.message} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
