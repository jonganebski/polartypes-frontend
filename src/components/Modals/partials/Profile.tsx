import React, { useRef } from 'react';
import moment from 'moment';
import { Avatar } from '../../Avatar';
import { Button } from '../../Button';
import { useFormContext } from 'react-hook-form';
import { ISettingsFormProps } from '../Settings';
import { ACCEPTED_IMAGE_TYPES, NAME_PATTERN } from '../../../constants';
import { FormError } from '../../Form-error';

interface IProfileProps {
  hidden: boolean;
  avatarUrl: string | null | undefined;
  avatarSrc: string;
  setAvatarSrc: React.Dispatch<React.SetStateAction<string>>;
}

export const Profile: React.FC<IProfileProps> = ({
  hidden,
  avatarUrl,
  avatarSrc,
  setAvatarSrc,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { register, errors } = useFormContext<ISettingsFormProps>();
  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget;
    if (files && files.length !== 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAvatarSrc(reader.result.toString());
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };
  return (
    <div
      className={`px-6 rounded-lg border border-myGray-light bg-white overflow-hidden ${
        hidden ? 'hidden' : 'block'
      }`}
    >
      <div className="py-6 text-myGreen-dark text-xl font-semibold border-b border-myGray-light">
        Profile
      </div>
      <div className="py-6 grid gap-6 grid-cols-oneToThree">
        <h6 className="pt-1.5 whitespace-pre text-myGreen-dark font-semibold">
          Profile picture
        </h6>
        <div className="flex items-center">
          <Avatar avatarUrl={avatarSrc ?? avatarUrl} size={14} />
          <input
            ref={(element) => {
              register(element);
              fileInputRef.current = element;
            }}
            name="files"
            type="file"
            className="hidden"
            accept={ACCEPTED_IMAGE_TYPES.join()}
            multiple={false}
            onChange={onChange}
          />
          <div className="ml-3">
            <Button
              text="Upload a photo"
              size="sm"
              type="blue-regular"
              isSubmitBtn={false}
              onClick={() => fileInputRef.current?.click()}
            />
          </div>
        </div>

        <h6 className="pt-1.5 whitespace-pre text-myGreen-dark font-semibold">
          First name
        </h6>
        <div className="grid">
          <input
            className="input"
            ref={register({
              required: 'Your first name is required.',
              pattern: NAME_PATTERN,
            })}
            name="firstName"
            type="text"
            placeholder="First name"
          />
          {errors.firstName?.message && (
            <FormError err={errors.firstName.message} />
          )}
        </div>

        <h6 className="pt-1.5 whitespace-pre text-myGreen-dark font-semibold">
          Last name
        </h6>
        <div className="grid">
          <input
            className="input"
            ref={register({
              required: 'Your last name is required.',
              pattern: NAME_PATTERN,
            })}
            name="lastName"
            type="text"
            placeholder="Last name"
          />
          {errors.lastName?.message && (
            <FormError err={errors.lastName.message} />
          )}
        </div>

        <h6 className="pt-1.5 whitespace-pre text-myGreen-dark font-semibold">
          City
        </h6>
        <input
          className="input"
          ref={register()}
          name="city"
          type="text"
          placeholder="Where do you live?"
        />

        <h6 className="pt-1.5 whitespace-pre text-myGreen-dark font-semibold">
          Timezone
        </h6>
        <div>
          <select
            ref={register({ required: 'Your timezone is required.' })}
            name="timeZone"
            className="input w-full"
          >
            {moment.tz.names().map((zone, i) => (
              <option key={i} value={zone}>
                {zone}
              </option>
            ))}
          </select>
          {errors.timeZone?.message && (
            <FormError err={errors.timeZone.message} />
          )}
        </div>
        <h6 className="pt-1.5 whitespace-pre text-myGreen-dark font-semibold">
          About
        </h6>
        <textarea
          className="input resize-none"
          ref={register()}
          name="about"
          placeholder="Description of yourself"
        ></textarea>
      </div>
    </div>
  );
};
