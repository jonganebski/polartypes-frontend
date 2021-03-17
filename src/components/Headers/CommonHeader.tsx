import { gql, useLazyQuery } from '@apollo/client';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { USER_CORE_FRAGMENT } from '../../fragments';
import { useWhoAmI } from '../../hooks/useQuery/useWhoAmI';
import {
  searchQuery,
  searchQueryVariables,
} from '../../__generated__/searchQuery';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Logo } from '../Logo';
import { SigninModal } from '../Modals/Signin';
import { SignupModal } from '../Modals/Signup';
import { Options } from '../Options';
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
  username?: string;
}

export const CommonHeader = () => {
  const { username: usernameParam } = useParams<IPrams>();
  const { me } = useWhoAmI();
  const timeoutIdRef = useRef<any>(0);
  const isMe = usernameParam?.toLowerCase() === me?.slug;
  const [isSearchTooltip, setIsSearchTooltip] = useState(false);
  const [isDelay, setIsDelay] = useState(false);
  const [isSignup, setIsSignup] = useState<boolean | null>(null);
  const [isOption, setIsOption] = useState(false);

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
    <>
      {isSignup === false && <SigninModal setIsSignup={setIsSignup} />}
      {isSignup === true && <SignupModal setIsSignup={setIsSignup} />}
      <Options setIsOption={setIsOption} isOption={isOption} me={me} />
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
          {me && (
            <Link
              to={`/${me.username}`}
              className={`h-full px-5 flex items-center justify-center bg-myGreen-darkest hover:bg-opacity-60 ${
                isMe ? 'border-b-4 border-myRed text-center' : ''
              }`}
            >
              <Avatar avatarUrl={me.avatarUrl} size={8} />
              <span className="ml-3">{me.firstName}</span>
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
          {!me && (
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
    </>
  );
};
