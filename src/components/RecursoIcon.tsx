import React from 'react';
import {
  Projector,
  Volume2,
  Laptop,
  Tv,
  BookOpen,
  FlaskConical,
  Trees,
  Box,
} from 'lucide-react';
import { RecursoId } from '../types';

interface RecursoIconProps {
  id: RecursoId | string;
  className?: string;
  size?: number;
}

export const RecursoIcon: React.FC<RecursoIconProps> = ({ id, className = 'w-4 h-4', size }) => {
  switch (id) {
    case 'datashow':
      return <Projector className={className} size={size} />;
    case 'caixa_som':
      return <Volume2 className={className} size={size} />;
    case 'chromebook':
      return <Laptop className={className} size={size} />;
    case 'tv':
      return <Tv className={className} size={size} />;
    case 'biblioteca':
      return <BookOpen className={className} size={size} />;
    case 'laboratorio':
      return <FlaskConical className={className} size={size} />;
    case 'patio':
      return <Trees className={className} size={size} />;
    default:
      return <Box className={className} size={size} />;
  }
};
