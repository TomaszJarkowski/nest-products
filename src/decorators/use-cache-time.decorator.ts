import { SetMetadata } from '@nestjs/common';

export const CACHE_TIME_KEY = 'cacheTime';
export const UseCacheTime = (time: number) => SetMetadata(CACHE_TIME_KEY, time);
