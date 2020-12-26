import { faHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { readTripQuery_readTrip_trip_steps } from '../../__generated__/readTripQuery';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Comments } from './partials/Comments';

interface IStepProps {
  step: readTripQuery_readTrip_trip_steps;
}

export const StepCard: React.FC<IStepProps> = ({ step }) => {
  const [isCommentBox, setIsCommentBox] = useState(false);
  const commentsCount = step.comments.length;
  return (
    <li className="pt-6 px-6 border bg-white border-myGray-light rounded-xl">
      <div>
        <h2 className="mb-1 text-myGreen-darkest text-2xl font-semibold">
          {step.name}
        </h2>
        <div className="mb-3 flex items-center text-myGray-dark text-sm">
          <span>{step.country}</span>
          <div className="inline-block mx-2 text-myGray">•</div>
          <span>
            {moment(step.arrivedAt).tz(step.timeZone).format('d MMMM YYYY')}
          </span>
        </div>
      </div>
      <p className="mb-3 text-myGray-darkest">{step.story}</p>
      <div className="mb-4 grid gap-y-3">
        {step.images.map((image, i) => (
          <div
            key={i}
            style={{
              backgroundImage: `url(${image.url})`,
            }}
            className="pt-imageRatio bg-cover bg-center"
          ></div>
        ))}
      </div>
      {step.likes.length > 0 && (
        <div className="p-3 flex border-t border-b border-myGray-light">
          <Avatar size={8} />
          <span className="text-sm text-myGray-darkest">
            <Link to="#" className="text-myGreen-darkest">
              Allmight
            </Link>
            ,{' '}
            <Link to="#" className="text-myGreen-darkest">
              Ganai Yuhno
            </Link>
            ,{' '}
            <Link to="#" className="text-myGreen-darkest">
              Kamado Tanjiro
            </Link>
            ,{' '}
            <Link to="#" className="text-myGreen-darkest">
              Michael Jackson
            </Link>{' '}
            and 45 others like this step.
          </span>
        </div>
      )}
      <div className="py-4">
        <Button
          text="Like"
          type="white-solid"
          size="sm"
          className="mr-2"
          icon={<FontAwesomeIcon icon={faHeart} className="text-myBlue mr-2" />}
        />
        <Button
          text={
            commentsCount === 0
              ? 'Comment'
              : commentsCount === 1
              ? '1 Comment'
              : `${commentsCount} Comments`
          }
          onClick={() => setIsCommentBox((prev) => !prev)}
          type="white-solid"
          size="sm"
          icon={
            <FontAwesomeIcon icon={faComment} className="text-myBlue mr-2" />
          }
        />
      </div>
      {isCommentBox && <Comments />}
    </li>
  );
};
