import { faCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { TOKEN } from '../constants';
import { Button } from './Button';
import { ModalCloseIcon } from './Modals/partials/CloseIcon';

interface IOptionProps {
  isOption: boolean;
  setIsOption: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Options: React.FC<IOptionProps> = ({ isOption, setIsOption }) => {
  const history = useHistory();
  return (
    <>
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
          <li className="py-8 bg-white">
            <h5 className="mb-2 text-myGray-dark text-sm font-semibold">
              My account
            </h5>
            <h6 className="text-myGreen-dark font-semibold">
              Profile settings
            </h6>
            <h6 className="text-myGreen-dark font-semibold">
              Account settings
            </h6>
          </li>
          <li className="py-8 bg-white">
            <h5 className="mb-2 text-myGray-dark text-sm font-semibold">
              See code
              <FontAwesomeIcon
                icon={faCode}
                className="ml-2 text-sm text-myGray-dark"
              />
            </h5>
            <h6 className="text-myGreen-dark font-semibold">Frontend</h6>
            <h6 className="text-myGreen-dark font-semibold">Backend</h6>
          </li>
          <li className="py-8 bg-white">
            <Button
              text="Logout"
              type="red-regular"
              size="sm"
              className="w-full"
              onClick={() => {
                localStorage.removeItem(TOKEN);
                isLoggedInVar(false);
                history.push('/');
              }}
            />
          </li>
        </ul>
      </div>
    </>
  );
};
