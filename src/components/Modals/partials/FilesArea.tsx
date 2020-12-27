import { faCamera, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef } from 'react';
import { ACCEPTED_IMAGE_TYPES } from '../../../constants';
import { deleteFiles } from '../../../helpers';
import { useDragNDropFile } from '../../../hooks/useDragNDrop-file';
import { useDragNDropImage } from '../../../hooks/useDragNDrop-image';
import { readTripQuery_readTrip_trip_steps } from '../../../__generated__/readTripQuery';
import { FormError } from '../../Form-error';
import { Spinner } from '../../Loading-spinner';
import { TImage } from '../Create-step';

interface IUploadBoxProps {
  images: TImage[];
  setImages: React.Dispatch<React.SetStateAction<TImage[]>>;
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  uploadErr: string;
  setUploadErr: React.Dispatch<React.SetStateAction<string>>;
  editingStep: readTripQuery_readTrip_trip_steps | null;
}

export type TMyFile = File & { id: string };

export const FilesArea: React.FC<IUploadBoxProps> = ({
  images,
  setImages,
  isUploading,
  setIsUploading,
  uploadErr,
  setUploadErr,
  editingStep,
}) => {
  console.log(images);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const { draggingId, dropAcceptorFns, imageBoxDragFns } = useDragNDropImage(
    images,
    setImages,
  );
  const { dragNDropFilesFns, helperFns } = useDragNDropFile(
    images,
    setImages,
    draggingId,
    setIsUploading,
    setUploadErr,
  );
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.currentTarget.files;
    if (!files) {
      return;
    }
    const { validFiles, err } = helperFns.validateFiles(files);
    if (err) {
      setUploadErr(err);
      return;
    }
    helperFns.readFiles(validFiles);
    helperFns.uploadFiles(validFiles);
    e.currentTarget.value = '';
  };

  const onDeleteIconClick = (i: number) => {
    if (isUploading) {
      return;
    }
    if (editingStep) {
    } else {
      const targetUrl = images[i]?.url;
      targetUrl && deleteFiles([targetUrl]);
    }
    setImages((prev) => prev.filter((_, index) => index !== i));
  };
  return (
    <div>
      <div
        className="relative py-2 gap-y-3 grid grid-cols-uploadBox border border-myGray rounded-sm bg-white"
        {...dragNDropFilesFns}
      >
        {images.length === 0 && (
          <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-myGray text-sm pointer-events-none">
            Drag & Drop
          </span>
        )}
        {images.map((image, i) => {
          return (
            <React.Fragment key={i}>
              {i % 4 === 0 && (
                <div
                  id={'initialDropPoint-' + i}
                  style={{ padding: '3px' }}
                  {...dropAcceptorFns}
                >
                  <div className="w-full h-full bg-white rounded-full pointer-events-none"></div>
                </div>
              )}
              <div
                className="relative pt-square border border-dashed border-myBlue rounded-md"
                key={i}
                id={'uploadedImg-' + i}
                style={{ cursor: 'grab' }}
                {...imageBoxDragFns}
              >
                <div
                  style={{ backgroundImage: `url(${image.src ?? image.url})` }}
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-p90 pt-p90 bg-myGray-dark bg-cover bg-center rounded-sm `}
                >
                  <div
                    className={`absolute top-0 left-0 w-full h-full rounded-sm bg-black ${
                      image.url ? 'bg-opacity-0' : 'bg-opacity-80'
                    }`}
                  >
                    {!image.url && <Spinner />}
                  </div>
                </div>
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  onClick={() => onDeleteIconClick(i)}
                  className={`absolute -top-1 -right-1 text-xl cursor-pointer rounded-full text-black bg-white ${
                    image.url && 'hover:text-myRed'
                  }`}
                />
              </div>
              <div
                id={'dropPoint-' + (i + 1)}
                style={{ padding: '3px' }}
                {...dropAcceptorFns}
              >
                <div className="w-full h-full bg-white rounded-full pointer-events-none"></div>
              </div>
            </React.Fragment>
          );
        })}
        {images.length % 4 === 0 && <div></div>}
        <div
          onClick={() => imageInputRef.current?.click()}
          className="relative pt-square border border-myBlue rounded-md cursor-pointer group bg-white hover:bg-myBlue"
        >
          <FontAwesomeIcon
            icon={faCamera}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-myBlue text-lg group-hover:text-white"
          />
        </div>
        <input
          ref={imageInputRef}
          onChange={handleFileInput}
          type="file"
          className="hidden"
          disabled={isUploading}
          accept={ACCEPTED_IMAGE_TYPES.join()}
          multiple={true}
        />
      </div>
      {uploadErr && <FormError err={uploadErr} />}
    </div>
  );
};
