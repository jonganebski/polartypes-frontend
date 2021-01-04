import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Logo } from '../Logo';
import { Avatar } from '../Avatar';
import { Link, useParams } from 'react-router-dom';
import { whoAmIQuery } from '../../__generated__/whoAmIQuery';

interface IPrams {
  username: string;
}

interface ICommonHeaderProps {
  userData: whoAmIQuery | undefined;
  setIsOption: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CommonHeader: React.FC<ICommonHeaderProps> = ({
  userData,
  setIsOption,
}) => {
  const { username: usernameParam } = useParams<IPrams>();
  const isSelf = usernameParam.toLowerCase() === userData?.whoAmI.slug;
  return (
    <header className="h-commonHeader flex justify-between bg-myGreen-darkest">
      <div className="px-3 flex items-center">
        <Logo usage="common" />
        <form className="relative ml-4 w-80">
          <input
            type="text"
            placeholder="Explore people, trips or locations..."
            className="w-full pl-9 py-1.5 text-white text-sm bg-transparent border border-myGray-darkest rounded-full hover:border-myGray-dark focus:border-myGray-dark focus:outline-none"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute top-2 left-3 text-white"
          />
        </form>
      </div>
      <div className="grid grid-cols-3 gap-x-px border-l border-myGray-darkest bg-myGray-darkest text-white text-sm font-semibold">
        {userData && (
          <Link
            to={`/${userData.whoAmI.username}`}
            className={`h-full px-3 flex items-center justify-center bg-myGreen-darkest hover:bg-opacity-60 ${
              isSelf ? 'border-b-4 border-myRed text-center' : ''
            }`}
          >
            <Avatar avatarUrl={userData.whoAmI.avatarUrl} size={8} />
            <span className="ml-3">{userData.whoAmI.firstName}</span>
          </Link>
        )}
        <div className="h-full px-3 flex items-center justify-center bg-myGreen-darkest hover:bg-opacity-60 cursor-pointer">
          Travel Books
        </div>
        <div
          className="h-full px-3 flex items-center justify-center bg-myGreen-darkest hover:bg-opacity-60 cursor-pointer"
          onClick={() => setIsOption(true)}
        >
          <span className="mr-3">Options</span>
          <FontAwesomeIcon icon={faBars} />
        </div>
      </div>
    </header>
  );
};
