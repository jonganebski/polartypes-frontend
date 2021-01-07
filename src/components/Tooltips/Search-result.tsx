import React from 'react';
import { searchQuery } from '../../__generated__/searchQuery';
import { TripBox } from '../Box/Trip';
import { UserBox } from '../Box/User';
import { Spinner } from '../Loading-spinner';

interface ISearchResultProps {
  isSearchLoading: boolean;
  isDelay: boolean;
  searchResult?: searchQuery;
}

export const SearchResult: React.FC<ISearchResultProps> = ({
  isSearchLoading,
  isDelay,
  searchResult,
}) => {
  const isUserSearchResult = Boolean(
    searchResult?.search.users &&
      !!searchResult?.search.usersCount &&
      searchResult?.search.usersCount > 0,
  );

  const isTripSeachResult = Boolean(
    searchResult?.search.trips &&
      !!searchResult?.search.tripsCount &&
      searchResult?.search.tripsCount > 0,
  );

  return (
    <div className="absolute z-10 top-11 left-1/2 transform -translate-x-1/2 w-screen max-w-sm py-5 bg-myGray-lightest rounded-lg">
      <div
        className="absolute z-10 left-1/2 transform -translate-x-1/2"
        style={{
          top: '-24px',
          width: '12px',
          height: '12px',
          border: '12px solid',
          borderColor: 'transparent',
          borderBottomColor: 'white',
        }}
      ></div>
      {isSearchLoading || isDelay ? (
        <div className="py-7">
          <Spinner color="text-myGreen-dark" />
        </div>
      ) : (
        <>
          <div>
            <h5 className="p-5 bg-myGray-lightest text-lg text-myGreen-dark font-semibold border-b border-myGray-light">
              People
            </h5>
            {isUserSearchResult ? (
              <div>
                <ul>
                  {searchResult!.search.users!.map((user, i) => (
                    <UserBox key={i} user={user} />
                  ))}
                </ul>
                {0 <
                  searchResult!.search.usersCount! -
                    searchResult!.search.users!.length && (
                  <div className="py-4 text-xs text-center bg-white border-t border-myGray-light">
                    Show{' '}
                    {searchResult!.search.usersCount! -
                      searchResult!.search.users!.length}{' '}
                    more travlers...
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 text-myGray-dark text-center bg-white">
                Nothing found
              </div>
            )}
          </div>
          <div>
            <h5 className="p-5 bg-myGray-lightest text-lg text-myGreen-dark font-semibold border-t border-b border-myGray-light">
              Trips
            </h5>
            {isTripSeachResult ? (
              <div>
                <ul>
                  {searchResult?.search.trips?.map((trip, i) => (
                    <TripBox key={i} trip={trip} />
                  ))}
                </ul>
                {0 <
                  searchResult!.search.tripsCount! -
                    searchResult!.search.trips!.length && (
                  <div className="py-4 text-xs text-center bg-white border-t border-myGray-light">
                    Show{' '}
                    {searchResult!.search.tripsCount! -
                      searchResult!.search.trips!.length}{' '}
                    more travlers...
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 text-myGray-dark text-center bg-white">
                Nothing found
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
