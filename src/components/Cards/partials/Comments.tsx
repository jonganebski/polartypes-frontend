import React from 'react';
import { useForm } from 'react-hook-form';
import { useCreateComment } from '../../../hooks/useMutation/useCreateComment';
import { useListComments } from '../../../hooks/useQuery/useListComments';
import { readTripQuery_readTrip_trip_steps } from '../../../__generated__/readTripQuery';
import { whoAmIQuery } from '../../../__generated__/whoAmIQuery';
import { Avatar } from '../../Avatar';
import { Comment } from './Comment';

interface ICommentProps {
  userData: whoAmIQuery | undefined;
  step: readTripQuery_readTrip_trip_steps;
}

export const Comments: React.FC<ICommentProps> = ({ userData, step }) => {
  const { register, getValues, handleSubmit, reset } = useForm<{
    text: string;
  }>();

  const [createCommentMutation, { loading }] = useCreateComment(
    getValues().text,
    step.id,
    userData,
  );

  const { data, loading: queryLoading, fetchMore } = useListComments(step.id);

  const onSubmit = async () => {
    if (!loading) {
      const { text } = getValues();
      await createCommentMutation({
        variables: { input: { text, stepId: step.id } },
      });
      reset();
    }
  };

  const onClickLoadMore = () => {
    if (fetchMore && data?.listComments.hasMorePages) {
      fetchMore({
        variables: {
          input: { stepId: step.id, cursorId: data?.listComments.endCursorId },
        },
      });
    }
  };

  return (
    <div className="py-4 border-t border-myGray-light">
      {userData && (
        <form
          className="flex items-center mb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Avatar avatarUrl={userData.whoAmI.avatarUrl} size={8} />
          <input
            ref={register({ required: true })}
            placeholder="Write a comment..."
            className="input ml-3 w-full"
            autoComplete="off"
            type="text"
            name="text"
          />
        </form>
      )}
      <ul className="py-4 grid gap-y-4">
        {data?.listComments.step?.comments?.map((comment, i) => (
          <Comment
            key={i}
            userData={userData}
            comment={comment}
            stepId={step.id}
          />
        ))}
      </ul>
      {data?.listComments.hasMorePages && (
        <div className="text-center">
          <span
            className="text-sm underline text-myBlue cursor-pointer hover:text-myBlue-light active:text-myBlue-dark"
            onClick={onClickLoadMore}
          >
            Load more
          </span>
        </div>
      )}
    </div>
  );
};
