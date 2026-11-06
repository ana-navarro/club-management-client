import { Button, CircularProgress, type ButtonProps } from '@mui/material'

export type AppButtonProps = ButtonProps & { loading?: boolean }

export function AppButton({ loading = false, disabled, children, ...props }: AppButtonProps) {
  return (
    <Button
      variant="contained"
      disabled={disabled || loading}
      aria-busy={loading}
      startIcon={loading ? <CircularProgress size={16} color="inherit" aria-hidden /> : undefined}
      {...props}
    >
      {children}
    </Button>
  )
}
