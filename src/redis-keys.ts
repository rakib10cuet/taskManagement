// Engine
export const dropdownDataBySlug = (slug: string) =>
  `dropdownDataBySlug:_${slug}`;
export const masterGridDataBySlug = (slug: string) =>
  `masterGridDataBySlug:_${slug}`;

//users
export const userDetailskey = (userId: string) => `userDetails:_#${userId}`;
export const userIdByNamekey = (userName: string) =>
  `userIdByName:_${userName}`;

// images
export const imageNameByIdkey = (imageId: string) =>
  `imageNameById:_#${imageId}`;
export const imageIdByNamekey = (imagename: string) =>
  `imageIdByName:#${imagename}`;
export const imageDetailskey = (imageId: string) =>
  `imageDetailskey:#${imageId}`;
