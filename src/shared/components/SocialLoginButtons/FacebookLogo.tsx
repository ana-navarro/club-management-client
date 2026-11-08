import { SvgIcon, type SvgIconProps } from '@mui/material'

// The official "f" in its blue circle, inline, without loading any script from Facebook (research R16).
export function FacebookLogo(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 48 48" aria-hidden {...props}>
      <circle cx="24" cy="24" r="22" fill="#1877F2" />
      <path
        fill="#FFFFFF"
        d="M26.6 46V30.5h5.2l.8-6.1h-6v-3.9c0-1.8.5-3 3-3h3.2v-5.4c-.6-.1-2.4-.2-4.6-.2-4.6 0-7.7 2.8-7.7 7.9v4.5h-5.2v6.1h5.2V46h6.1z"
      />
    </SvgIcon>
  )
}
