import React from 'react';

interface IFormError {
  err?: string;
}

export const FormError: React.FC<IFormError> = ({ err }) => {
  return <span className="text-xs text-myRed">{err}</span>;
};
