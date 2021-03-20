import { gql, useApolloClient, useMutation } from '@apollo/client';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useHistory } from 'react-router';
import { logUserOut } from '../../../apollo/reactive-variables';
import { NAME_PATTERN, PW_MIN_LENGTH } from '../../../constants';
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
  slug: string;
}

export const Account: React.FC<IAccountProps> = ({ hidden, slug }) => {
  const client = useApolloClient();
  const history = useHistory();
  const { register, errors } = useFormContext<ISettingsFormProps>();

  const onCompleted = async (data: deleteAccountMutation) => {
    const {
      deleteAccount: { ok, error },
    } = data;
    if (ok && !error) {
      client.cache.evict({ id: `User:${slug}` });
      logUserOut();
      history.push('/');
    }
  };
  const [deleteAccountMutation, { loading }] = useMutation<
    deleteAccountMutation,
    deleteAccountMutationVariables
  >(DELETE_ACCOUNT_MUTAION, { onCompleted });

  const onDeleteAccountClick = () => {
    if (loading) return;
    const isConfirmed = window.confirm(
      'Your account will be removed permanently. Are you sure?',
    );
    if (!isConfirmed) return;
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
          <div className="pt-1.5 whitespace-pre text-myGreen-dark">
            <h6 className="font-semibold">Personal link</h6>
            <span className="text-sm">(username)</span>
          </div>
          <div className="grid">
            <div className="grid grid-cols-2">
              <div className="flex items-center justify-center text-xs bg-myGray-light text-myGray-dark border-t border-b border-l border-myGray rounded-l-sm">
                polartypes.netlify.app/
              </div>
              <input
                className="px-4 py-3 border border-solid border-myGray rounded-r-sm focus:border-myBlue focus:outline-none"
                ref={register({
                  required: 'Enter a profile link',
                  pattern: NAME_PATTERN,
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
