import React, { useState } from 'react';
import { HomepageHeader } from '../components/Header-home';
import { SigninModal } from '../components/Modal-signin';
import { SignupModal } from '../components/Modal-signup';

export const Home = () => {
  const [isSignup, setIsSignup] = useState<boolean | null>(true);
  return (
    <div>
      <HomepageHeader setIsSignup={setIsSignup} />
      {isSignup === false && <SigninModal setIsSignup={setIsSignup} />}
      {isSignup === true && <SignupModal setIsSignup={setIsSignup} />}
      <div
        className="relative w-full h-screen bg-cover"
        // style={{ backgroundImage: `url("daniel-1.jpg")` }}
      >
        <div className="w-1/2 h-full bg-gradient-to-r from-myGreen-darkest to-transparent"></div>
      </div>
      ;<div className="bg-white w-full h-screen"></div>;
    </div>
  );
};
