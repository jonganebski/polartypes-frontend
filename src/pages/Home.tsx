import React, { useState } from 'react';
import { HomepageHeader } from '../components/Header-home';
import { SigninModal } from '../components/Modal-signin';
import { SignupModal } from '../components/Modal-signup';

export const Home = () => {
  const [isSignup, setIsSignup] = useState<boolean | null>(null);
  return (
    <div>
      <HomepageHeader setIsSignup={setIsSignup} />
      {isSignup === false && <SigninModal setIsSignup={setIsSignup} />}
      {isSignup === true && <SignupModal setIsSignup={setIsSignup} />}
      <div
        className="fixed w-full h-96 bg-cover bg-right"
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
      </div>
      <div className="w-full h-screen bg-cover"></div>
      <div className="relative z-10 bg-white w-full h-screen"></div>;
    </div>
  );
};
