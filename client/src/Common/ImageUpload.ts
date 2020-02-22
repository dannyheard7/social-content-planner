export const uploadFile = (url: string, file: File) => {
  const data = new FormData();
  data.append('file', file);

  fetch(url, {
    method: 'post',
    body: data,
  });
};
