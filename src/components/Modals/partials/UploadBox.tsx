import { faCamera, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { ACCEPTED_IMAGE_TYPES } from '../../../constants';
import { deleteFiles } from '../../../helpers';
import { FormError } from '../../Form-error';
import { Spinner } from '../../Loading-spinner';
import { ICreateStepFormProps, IImagesState } from '../Create-step';

interface IUploadBoxProps {
  images: IImagesState[];
  setImages: React.Dispatch<React.SetStateAction<IImagesState[]>>;
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

type TMyFile = File & { id: string };

export const UploadBox: React.FC<IUploadBoxProps> = ({
  images,
  setImages,
  isUploading,
  setIsUploading,
}) => {
  const [draggingId, setDraggingId] = useState<string | null>();
  const { register, setError, errors } = useFormContext<ICreateStepFormProps>();
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const validateFiles = (
    files: FileList,
  ): { validFiles: TMyFile[]; err: string } => {
    let validFiles: TMyFile[] = [];
    let err = '';
    const validTypes = ACCEPTED_IMAGE_TYPES;
    const maxSize = 1 * 1024 * 1024; // 1mb
    for (let i = 0; i < files.length; i++) {
      if (!validTypes.includes(files[i].type)) {
        err = `Only ${validTypes
          .map((type) => type.split('/')[1])
          .join(', ')} files are accepted.`;
        continue;
      }
      if (maxSize < files[i].size) {
        err = 'Image size should be equal or less than 1 MB.';
        continue;
      }
      const file = files[i] as TMyFile;
      file.id = uuidv4();
      validFiles.push(file);
    }
    return { validFiles, err };
  };

  const uploadFiles = (files: TMyFile[]) => {
    setIsUploading(true);
    Promise.all(
      files.map(async (file) => {
        const body = new FormData();
        body.append('file', file);
        try {
          const response = await fetch('http://localhost:4000/aws-s3/upload', {
            body,
            method: 'POST',
          });
          const { ok, error, url } = await response.json();
          if (ok && !error && url) {
            setImages((prev) => {
              return prev.map((image) => {
                if (image.id === file.id) {
                  image.url = url;
                }
                return image;
              });
            });
          } else if (error) {
            setError('imageUrls', { message: error });
          } else {
            setError('imageUrls', { message: 'Failed to upload.' });
          }
        } catch {
          setError('imageUrls', { message: 'Failed to upload.' });
        }
      }),
    ).then(() => setIsUploading(false));
  };

  const readFiles = (files: TMyFile[]) => {
    files.forEach((file) => {
      const body = new FormData();
      const reader = new FileReader();
      body.append('file', file);
      reader.onloadend = async () => {
        const src = reader.result?.toString();
        src && setImages((prev) => [...prev, { id: file.id, src }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.currentTarget.files;
    if (!files) {
      return;
    }
    const { validFiles, err } = validateFiles(files);
    if (err) {
      setError('imageUrl', { message: err });
      return;
    }
    readFiles(validFiles);
    uploadFiles(validFiles);
    e.currentTarget.value = '';
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const { validFiles, err } = validateFiles(files);
    if (err) {
      setError('imageUrl', { message: err });
      return;
    }
    readFiles(validFiles);
    uploadFiles(validFiles);
  };
  console.log(images);
  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          if (!draggingId) {
            e.currentTarget.style.backgroundColor = 'rgba(0, 153, 204, 0.2)';
          }
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (!draggingId) {
            e.currentTarget.style.backgroundColor = 'white';
          }
        }}
        onDrop={handleFileDrop}
        className="relative py-2 gap-y-3 grid grid-cols-uploadBox border border-myGray rounded-sm bg-white"
      >
        {images.length === 0 && (
          <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-myGray text-sm">
            Drag & Drop
          </span>
        )}
        {images.map((image, i) => {
          return (
            <React.Fragment key={i}>
              {i % 4 === 0 && (
                <div
                  id={'initialDropPoint-' + i}
                  onDragEnter={(e) => {
                    if (!draggingId) {
                      return;
                    }
                    const child = e.currentTarget.querySelector('div');
                    child && (child.style.backgroundColor = '#0bc');
                  }}
                  onDragLeave={(e) => {
                    if (!draggingId) {
                      return;
                    }
                    const child = e.currentTarget.querySelector('div');
                    child && (child.style.backgroundColor = 'white');
                  }}
                  onDrop={(e) => {
                    const child = e.currentTarget.querySelector('div');
                    child && (child.style.backgroundColor = 'white');
                    const targetIdx = +e.currentTarget.id.split('-')[1];
                    const draggingElIdx = +draggingId!.split('-')[1];
                    setImages((prev) => {
                      const draggingEl = images[draggingElIdx];
                      console.log(draggingElIdx, targetIdx);
                      const state = prev.filter((_, i) => i !== draggingElIdx);
                      if (draggingElIdx < targetIdx) {
                        state.splice(targetIdx - 1, 0, draggingEl);
                      } else {
                        state.splice(targetIdx, 0, draggingEl);
                      }
                      return state;
                    });
                  }}
                  style={{ padding: '3px' }}
                >
                  <div className="w-full h-full bg-white rounded-full pointer-events-none"></div>
                </div>
              )}
              <div
                key={i}
                id={'uploadedImg-' + i}
                onDragStart={(e) => {
                  setDraggingId(e.currentTarget.id);
                }}
                onDragEnd={(e) => {
                  setDraggingId(null);
                }}
                style={{ cursor: 'grab' }}
                className="relative pt-square border border-dashed border-myBlue rounded-md"
              >
                <div
                  style={{ backgroundImage: `url(${image.src})` }}
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
                <input
                  ref={register()}
                  name={`imageUrls[${i}]`}
                  readOnly
                  value={image?.url ?? ''}
                  type="text"
                  className="hidden"
                />
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  onClick={() => {
                    if (!isUploading) {
                      setImages((prev) => prev.filter((_, idx) => idx !== i));
                      image?.url && deleteFiles([image.url]);
                    }
                  }}
                  className={`absolute -top-1 -right-1 text-xl cursor-pointer rounded-full text-black bg-white ${
                    image?.url && 'hover:text-myRed'
                  }`}
                />
              </div>
              <div
                id={'dropPoint-' + (i + 1)}
                onDragEnter={(e) => {
                  if (!draggingId) {
                    return;
                  }
                  const child = e.currentTarget.querySelector('div');
                  child && (child.style.backgroundColor = '#0bc');
                }}
                onDragLeave={(e) => {
                  if (!draggingId) {
                    return;
                  }
                  const child = e.currentTarget.querySelector('div');
                  child && (child.style.backgroundColor = 'white');
                }}
                onDrop={(e) => {
                  if (!draggingId) {
                    return;
                  }
                  const child = e.currentTarget.querySelector('div');
                  child && (child.style.backgroundColor = 'white');
                  const targetIdx = +e.currentTarget.id.split('-')[1];
                  const draggingElIdx = +draggingId.split('-')[1];
                  setImages((prev) => {
                    const draggingEl = images[draggingElIdx];
                    console.log(draggingElIdx, targetIdx);
                    const state = prev.filter((_, i) => i !== draggingElIdx);
                    if (draggingElIdx < targetIdx) {
                      state.splice(targetIdx - 1, 0, draggingEl);
                    } else {
                      state.splice(targetIdx, 0, draggingEl);
                    }
                    return state;
                  });
                }}
                style={{ padding: '3px' }}
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
          name="images"
          onChange={handleFileInput}
          type="file"
          className="hidden"
          disabled={isUploading}
          accept={ACCEPTED_IMAGE_TYPES.join()}
          multiple={true}
        />
      </div>
      {errors.imageUrls?.some((i) => i?.message) &&
        errors.imageUrls.map((i) => <FormError err={i?.message} />)}
    </div>
  );
};
