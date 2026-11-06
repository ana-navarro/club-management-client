import { Container, Typography } from '@mui/material'

export function Home() {
  return (
    <Container component="main" sx={{ py: { xs: 3, md: 6 } }}>
      <Typography variant="h4" component="h1">
        Club Management
      </Typography>
    </Container>
  )
}
