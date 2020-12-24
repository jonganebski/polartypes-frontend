import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormError } from '../../Form-error';
import { ICreateStepFormProps } from '../Create-step';

export const UploadBox = () => {
  const [attatchments, setAttatchments] = useState<string[]>([]);
  const { register, setError, errors } = useFormContext<ICreateStepFormProps>();
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const validateFiles = (
    files: FileList,
  ): { validFiles: File[]; err: string } => {
    let validFiles: File[] = [];
    let err = '';
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 1 * 1024 * 1024; // 1mb
    for (let i = 0; i < files.length; i++) {
      if (!validTypes.includes(files[i].type)) {
        err = 'Only jpeg, jpg, png files are accepted.';
        continue;
      }
      if (maxSize < files[i].size) {
        err = 'Image size should be equal or less than 1 MB.';
        continue;
      }
      validFiles.push(files[i]);
    }
    return { validFiles, err };
  };
  const readFiles = (files: File[]) => {
    const reader = new FileReader();
    reader.onload = () => {
      console.log(reader.result);
      const attatchment = reader.result?.toString();
      attatchment && setAttatchments((prev) => [...prev, attatchment]);
    };
    files.forEach((file) => {
      reader.readAsDataURL(file);
    });
  };
  const handleFileInput = () => {};
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const { validFiles, err } = validateFiles(files);
    if (err) {
      setError('images', { message: err });
      return;
    }
    readFiles(validFiles);
  };
  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
        onDragLeave={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        className="p-2 gap-3 grid grid-cols-4 border border-myGray rounded-sm"
      >
        {attatchments.map((a, i) => {
          return (
            <div
              key={i}
              className="relative pt-square border border-dashed border-myBlue rounded-md"
            >
              <div
                style={{ backgroundImage: `url(${a})` }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-p90 pt-p90 bg-myGray-dark bg-cover bg-center rounded-sm"
              />
              <FontAwesomeIcon
                icon={faTimesCircle}
                className="absolute -top-1 -right-1 text-xl cursor-pointer rounded-full text-black bg-white hover:text-myRed"
              />
            </div>
          );
        })}
        <div
          onClick={() => imageInputRef.current?.click()}
          className="relative pt-square border border-myBlue rounded-md cursor-pointer group hover:bg-myBlue"
        >
          <FontAwesomeIcon
            icon={faCamera}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-myBlue text-lg group-hover:text-white"
          />
        </div>
        <input
          ref={(e) => {
            register(e);
            imageInputRef.current = e;
          }}
          name="images"
          onChange={handleFileInput}
          type="file"
          className=""
          accept="image/*"
          multiple={true}
        />
      </div>
      {errors.images?.message && <FormError err={errors.images?.message} />}
    </div>
  );
};
