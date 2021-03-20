import { ApolloCache, FetchResult, useMutation } from '@apollo/client';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment-timezone';
import React from 'react';
import { useForm } from 'react-hook-form';
import { UPDATE_ACCOUNT_MUTATION } from '../../hooks/useMutation/useUpdateAccount';
import { useWhoAmI } from '../../hooks/useQuery/useWhoAmI';
import {
  updateAccountMutation,
  updateAccountMutationVariables,
} from '../../__generated__/updateAccountMutation';
import { Button } from '../Button';
import { FormError } from '../Form-error';
import { ModalBackground } from './partials/Background';
import { ModalCloseIcon } from './partials/CloseIcon';

interface ISetTimeZoneModalProps {
  setIsAskTimeZone: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreateTrip: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ISetTimeZoneFormProps {
  city: string;
  timeZone: string;
}

export const SetTimeZoneModal: React.FC<ISetTimeZoneModalProps> = ({
  setIsAskTimeZone,
  setIsCreateTrip,
}) => {
  const { me } = useWhoAmI();
  const f = useForm<ISetTimeZoneFormProps>({
    mode: 'onChange',
  });
  const { getValues, formState, register, handleSubmit, errors } = f;

  const update = (
    cache: ApolloCache<updateAccountMutation>,
    { data }: FetchResult<updateAccountMutation>,
  ) => {
    if (!data || !me) return;
    const {
      updateAccount: { error },
    } = data;
    if (error) return;
    const success = cache.modify({
      id: `User:${me.id}`,
      fields: {
        timeZone: () => getValues().timeZone,
      },
    });
    if (!success) return;
    setIsAskTimeZone(false);
    setIsCreateTrip(true);
  };

  const [updateAccountMutation, { loading }] = useMutation<
    updateAccountMutation,
    updateAccountMutationVariables
  >(UPDATE_ACCOUNT_MUTATION, { update });

  const onSubmit = async () => {
    if (loading) return;
    await updateAccountMutation({ variables: { input: { ...getValues() } } });
  };

  const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <>
      <ModalBackground onClick={() => setIsAskTimeZone(false)} />
      <div className="modal">
        <ModalCloseIcon onClick={() => setIsAskTimeZone(false)} />
        <div className="py-6 text-center text-2xl text-myGreen-darkest font-semibold border-b">
          Where do you live?
        </div>
        <div className="p-6">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full border-2 border-myBlue text-myBlue text-3xl">
            <FontAwesomeIcon icon={faHome} />
          </div>
          <p className="mb-6 text-myGray-darkest text-center">
            Please set your city and timezone.
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col align-center"
          >
            <div className="mb-3">
              <input
                ref={register({ required: 'Your location is required.' })}
                name="city"
                list="city"
                type="text"
                placeholder="Enter your city"
                className="input w-full"
                autoComplete="off"
              />
              {errors.city?.message && <FormError err={errors.city.message} />}
            </div>
            <select
              ref={register({ required: true })}
              name="timeZone"
              className="input mb-6"
              defaultValue={clientTimeZone}
            >
              {moment.tz.names().map((zone, i) => (
                <option key={i} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
            <Button
              text="Create trip"
              disabled={!formState.isValid}
              loading={loading}
              type="red-solid"
              className="mx-auto"
            />
          </form>
        </div>
      </div>
    </>
  );
};
