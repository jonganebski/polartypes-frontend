import { gql } from '@apollo/client';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { client } from '../../apollo';
import { deleteFiles, sleep } from '../../helpers';
import { useUpdateAccount } from '../../hooks/useUpdateAccount';
import { useWhoAmI } from '../../hooks/useWhoAmI';
import { updateAccountMutation } from '../../__generated__/updateAccountMutation';
import { updatedUser } from '../../__generated__/updatedUser';
import { Button } from '../Button';
import { Account } from './partials/Account';
import { ModalBackground } from './partials/Background';
import { ModalCloseIcon } from './partials/CloseIcon';
import { Profile } from './partials/Profile';

interface ISettingsModal {
  isProfile: boolean;
  setIsProfile: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSettingModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ISettingsFormProps {
  firstName: string;
  lastName: string;
  username: string;
  about: string;
  city: string;
  timeZone: string;
  password: string;
  newPasswords: string[];
  files: FileList;
}

export const SettingsModal: React.FC<ISettingsModal> = ({
  isProfile,
  setIsProfile,
  setIsSettingModal,
}) => {
  const history = useHistory();
  const { data: userData } = useWhoAmI();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(
    userData?.whoAmI.avatarUrl ?? 'blank-profile.webp',
  );
  const [avatarUrl, setAvatarUrl] = useState(
    userData?.whoAmI.avatarUrl ?? null,
  );
  const f = useForm<ISettingsFormProps>({
    mode: 'onChange',
    defaultValues: {
      firstName: userData?.whoAmI.firstName,
      lastName: userData?.whoAmI.lastName,
      username: userData?.whoAmI.username,
      about: userData?.whoAmI.about ?? '',
      city: userData?.whoAmI.city ?? '',
      timeZone: userData?.whoAmI.timeZone ?? '',
    },
  });
  const onCompleted = async (data: updateAccountMutation) => {
    const {
      updateAccount: { ok, error },
    } = data;
    console.log(ok, error);
    if (ok && !error && userData) {
      const {
        about,
        city,
        firstName,
        lastName,
        username,
        timeZone,
      } = f.getValues();
      client.writeFragment<updatedUser>({
        id: `Users:${userData.whoAmI.id}`,
        fragment: gql`
          fragment updatedUser on Users {
            id
            firstName
            lastName
            username
            slug
            city
            timeZone
            avatarUrl
            about
          }
        `,
        data: {
          __typename: 'Users',
          id: userData.whoAmI.id,
          about,
          avatarUrl,
          city,
          firstName,
          lastName,
          timeZone,
          username,
          slug: username.toLowerCase(),
        },
      });
      await sleep(2000);
      if (userData.whoAmI.username !== username) {
        history.push(`/${username}`);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };
  const [updateAccountMutation] = useUpdateAccount(onCompleted);
  const onSubmit = async () => {
    setIsLoading(true);
    const { files, password, newPasswords, ...values } = f.getValues();
    if (password || newPasswords[0] || newPasswords[1]) {
      if (newPasswords[0] !== newPasswords[1]) {
        f.setError('newPasswords[1]', {
          message: 'Please check your new password again.',
        });
        return;
      }
    }
    try {
      let url = avatarUrl;
      if (files.length !== 0) {
        const body = new FormData();
        body.append('file', files[0]);
        const response = await fetch('http://localhost:4000/aws-s3/upload', {
          body,
          method: 'POST',
        });
        avatarUrl && (await deleteFiles([avatarUrl]));
        const result = await response.json();
        console.log(result.error);
        if (result.ok && !result.error && result.url) {
          url = result.url;
        } else {
          throw new Error();
        }
      }
      setAvatarUrl(url);
      updateAccountMutation({
        variables: {
          input: {
            ...values,
            slug: values.username.toLowerCase(),
            avatarUrl: url,
            password: password ? password : null,
            newPassword: newPasswords[0] ? newPasswords[0] : null,
          },
        },
      });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  if (!userData) {
    return null;
  }
  return (
    <>
      <ModalBackground onClick={() => setIsSettingModal(false)} />
      <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-2xl overflow-hidden">
        <ModalCloseIcon onClick={() => setIsSettingModal(false)} />
        <div className="p-6 text-2xl text-myGreen-darkest font-semibold border-b">
          Settings
        </div>
        <div className="p-6 flex bg-myGray-lightest">
          <div className="mr-6">
            <div className="w-48 grid gap-y-px rounded-lg border border-myGray-light bg-myGray-light overflow-hidden">
              <div
                className={`p-3 flex items-center justify-between  font-semibold bg-white border-l-4 cursor-pointer ${
                  isProfile
                    ? 'border-myRed text-myRed'
                    : 'border-transparent text-myGreen-dark'
                }`}
                onClick={() => setIsProfile(true)}
              >
                <span>Profile</span>
                <FontAwesomeIcon icon={faAngleRight} />
              </div>
              <div
                className={`p-3 flex items-center justify-between  font-semibold bg-white border-l-4 cursor-pointer ${
                  !isProfile
                    ? 'border-myRed text-myRed'
                    : 'border-transparent text-myGreen-dark'
                }`}
                onClick={() => setIsProfile(false)}
              >
                <span>Account</span>
                <FontAwesomeIcon icon={faAngleRight} />
              </div>
            </div>
          </div>
          <FormProvider {...f}>
            <form className="w-full" onSubmit={f.handleSubmit(onSubmit)}>
              <Profile
                hidden={!isProfile}
                userData={userData}
                avatarUrl={avatarUrl}
                avatarSrc={avatarSrc}
                setAvatarSrc={setAvatarSrc}
              />
              <Account hidden={isProfile} />
              <div className="pt-6">
                <Button
                  text="Save Changes"
                  type="red-solid"
                  className="mr-3"
                  loading={isLoading}
                />
                <Button
                  text="cancel"
                  type="white-solid"
                  isSubmitBtn={false}
                  onClick={() => setIsSettingModal(false)}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};
