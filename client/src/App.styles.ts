import { Theme } from "@material-ui/core/styles";

export default (theme: Theme) => ({
  toolbar: theme.mixins.toolbar,
  main: {
    maxWidth: '960px',
    margin: '1rem auto'
  }
});
