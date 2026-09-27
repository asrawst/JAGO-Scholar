import React from 'react';
import { DigiLockerFullFlowModal } from './DigiLockerFullFlowModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DigiLockerConsentModal: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <DigiLockerFullFlowModal
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};
