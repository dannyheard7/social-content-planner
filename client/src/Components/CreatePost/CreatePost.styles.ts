import { Theme } from '@material-ui/core/styles';

export default (theme: Theme) => ({
  imageDropContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
  },
  imageDropContinerActive: {
    borderColor: '#2196f3',
  },
  imageDropContinerAccept: {
    borderColor: '#00e676',
  },
  imageDropContinerReject: {
    borderColor: '#ff1744',
  },
  imagePreview: {
    imageOrientation: 'from-image',
  },
});
