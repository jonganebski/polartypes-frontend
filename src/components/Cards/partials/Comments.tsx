import React from 'react';
import { useForm } from 'react-hook-form';
import { useCreateComment } from '../../../hooks/useMutation/useCreateComment';
import { useListComments } from '../../../hooks/useQuery/useListComments';
import { readTripQuery_readTrip_trip_steps } from '../../../__generated__/readTripQuery';
import { whoAmIQuery_whoAmI_user } from '../../../__generated__/whoAmIQuery';
import { Avatar } from '../../Avatar';
import { Spinner } from '../../Loading-spinner';
import { Comment } from './Comment';

interface ICommentProps {
  me: whoAmIQuery_whoAmI_user | null | undefined;
  step: readTripQuery_readTrip_trip_steps;
}

export const Comments: React.FC<ICommentProps> = ({ me, step }) => {
  const { register, getValues, handleSubmit, reset } = useForm<{
    text: string;
  }>();

  const [createCommentMutation, { loading }] = useCreateComment(
    getValues().text,
    step.id,
    me,
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
      {me && (
        <form
          className="flex items-center mb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Avatar avatarUrl={me.avatarUrl} size={8} />
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
      {queryLoading ? (
        <div className="relative w-full h-14">
          <Spinner color="black" />
        </div>
      ) : (
        <ul className="py-4 grid gap-y-4">
          {data?.listComments.step?.comments?.map((comment, i) => (
            <Comment comment={comment} stepId={step.id} me={me} key={i} />
          ))}
        </ul>
      )}
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
