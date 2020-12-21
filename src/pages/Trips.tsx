import React from 'react';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { CommonHeader } from '../components/Header-common';

export const Trips = () => {
  return (
    <div>
      <CommonHeader />
      <div className="grid grid-cols-tripsPage">
        <section className="grid bg-red-200 overflow-y-scroll">
          <div
            style={{
              backgroundImage:
                'url("andreas-gucklhorn-mawU2PoJWfU-unsplash.jpg")',
            }}
            className="py-5 flex flex-col items-center bg-cover bg-center"
          >
            <Avatar size={16} />
            <h2>Firstname Lastname</h2>
            <h6>Location</h6>
            <div>
              <Button text="x follower" type="void" />
              <Button text="y following" type="void" />
            </div>
          </div>
          <div>
            <button className="w-1/2 py-4 text-white font-semibold bg-green-200 focus:outline-none">
              Trips
            </button>
            <button className="w-1/2 py-4 text-white font-semibold bg-green-200 focus:outline-none">
              Statistics
            </button>
          </div>
          <div className="grid">
            <Button
              text="Add a past, current or future trip"
              type="blue-regular"
            />
            <div>Trip1</div>
            <div>Trip2</div>
          </div>
        </section>
        <section>map</section>
      </div>
    </div>
  );
};
