import React from 'react';

interface IFormError {
  err: string | null | undefined;
}

export const FormError: React.FC<IFormError> = ({ err }) =>
  err ? <span className="text-xs text-myRed">{err}</span> : null;
