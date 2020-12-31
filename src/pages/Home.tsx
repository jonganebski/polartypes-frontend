import React, { useEffect, useRef, useState } from 'react';
import { HomepageHeader } from '../components/Headers/HomeHeader';
import { SigninModal } from '../components/Modals/Signin';
import { SignupModal } from '../components/Modals/Signup';

export const Home = () => {
  const [isSignup, setIsSignup] = useState<boolean | null>(null);
  const [isAlterHeader, setIsAlterHeader] = useState(false);
  const x = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const alterHeader = () => {
      if (
        x.current?.offsetHeight &&
        x.current.offsetHeight - window.pageYOffset < 450
      ) {
        setIsAlterHeader(true);
      } else {
        setIsAlterHeader(false);
      }
    };
    window.addEventListener('scroll', alterHeader);
    return () => window.removeEventListener('scroll', alterHeader);
  }, []);
  return (
    <div>
      <HomepageHeader setIsSignup={setIsSignup} isAlterHeader={isAlterHeader} />
      {isSignup === false && <SigninModal setIsSignup={setIsSignup} />}
      {isSignup === true && <SignupModal setIsSignup={setIsSignup} />}
      <div
        className="fixed top-0 w-full h-homepageCover bg-cover bg-right"
        style={{
          backgroundImage: `url("andreas-gucklhorn-mawU2PoJWfU-unsplash.jpg")`,
        }}
      >
        <div
          className="w-1/2 h-full"
          style={{
            background:
              'linear-gradient(0.25turn, #001f29 60%, rgba(0, 31, 41, 0.9), rgba(0, 31, 41, 0.7), transparent)',
          }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-2 gap-8 w-full max-w-4xl">
          <div>
            <h2 className="text-6xl text-white font-black mb-2 leading-tight">
              Adventure starts&nbsp;with&nbsp;a
            </h2>
            <h2 className="text-6xl text-white font-black mb-10">
              single step
            </h2>
            <h5 className="text-3xl text-white font-light">
              Plan, track and relive your trips in a smart and beautiful way
            </h5>
          </div>
          <div></div>
        </div>
      </div>
      <div
        ref={x}
        className="relative z-10 mt-homepageCover w-full h-screen bg-white"
      >
        <div
          style={{ backgroundImage: 'url("splatter-white.png")' }}
          className="absolute -top-12 w-full h-12 bg-cover"
        />
        <div className="bg-white w-full max-w-4xl mx-auto h-full pt-32">
          Welcome to Polartypes!
        </div>
      </div>
    </div>
  );
};
