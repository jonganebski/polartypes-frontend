import { v4 as uuidv4 } from 'uuid';
import { TImage } from '../components/Modals/Save-step';
import { TMyFile } from '../components/Modals/partials/FilesArea';
import { ACCEPTED_IMAGE_TYPES } from '../constants';

export const useDragNDropFile = (
  images: TImage[],
  setImages: React.Dispatch<React.SetStateAction<TImage[]>>,
  setImagesRecord: React.Dispatch<React.SetStateAction<TImage[]>>,
  draggingId: string | null | undefined,
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>,
  setUploadErr: React.Dispatch<React.SetStateAction<string>>,
) => {
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
            setImages((prev) =>
              prev.map((img) => {
                if (img.id === file.id) {
                  img.url = url;
                }
                return img;
              }),
            );
            setImagesRecord((prev) =>
              prev.map((img) => {
                if (img.id === file.id) {
                  img.url = url;
                }
                return img;
              }),
            );
          } else if (error) {
            setUploadErr(error);
          } else {
            setUploadErr('Failed to upload.');
          }
        } catch (err) {
          console.log(err);
          setUploadErr('Failed to upload.');
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
        setImages((prev) => prev.concat([{ id: file.id, src }]));
        setImagesRecord((prev) => prev.concat([{ id: file.id, src }]));
      };
      reader.readAsDataURL(file);
    });
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggingId) {
      e.currentTarget.style.backgroundColor = 'rgba(0, 153, 204, 0.2)';
    }
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggingId) {
      e.currentTarget.style.backgroundColor = 'white';
    }
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = 'white';
    const files = e.dataTransfer.files;
    const { validFiles, err } = validateFiles(files);
    if (err) {
      setUploadErr(err);
      return;
    }
    readFiles(validFiles);
    uploadFiles(validFiles);
  };

  return {
    dragNDropFilesFns: { onDragOver, onDragEnter, onDragLeave, onDrop },
    helperFns: { validateFiles, readFiles, uploadFiles },
  };
};
