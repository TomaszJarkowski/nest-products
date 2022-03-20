import { HttpException, HttpStatus } from '@nestjs/common';

import { DEFAULT_MAX_PHOTO_SIZE } from './product.constants';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new HttpException(
        'Only image files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

export const getMaxPhotoSize = () =>
  +process.env.MAX_PHOTO_SIZE || DEFAULT_MAX_PHOTO_SIZE;
