'use client';

import { r3f } from '@/helpers/global';

type ThreeProps = {
  children: React.ReactNode;
};
export const Three = ({ children }: ThreeProps) => {
  return <r3f.In>{children}</r3f.In>;
};