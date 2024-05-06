'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { NavLink } from 'react-router-dom';
import NotFoundImage from '../assets/404.png';
import CustomButton from '../components/CustomButton';

const NotFoundPage = () => {
  return (
    <div className="bg-custom-meeting dark:bg-dark-meeting h-full flex-grow flex flex-col md:flex-row overflow-hidden">
      <div className="space-y-8 flex flex-col md:grid  md:grid-cols-3 justify-center items-center pt-8 md:pt-0 gap-8 sm:px-8 md:mt-32 mt-0 mb-auto">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="mt-4 lg:px-10 text-xl lg:text-2xl dark:text-white text-gray-600">
            The page you are on does not exist. Check the URL or that your
            meeting has not ended.
          </p>
          <div className="py-4 md:py-8">
            <CustomButton
              tagOrComponent={NavLink}
              to="/"
              className="text-sm lg:text-base">
              Go to Home Page
            </CustomButton>
          </div>
        </div>
        <img src={NotFoundImage} className="col-span-2" />
      </div>
    </div>
  );
};

export default NotFoundPage;
