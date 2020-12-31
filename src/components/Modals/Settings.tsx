import React, { useState } from 'react';
import { useWhoAmI } from '../../hooks/useWhoAmI';
import { Avatar } from '../Avatar';
import { ModalBackground } from './partials/Background';
import { ModalCloseIcon } from './partials/CloseIcon';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../Button';

interface ISettingsModal {
  isProfile: boolean;
  setIsProfile: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSettingModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SettingsModal: React.FC<ISettingsModal> = ({
  isProfile,
  setIsProfile,
  setIsSettingModal,
}) => {
  const { data: userData } = useWhoAmI();

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
          {isProfile ? (
            <div className="w-full">
              <div className="px-6 rounded-lg border border-myGray-light bg-white overflow-hidden">
                <div className="py-6 text-myGreen-dark text-xl font-semibold border-b border-myGray-light">
                  Profile
                </div>
                <div className="py-6 grid gap-6 grid-cols-oneToThree">
                  <h6 className="pt-1.5 whitespace-pre text-myGreen-dark font-semibold">
                    Profile picture
                  </h6>
                  <div className="flex items-center">
                    <Avatar avatarUrl={userData.whoAmI.avatarUrl} size={14} />
                    <div className="ml-3">
                      <Button
                        text="Upload a photo"
                        size="sm"
                        type="blue-regular"
                      />
                    </div>
                  </div>

                  <h6 className="pt-1.5 whitespace-pre text-myGreen-dark font-semibold">
                    First name
                  </h6>
                  <input className="input" type="text" />

                  <h6 className="pt-1.5 whitespace-pre text-myGreen-dark font-semibold">
                    Last name
                  </h6>
                  <input className="input" type="text" />

                  <h6 className="pt-1.5 whitespace-pre text-myGreen-dark font-semibold">
                    City
                  </h6>
                  <input className="input" type="text" />

                  <h6 className="pt-1.5 whitespace-pre text-myGreen-dark font-semibold">
                    Timezone
                  </h6>
                  <select
                    //   ref={register({ required: true })}
                    name="timeZone"
                    className="input w-full"
                    //   defaultValue={clientTimeZone}
                  >
                    {moment.tz.names().map((zone, i) => (
                      <option key={i} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>

                  <h6 className="pt-1.5 whitespace-pre text-myGreen-dark font-semibold">
                    About
                  </h6>
                  <textarea className="input resize-none"></textarea>
                </div>
              </div>
              <div className="pt-6">
                <Button text="Save Changes" type="red-solid" className="mr-3" />
                <Button text="cancel" type="white-solid" />
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="px-6 mb-6 rounded-lg border border-myGray-light bg-white overflow-hidden">
                <div className="py-6 flex items-center justify-between border-b border-myGray-light">
                  <span className="text-myGreen-dark text-xl font-semibold">
                    Account information
                  </span>
                  <span className="text-xs text-myGray underline cursor-pointer hover:text-myGray-dark">
                    Delete account
                  </span>
                </div>
                <div className="py-6 grid gap-6 grid-cols-oneToThree">
                  <h6 className="pt-1.5 whitespace-pre text-myGreen-dark font-semibold">
                    Personal link
                  </h6>
                  <div className="grid grid-cols-2">
                    <div className="flex items-center justify-center bg-myGray-light text-myGray-dark border-t border-b border-l border-myGray rounded-l-sm">
                      xxx.netlyfy.com/
                    </div>
                    <input
                      className="px-4 py-3 border border-solid border-myGray rounded-r-sm focus:border-myBlue focus:outline-none"
                      type="text"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 rounded-lg border border-myGray-light bg-white overflow-hidden">
                <div className="py-6 text-myGreen-dark text-xl font-semibold border-b border-myGray-light">
                  Password
                </div>
                <div className="py-6 grid gap-6 grid-cols-oneToThree">
                  <h6 className="pt-1.5 whitespace-pre text-myGreen-dark font-semibold">
                    Current password
                  </h6>
                  <input className="input" type="text" />
                  <h6 className="pt-1.5 whitespace-pre text-myGreen-dark font-semibold">
                    New password
                  </h6>
                  <input className="input" type="text" />
                  <h6 className="pt-1.5 whitespace-pre text-myGreen-dark font-semibold">
                    New password again
                  </h6>
                  <input className="input" type="text" />
                </div>
              </div>
              <div className="pt-6">
                <Button text="Save Changes" type="red-solid" className="mr-3" />
                <Button text="cancel" type="white-solid" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
