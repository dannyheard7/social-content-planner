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
  imageDropContainerActive: {
    borderColor: '#2196f3',
  },
  imageDropContainerAccept: {
    borderColor: '#00e676',
  },
  imageDropContainerReject: {
    borderColor: '#ff1744',
  },
  imagePreviewContainer: {
    position: 'relative' as 'relative'
  },
  imagePreview: {
    imageOrientation: 'from-image',
  },
  clearImageButton: {
    position: 'absolute' as 'absolute',
    top: 0,
    right: 0
  }
});
