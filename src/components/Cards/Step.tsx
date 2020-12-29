import { gql, useMutation } from '@apollo/client';
import { faHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../../apollo';
import { useWhoAmI } from '../../hooks/useWhoAmI';
import { readTripQuery_readTrip_trip_steps } from '../../__generated__/readTripQuery';
import { toggledLikeStep } from '../../__generated__/toggledLikeStep';
import {
  toggleLikeMutation,
  toggleLikeMutationVariables,
} from '../../__generated__/toggleLikeMutation';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Comments } from './partials/Comments';

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLikeMutation($input: ToggleLikeInput!) {
    toggleLike(input: $input) {
      ok
      error
      toggle
    }
  }
`;

interface IStepProps {
  step: readTripQuery_readTrip_trip_steps;
  setEditingStep: React.Dispatch<
    React.SetStateAction<readTripQuery_readTrip_trip_steps | null>
  >;
  setIsSaveStepModal: React.Dispatch<React.SetStateAction<boolean>>;
  setReadingStepId: React.Dispatch<React.SetStateAction<number | null>>;
}

export const StepCard: React.FC<IStepProps> = ({
  step,
  setEditingStep,
  setIsSaveStepModal,
  setReadingStepId,
}) => {
  const { data: userData } = useWhoAmI();
  const isSelf = userData?.whoAmI.id === step.traveler.id;
  const liRef = useRef<HTMLLIElement | null>(null);
  useEffect(() => {
    const buildThresholdList = () => {
      let thresholds = [];
      let numSteps = 20;
      for (let i = 1.0; i <= numSteps; i++) {
        let ratio = i / numSteps;
        thresholds.push(ratio);
      }
      thresholds.push(0);
      return thresholds;
    };
    if (liRef.current) {
      let prevRatio = 0.5;
      const handleIntersect = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (
            entry.intersectionRatio > prevRatio &&
            entry.intersectionRatio > 0.5
          ) {
            setReadingStepId(+entry.target.id);
          }
          prevRatio = entry.intersectionRatio;
        });
      };
      const intersectionObserver = new IntersectionObserver(handleIntersect, {
        threshold: buildThresholdList(),
      });
      intersectionObserver.observe(liRef.current);
    }
  }, []);
  const [isCommentBox, setIsCommentBox] = useState(false);
  const commentsCount = step.comments.length;
  const onCompleted = (data: toggleLikeMutation) => {
    const {
      toggleLike: { ok, error, toggle },
    } = data;
    if (ok && !error && toggle) {
      const prevStep = client.readFragment<toggledLikeStep>({
        id: `Step:${step.id}`,
        fragment: gql`
          fragment toggledLikeStep on Step {
            likes {
              user {
                username
              }
            }
          }
        `,
      });
      if (prevStep && userData) {
        const username = userData.whoAmI.username;
        let likes = prevStep?.likes.slice();
        console.log(likes);
        if (0 < toggle) {
          likes.unshift({
            __typename: 'Like',
            user: { __typename: 'Users', username },
          });
        } else {
          likes = likes.filter((like) => like.user.username !== username);
        }
        client.writeFragment<toggledLikeStep>({
          id: `Step:${step.id}`,
          fragment: gql`
            fragment toggledLikeStep on Step {
              likes {
                user {
                  username
                }
              }
            }
          `,
          data: {
            __typename: 'Step',
            likes,
          },
        });
      }
    }
  };

  const [toggleLikeMutation, { loading: toggleLikeLoading }] = useMutation<
    toggleLikeMutation,
    toggleLikeMutationVariables
  >(TOGGLE_LIKE_MUTATION, { onCompleted });
  return (
    <li
      id={step.id + ''}
      ref={liRef}
      className="pt-6 px-6 border bg-white border-myGray-light rounded-xl"
    >
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
      <p className="mb-3 text-myGray-darkest whitespace-pre-wrap">
        {step.story}
      </p>
      <div className="mb-4 grid gap-y-3">
        {step.imgUrls?.map((url, i) => (
          <div
            key={i}
            style={{
              backgroundImage: `url(${url})`,
            }}
            className="pt-imageRatio bg-cover bg-center"
          ></div>
        ))}
      </div>
      {step.likes.length !== 0 && (
        <div className="p-3 flex items-center border-t border-b border-myGray-light">
          <Avatar avatarUrl={step.likes[0].user.avatarUrl} size={8} />
          <span className="ml-3 text-sm text-myGray-darkest">
            {step.likes.slice(0, 5).map((like, i) => (
              <Link key={i} to="#" className="text-myGreen-darkest">
                {i === step.likes.slice(0, 5).length - 1
                  ? like.user.username + ' '
                  : like.user.username + ', '}
              </Link>
            ))}
            {step.likes.length - 5 < 0
              ? 'like this trip'
              : `and ${step.likes.length - 5} others like this step.`}
          </span>
        </div>
      )}
      <div className="py-4 flex justify-between">
        <div>
          <Button
            text="Like"
            type="white-solid"
            size="sm"
            className="mr-2"
            disabled={toggleLikeLoading}
            icon={
              <FontAwesomeIcon
                icon={faHeart}
                className={`mr-2 ${
                  step.likes.some(
                    (like) => like.user.username === userData?.whoAmI.username,
                  )
                    ? 'text-myRed'
                    : 'text-myBlue'
                }`}
              />
            }
            onClick={(e) => {
              toggleLikeMutation({ variables: { input: { id: step.id } } });
            }}
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
        {isSelf && (
          <Button
            text="Edit step"
            type="blue-solid"
            size="sm"
            onClick={() => {
              setIsSaveStepModal(true);
              setEditingStep(step);
            }}
          />
        )}
      </div>
      {isCommentBox && <Comments step={step} />}
    </li>
  );
};
