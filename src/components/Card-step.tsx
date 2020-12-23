import { faHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Comments } from './Comments';

export const StepCard = () => {
  const [isCommentBox, setIsCommentBox] = useState(false);
  return (
    <li className="pt-6 px-6 border bg-white border-myGray-light rounded-xl">
      <div>
        <h2 className="mb-1 text-myGreen-darkest text-2xl font-semibold">
          Step title
        </h2>
        <div className="mb-3 flex items-center text-myGray-dark text-sm">
          <span>Country</span>
          <div className="inline-block mx-2 text-myGray">•</div>
          <span>7 July 2018</span>
        </div>
      </div>
      <p className="mb-3 text-myGray-darkest">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc id ligula
        eget lorem ultricies volutpat. Duis nec pretium massa. In vestibulum
        convallis nulla. Nullam ut varius augue. Curabitur iaculis risus sit
        amet pharetra tempor. Duis ex nisi, dictum at porttitor at, mattis eu
        augue. Duis sed quam quis nibh sodales elementum id et libero. Nunc
        malesuada libero vitae elit gravida feugiat. In placerat ligula elit, et
        euismod sem aliquam volutpat. Sed tristique molestie quam, nec
        ullamcorper velit blandit eget. Nam sit amet arcu pellentesque est
        venenatis fermentum vitae sit amet massa. Pellentesque venenatis mauris
        justo, vitae bibendum lorem consequat lacinia. Donec ligula velit,
        convallis bibendum erat ultrices, fermentum laoreet metus. Aliquam ante
        ipsum, rhoncus pellentesque ullamcorper interdum, bibendum at erat. Sed
        aliquet eros nec ante porta, in suscipit ex varius. Suspendisse quis mi
        vitae ex hendrerit lacinia id vel elit.
      </p>
      <div
        style={{
          backgroundImage:
            'url("../andreas-gucklhorn-mawU2PoJWfU-unsplash.jpg")',
        }}
        className="relative mb-4 pt-imageRatio bg-cover bg-center"
      ></div>
      <div className="p-3 flex border-t border-b border-myGray-light">
        <Avatar size={8} />
        <span className="text-sm text-myGray-darkest">
          <Link to="#" className="text-myGreen-darkest">
            Allmight
          </Link>
          ,{' '}
          <Link to="#" className="text-myGreen-darkest">
            Ganai Yuhno
          </Link>
          ,{' '}
          <Link to="#" className="text-myGreen-darkest">
            Kamado Tanjiro
          </Link>
          ,{' '}
          <Link to="#" className="text-myGreen-darkest">
            Michael Jackson
          </Link>{' '}
          and 45 others like this step.
        </span>
      </div>
      <div className="py-4">
        <Button
          text="Like"
          type="white-solid"
          size="sm"
          className="mr-2"
          icon={<FontAwesomeIcon icon={faHeart} className="text-myBlue mr-2" />}
        />
        <Button
          text={`${6} Comments`}
          onClick={() => setIsCommentBox((prev) => !prev)}
          type="white-solid"
          size="sm"
          icon={
            <FontAwesomeIcon icon={faComment} className="text-myBlue mr-2" />
          }
        />
      </div>
      {isCommentBox && <Comments />}
    </li>
  );
};
