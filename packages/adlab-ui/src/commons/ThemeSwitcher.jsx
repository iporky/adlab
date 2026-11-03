import React from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { IconButton } from '@mui/material';

import { useColorMode } from '../providers/ThemeProvider';

function ThemeSwitcher() {
  const { mode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      onClick={toggleColorMode}
      color="inherit"
      aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
    >
      {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
    </IconButton>
  );
}

export default ThemeSwitcher;
