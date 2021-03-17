import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CommonHeader } from './Headers/CommonHeader';

interface ILayoutProps {
  className: string;
  title: string;
}

export const Layout: React.FC<ILayoutProps> = ({
  children,
  className,
  title,
}) => {
  return (
    <>
      <Helmet>
        <title>{title} | Polartypes</title>
      </Helmet>
      <CommonHeader />
      <main className={`h-screenExceptHeader ${className}`}>{children}</main>
    </>
  );
};
