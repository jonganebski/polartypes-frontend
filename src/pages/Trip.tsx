import {
  faCalendar,
  faEye,
  faHeart,
} from '@fortawesome/free-regular-svg-icons';
import {
  faAtlas,
  faBook,
  faCamera,
  faCog,
  faHome,
  faPassport,
  faPlusCircle,
  faShareAlt,
  faTachometerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { AddStepButton } from '../components/Button-add-step';
import { StepCard } from '../components/Card-step';
import { CommonHeader } from '../components/Header-common';

export const Trip = () => {
  return (
    <div className="">
      <CommonHeader />
      <div className="grid grid-cols-tripPage">
        <section>
          <div className="h-tripHeader px-2 flex items-center justify-between">
            <div className="flex items-center">
              <Avatar size={8} />
              <span className="ml-2 text-sm font-semibold text-myGreen-darkest">
                firstname lastname
              </span>
            </div>
            <div>
              <Button
                text="Create Travel Book"
                type="white-solid"
                size="sm"
                className="mr-2"
                icon={
                  <FontAwesomeIcon
                    icon={faBook}
                    className="mr-2 text-myBlue text-sm"
                  />
                }
              />
              <Button
                text="Share"
                type="white-solid"
                size="sm"
                className="mr-2"
                icon={
                  <FontAwesomeIcon
                    icon={faShareAlt}
                    className="mr-2 text-myBlue text-sm"
                  />
                }
              />
              <Button
                text="Trip settings"
                type="white-solid"
                size="sm"
                icon={
                  <FontAwesomeIcon
                    icon={faCog}
                    className="mr-2 text-myBlue text-sm"
                  />
                }
              />
            </div>
          </div>
          <article className="h-tripBody overflow-y-scroll">
            <div
              style={{
                backgroundImage:
                  'url("../andreas-gucklhorn-mawU2PoJWfU-unsplash.jpg")',
              }}
              className="relative h-96 bg-cover bg-center"
            >
              <div className="absolute w-full h-full flex flex-col items-center justify-between bg-black bg-opacity-50">
                <div className="h-full flex flex-col items-center justify-center">
                  <h3 className="mb-1 text-white text-sm font-semibold">
                    April 2020 - December 2020
                  </h3>
                  <h1 className="text-white text-3xl font-semibold">
                    Trip name
                  </h1>
                </div>
                <div className="w-full p-3 grid grid-cols-7 text-white text-center bg-myGreen-darkest bg-opacity-70">
                  <div>
                    <FontAwesomeIcon
                      icon={faTachometerAlt}
                      className="text-xl"
                    />
                    <span className="block mt-1.5 -mb-1.5 font-semibold">
                      3,799
                    </span>
                    <span className="text-xs">kilometers</span>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faEye} className="text-xl" />
                    <span className="block mt-1.5 -mb-1.5 font-semibold">
                      3,799
                    </span>
                    <span className="text-xs">views</span>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faHeart} className="text-xl" />
                    <span className="block mt-1.5 -mb-1.5 font-semibold">
                      10
                    </span>
                    <span className="text-xs">likes</span>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faCalendar} className="text-xl" />
                    <span className="block mt-1.5 -mb-1.5 font-semibold">
                      200
                    </span>
                    <span className="text-xs">days</span>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faCamera} className="text-xl" />
                    <span className="block mt-1.5 -mb-1.5 font-semibold">
                      56
                    </span>
                    <span className="text-xs">photos</span>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faPassport} className="text-xl" />
                    <span className="block mt-1.5 -mb-1.5 font-semibold">
                      12
                    </span>
                    <span className="text-xs">countries</span>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faAtlas} className="text-xl" />
                    <span className="block mt-1.5 -mb-1.5 font-semibold">
                      65
                    </span>
                    <span className="text-xs">steps</span>
                  </div>
                </div>
              </div>
            </div>
            <ul className="relative px-4 py-7 bg-myGray-lightest">
              <li className="pl-3 flex">
                <div className="w-10 h-10 mr-3 flex items-center justify-center rounded-full border border-myGray text-myGray text-xl">
                  <FontAwesomeIcon icon={faHome} />
                </div>
                <div className="text-sm">
                  <span className="block text-myGray-darkest font-semibold">
                    Trip started
                  </span>
                  <span className="text-myGray-dark">Started date</span>
                </div>
              </li>
              <AddStepButton />
              <StepCard />
              <AddStepButton />
              <li className="pl-3 flex">
                <div className="w-10 h-10 mr-3 flex items-center justify-center rounded-full border border-myGray text-myGray text-xl">
                  <FontAwesomeIcon icon={faHome} />
                </div>
                <div className="text-sm">
                  <span className="block text-myGray-darkest font-semibold">
                    Trip started
                  </span>
                  <span className="text-myGray-dark">Started date</span>
                </div>
              </li>
            </ul>
          </article>
        </section>
        <section className="bg-green-700"></section>
      </div>
    </div>
  );
};
