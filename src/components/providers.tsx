import { createTheme, MantineProvider } from '@mantine/core';
import { PropsWithChildren } from 'react'

const theme = createTheme({
  /** Your theme override here */
});


export const Providers = ({ children }: PropsWithChildren) => (
     <MantineProvider theme={theme}>
         {children}
     </MantineProvider>
)
