import { useState } from 'react';
import { TImage } from '../components/Modals/Create-step';

export const useDragNDropImage = (
  images: TImage[],
  setImages: React.Dispatch<React.SetStateAction<TImage[]>>,
) => {
  const [draggingId, setDraggingId] = useState<string | null>();

  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggingId(e.currentTarget.id);
  };

  const onDragEnd = () => {
    setDraggingId(null);
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if (!draggingId) {
      return;
    }
    const child = e.currentTarget.querySelector('div');
    child && (child.style.backgroundColor = '#0bc');
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!draggingId) {
      return;
    }
    const child = e.currentTarget.querySelector('div');
    child && (child.style.backgroundColor = 'white');
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!draggingId) {
      return;
    }
    const child = e.currentTarget.querySelector('div');
    child && (child.style.backgroundColor = 'white');
    const targetIdx = +e.currentTarget.id.split('-')[1];
    const draggingElIdx = +draggingId.split('-')[1];
    setImages((prev) => {
      const draggingEl = images[draggingElIdx];
      const state = prev.filter((_, i) => i !== draggingElIdx);
      if (draggingElIdx < targetIdx) {
        state.splice(targetIdx - 1, 0, draggingEl);
      } else {
        state.splice(targetIdx, 0, draggingEl);
      }
      return state;
    });
  };
  return {
    draggingId,
    imageBoxDragFns: { onDragStart, onDragEnd },
    dropAcceptorFns: { onDragEnter, onDragLeave, onDrop },
  };
};
