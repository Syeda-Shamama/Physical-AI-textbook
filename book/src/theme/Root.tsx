import React from 'react';
import Chatbot from '@site/src/components/Chatbot';

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      {children}
      <Chatbot />
    </>
  );
}
