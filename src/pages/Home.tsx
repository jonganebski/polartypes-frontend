import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
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
    <>
      <Helmet>
        <title>Home | Polartypes</title>
      </Helmet>
      <HomepageHeader setIsSignup={setIsSignup} isAlterHeader={isAlterHeader} />
      {isSignup === false && <SigninModal setIsSignup={setIsSignup} />}
      {isSignup === true && <SignupModal setIsSignup={setIsSignup} />}
      <main>
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
                single&nbsp;step
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
          <div className="bg-white w-full max-w-4xl mx-auto h-full pt-32 text-center">
            <h4 className="mb-6">Welcome to Polartypes!</h4>
            <p className="mb-6">
              This site is a result of learning purpose clone coding. The
              original site is{' '}
              <a
                href="https://www.polarsteps.com"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Polarsteps
              </a>
              . Your password is going to be encrypted properly with argon2 and
              your information is not going to be shared with any other
              services. Unfortunately, there are no means to help you in case
              you forget your password right now. Also as this site was built
              for learning purpose, your data can be removed at anytime without
              any notice. Please keep this in mind.
            </p>
            <p className="mb-6">
              I named this project Polartypes becase it is writen in Typescript.
              Sharing programming language between front and back with strong
              type support, I had very good developing experience and learned a
              lot. If you want to check the code, please visit github links
              below. Also I made an example post for you.
            </p>
            <div className="mb-10 grid">
              <a
                className="underline hover:text-gray-700 active:text-black"
                href="https://github.com/jonganebski/polartypes-frontend"
                target="_blank"
                rel="noreferrer"
              >
                Frontend code
              </a>
              <a
                className="underline mb-5 hover:text-gray-700 active:text-black"
                href="https://github.com/jonganebski/polartypes-backend"
                target="_blank"
                rel="noreferrer"
              >
                Backend code
              </a>
              <div>
                <span>&rarr;</span>
                <Link
                  className="underline mx-3 hover:text-gray-700 active:text-black"
                  to="/JinseokBang"
                >
                  Example trip
                </Link>
                <span>&larr;</span>
              </div>
            </div>
            <span className="text-sm">
              Copyright &copy; polartypes {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </main>
    </>
  );
};
