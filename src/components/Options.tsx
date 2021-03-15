import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { isLoggedInVar } from '../apollo/reactive-variables';
import { TOKEN } from '../constants';
import { whoAmIQuery } from '../__generated__/whoAmIQuery';
import { Button } from './Button';
import { ModalCloseIcon } from './Modals/partials/CloseIcon';
import { SettingsModal } from './Modals/Settings';

interface IOptionProps {
  userData: whoAmIQuery | undefined;
  isOption: boolean;
  setIsOption: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Options: React.FC<IOptionProps> = ({
  userData,
  isOption,
  setIsOption,
}) => {
  const history = useHistory();
  const [isSettingsModal, setIsSettingModal] = useState(false);
  const [isProfile, setIsProfile] = useState(false);

  return (
    <>
      {isLoggedInVar() && isSettingsModal && (
        <SettingsModal
          userData={userData}
          isProfile={isProfile}
          setIsProfile={setIsProfile}
          setIsSettingModal={setIsSettingModal}
        />
      )}
      <div
        className={`fixed z-50 top-0 w-screen h-screen bg-myGreen-darkest transition-all duration-300 ${
          isOption ? 'opacity-80' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOption(false)}
      ></div>
      <div
        className={`fixed top-0 ${
          isOption ? 'right-0' : '-right-64'
        } z-50 px-8 w-64 h-screen bg-white transition-all duration-300`}
      >
        <ModalCloseIcon onClick={() => setIsOption(false)} />
        <ul className="grid gap-y-px bg-myGray-light">
          {isLoggedInVar() && (
            <li className="py-8 bg-white">
              <h5 className="mb-2 text-myGray-dark text-sm font-semibold">
                My account
              </h5>
              <h6
                className="text-myGreen-dark font-semibold cursor-pointer hover:text-myBlue"
                onClick={() => {
                  setIsOption(false);
                  setIsProfile(true);
                  setIsSettingModal(true);
                }}
              >
                Profile settings
              </h6>
              <h6
                className="text-myGreen-dark font-semibold cursor-pointer hover:text-myBlue"
                onClick={() => {
                  setIsOption(false);
                  setIsProfile(false);
                  setIsSettingModal(true);
                }}
              >
                Account settings
              </h6>
            </li>
          )}
          <li className="py-8 bg-white">
            <h5 className="mb-2 text-myGray-dark text-sm font-semibold">
              Github
            </h5>
            <a
              className="block text-myGreen-dark font-semibold hover:text-myBlue"
              href="https://github.com/jonganebski/polartypes-frontend"
              target="_blank"
              rel="noreferrer"
            >
              Frontend
            </a>
            <a
              className="block text-myGreen-dark font-semibold hover:text-myBlue"
              href="https://github.com/jonganebski/polartypes-backend"
              target="_blank"
              rel="noreferrer"
            >
              Backend
            </a>
          </li>
          <li className="py-8 bg-white">
            <h5 className="mb-2 text-myGray-dark text-sm font-semibold">
              Example trip
            </h5>
            <Link
              to="/JinseokBang"
              className="block text-myGreen-dark font-semibold hover:text-myBlue"
            >
              Jinseok's trips
            </Link>
          </li>
          <li className="py-8 bg-white">
            {isLoggedInVar() && (
              <Button
                text="Logout"
                type="red-regular"
                size="sm"
                className="w-full"
                onClick={() => {
                  localStorage.removeItem(TOKEN);
                  isLoggedInVar(false);
                  history.go(0);
                }}
              />
            )}
          </li>
        </ul>
      </div>
    </>
  );
};
