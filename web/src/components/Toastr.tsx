import { useToast } from '@chakra-ui/toast';
import React from 'react';

interface ToastrProps {
  show: boolean;
}

const Toastr: React.FC<ToastrProps> = ({ show = false }) => {
  const toast = useToast();

  return <div></div>;
};

export default Toastr;
