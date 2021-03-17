import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useWhoAmI } from '../hooks/useQuery/useWhoAmI';
import { CommonHeader } from './Headers/CommonHeader';
import { SigninModal } from './Modals/Signin';
import { SignupModal } from './Modals/Signup';
import { Options } from './Options';

interface ILayoutProps {
  className: string;
  title: string;
}

export const Layout: React.FC<ILayoutProps> = ({
  children,
  className,
  title,
}) => {
  const [isSignup, setIsSignup] = useState<boolean | null>(null);
  const [isOption, setIsOption] = useState(false);
  const { data: userData } = useWhoAmI();

  return (
    <>
      <Helmet>
        <title>{title} | Polartypes</title>
      </Helmet>
      <CommonHeader
        userData={userData}
        setIsSignup={setIsSignup}
        setIsOption={setIsOption}
      />
      {isSignup === false && <SigninModal setIsSignup={setIsSignup} />}
      {isSignup === true && <SignupModal setIsSignup={setIsSignup} />}
      <Options
        userData={userData}
        isOption={isOption}
        setIsOption={setIsOption}
      />
      <main className={`h-screenExceptHeader ${className}`}>{children}</main>
    </>
  );
};
