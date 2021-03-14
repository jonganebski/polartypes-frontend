import { gql, useLazyQuery } from '@apollo/client';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { USER_CORE_FRAGMENT } from '../../fragments';
import {
  searchQuery,
  searchQueryVariables,
} from '../../__generated__/searchQuery';
import { whoAmIQuery } from '../../__generated__/whoAmIQuery';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Logo } from '../Logo';
import { SearchResult } from '../Tooltips/Search-result';

const SEARCH_QUERY = gql`
  query searchQuery($input: SearchInput!) {
    search(input: $input) {
      ok
      error
      usersCount
      users {
        ...UserCoreParts
      }
      tripsCount
      trips {
        id
        name
        coverUrl
        traveler {
          firstName
          lastName
          username
        }
      }
    }
  }
  ${USER_CORE_FRAGMENT}
`;

interface IPrams {
  username: string;
}

interface ICommonHeaderProps {
  userData: whoAmIQuery | undefined;
  setIsOption: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSignup: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export const CommonHeader: React.FC<ICommonHeaderProps> = ({
  userData,
  setIsOption,
  setIsSignup,
}) => {
  const { username: usernameParam } = useParams<IPrams>();
  const timeoutIdRef = useRef<any>(0);
  const isSelf = usernameParam.toLowerCase() === userData?.whoAmI.slug;
  const [isSearchTooltip, setIsSearchTooltip] = useState(false);
  const [isDelay, setIsDelay] = useState(false);

  const [
    searchQuery,
    { data: searchResult, loading: isSearchLoading },
  ] = useLazyQuery<searchQuery, searchQueryVariables>(SEARCH_QUERY);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeoutIdRef.current);
    const searchTerm = e.currentTarget.value;
    if (searchTerm.length === 0) {
      setIsSearchTooltip(false);
    }
    if (2 < searchTerm.length) {
      setIsSearchTooltip(true);
      setIsDelay(true);
      timeoutIdRef.current = setTimeout(() => {
        setIsDelay(false);
        searchQuery({ variables: { input: { searchTerm } } });
      }, 1000);
    }
  };
  return (
    <header className="h-commonHeader flex justify-between bg-myGreen-darkest">
      <div className="px-3 flex items-center">
        <Logo usage="common" />
        <form className="relative ml-4 w-80">
          <input
            onChange={onChange}
            name="searchTerm"
            type="text"
            placeholder="Explore people, trips or locations..."
            autoComplete="off"
            className="w-full pl-9 py-1.5 text-white text-sm bg-transparent border border-myGray-darkest rounded-full hover:border-myGray-dark focus:border-myGray-dark focus:outline-none"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute top-2 left-3 text-white"
          />
          {isSearchTooltip && (
            <SearchResult
              isDelay={isDelay}
              isSearchLoading={isSearchLoading}
              searchResult={searchResult}
            />
          )}
        </form>
      </div>
      <div
        className="grid gap-x-px border-l border-myGray-darkest bg-myGray-darkest text-white text-sm font-semibold"
        style={{
          gridTemplateColumns: 'repeat(3, auto)',
        }}
      >
        {userData && (
          <Link
            to={`/${userData.whoAmI.username}`}
            className={`h-full px-5 flex items-center justify-center bg-myGreen-darkest hover:bg-opacity-60 ${
              isSelf ? 'border-b-4 border-myRed text-center' : ''
            }`}
          >
            <Avatar avatarUrl={userData.whoAmI.avatarUrl} size={8} />
            <span className="ml-3">{userData.whoAmI.firstName}</span>
          </Link>
        )}
        <div className="h-full px-5 flex items-center justify-center bg-myGreen-darkest hover:bg-opacity-60 cursor-pointer">
          Travel Books
        </div>
        <div
          className="h-full px-5 flex items-center justify-center bg-myGreen-darkest hover:bg-opacity-60 cursor-pointer"
          onClick={() => setIsOption(true)}
        >
          <span className="mr-3">Options</span>
          <FontAwesomeIcon icon={faBars} />
        </div>
        {!userData && (
          <div className="h-full px-5 flex items-center justify-center bg-myGreen-darkest">
            <Button
              text="Sign in"
              size="sm"
              type="white-regular"
              onClick={() => setIsSignup(false)}
            />
            <span className="mx-3">or</span>
            <Button
              text="Create an account"
              size="sm"
              type="blue-solid"
              onClick={() => {
                setIsSignup(true);
              }}
            />
          </div>
        )}
      </div>
    </header>
  );
};
