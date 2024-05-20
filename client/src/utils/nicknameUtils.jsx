'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { UniqueOTP } from 'unique-string-generator';

export const generateDefaultNickname = () => {
  return `Guest${UniqueOTP(5)}`;
};
