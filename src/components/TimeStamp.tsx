import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React from 'react';

interface ITimeStampProps {
  dateString: string | null | undefined;
  timeZone: string | null | undefined;
  text: string;
}

export const TimeStamp: React.FC<ITimeStampProps> = ({
  dateString,
  timeZone,
  text,
}) => {
  return (
    <li className="pl-3 flex">
      <div className="w-10 h-10 mr-3 flex items-center justify-center rounded-full border border-myGray text-myGray text-xl">
        <FontAwesomeIcon icon={faHome} />
      </div>
      <div className="text-sm flex flex-col justify-center">
        <span className="block text-myGray-darkest font-semibold">{text}</span>
        <span className="text-myGray-dark">
          {dateString &&
            timeZone &&
            moment(dateString).tz(timeZone).format('D MMMM YYYY')}
        </span>
      </div>
    </li>
  );
};
