import { useMutation } from '@apollo/client';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment-timezone';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { client } from '../../apollo/apollo';
import { UPDATE_ACCOUNT_MUTATION } from '../../hooks/useMutation/useUpdateAccount';
import { WHO_AM_I_QUERY } from '../../hooks/useQuery/useWhoAmI';
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
  const [isLoading, setIsLoading] = useState(false);
  const f = useForm<ISetTimeZoneFormProps>({
    mode: 'onChange',
  });
  const { getValues, formState, register, handleSubmit, errors } = f;
  const onCompleted = (data: updateAccountMutation) => {
    const {
      updateAccount: { ok, error },
    } = data;
    if (ok && !error) {
      const { timeZone } = getValues();
      const prevQuery = client.readQuery({ query: WHO_AM_I_QUERY });
      client.writeQuery({
        query: WHO_AM_I_QUERY,
        data: {
          whoAmI: {
            ...prevQuery.whoAmI,
            timeZone,
          },
        },
      });
      setIsLoading(false);
      setIsAskTimeZone(false);
      setIsCreateTrip(true);
    }
  };
  const [updateAccountMutation] = useMutation<
    updateAccountMutation,
    updateAccountMutationVariables
  >(UPDATE_ACCOUNT_MUTATION, { onCompleted });

  const onSubmit = () => {
    setIsLoading(true);
    updateAccountMutation({ variables: { input: { ...getValues() } } });
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
              loading={isLoading}
              type="red-solid"
              className="mx-auto"
            />
          </form>
        </div>
      </div>
    </>
  );
};
