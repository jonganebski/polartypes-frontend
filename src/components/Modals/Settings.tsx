import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SERVER_URI } from '../../constants';
import { deleteFiles } from '../../helpers';
import { useUpdateAccount } from '../../hooks/useMutation/useUpdateAccount';
import { whoAmIQuery } from '../../__generated__/whoAmIQuery';
import { Button } from '../Button';
import { Account } from './partials/Account';
import { ModalBackground } from './partials/Background';
import { ModalCloseIcon } from './partials/CloseIcon';
import { Profile } from './partials/Profile';

interface ISettingsModal {
  userData: whoAmIQuery | undefined;
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
  userData,
  isProfile,
  setIsProfile,
  setIsSettingModal,
}) => {
  const [avatarSrc, setAvatarSrc] = useState(
    userData?.whoAmI.avatarUrl ?? '/blank-profile.webp',
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
  const { updateAccountMutation, isLoading, setIsLoading } = useUpdateAccount(
    f,
    avatarUrl,
  );

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
      let newUrl: string | null = null;
      const oldUrl = userData?.whoAmI.avatarUrl;
      const uploadingNewAvatar = files.length !== 0;
      if (uploadingNewAvatar) {
        const body = new FormData();
        body.append('file', files[0]);
        const response = await fetch(`${SERVER_URI}/aws-s3/upload`, {
          body,
          method: 'POST',
        });
        const result = await response.json();
        if (result.ok && !result.error && result.url) {
          newUrl = result.url;
          setAvatarUrl(newUrl);
        } else {
          throw new Error();
        }
      }
      updateAccountMutation({
        variables: {
          input: {
            ...values,
            slug: values.username.toLowerCase(),
            ...(newUrl && { avatarUrl: newUrl }),
            password: password ? password : null,
            newPassword: newPasswords[0] ? newPasswords[0] : null,
          },
        },
      }).then(
        async () =>
          uploadingNewAvatar && oldUrl && (await deleteFiles([oldUrl])),
      );
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
                avatarUrl={avatarUrl}
                avatarSrc={avatarSrc}
                setAvatarSrc={setAvatarSrc}
              />
              <Account hidden={isProfile} userId={userData.whoAmI.id} />
              <div className="pt-6">
                <Button
                  text="Save Changes"
                  type="red-solid"
                  className="mr-3"
                  loading={isLoading}
                  disabled={isLoading}
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
