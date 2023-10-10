import { Avatar, IconButton } from '@mui/material';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import React, { useRef, useState } from 'react';

interface Props {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imgUrl: string | undefined,
  handleOpenEditAvatarModal: () => void;
}

const AvatarFilePicker = ({ name, onChange, imgUrl, handleOpenEditAvatarModal }: Props) => {
  const [image, setImageUrl] = useState<string | null>(null);
  const { showErrorMessage } = useCustomSnackbar();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const newImage = event.target?.files?.[0];
    // if (newImage && newImage.type.startsWith('image/')) {
    //   setImageUrl(URL.createObjectURL(newImage));
    //   onChange(event);
    // } else {
    //   showErrorMessage('Invalid file type');
    // }
  };

  return (
    <label htmlFor="upload-image-button">
      {/* <input
        title="image"
        ref={inputFileRef}
        name={name}
        accept="image/*"
        type="file"
        style={{ display: 'none' }}
        id="upload-image-button"
        onChange={handleOnChange}
      /> */}
      <IconButton component="span" onClick={() => handleOpenEditAvatarModal()}>
        <Avatar
          src={image ? String(image) : imgUrl}
          variant="square"
          sx={{
            border: 4,
            width: 100,
            height: 100,
            borderColor: "background.paper",
          }}
        >
        </Avatar>
      </IconButton>
    </label>
  );
};

export default AvatarFilePicker;
