import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from './Layout';

export const NotFound = () => {
  return (
    <Layout className="pt-72" title="Not Found">
      <div className="grid place-items-center gap-5 mx-auto max-w-sm">
        <span className="text-2xl">🧭</span>
        <h2 className="text-2xl">Sorry.. This Page does not exist.</h2>
        <Link className="cursor-pointer hover:underline" to="/">
          Go Home &rarr;
        </Link>
      </div>
    </Layout>
  );
};
