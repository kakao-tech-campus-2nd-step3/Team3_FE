/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'

type NotificationType = 'success' | 'error' | 'info'

interface NotificationProps {
  type: NotificationType
  message: string
  duration?: number
  onClose?: () => void
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const bgColorMap = {
  success: '#38A169', // Green
  error: '#E53E3E', // Red
  info: '#3182CE', // Blue
}

// Styled components
const NotificationContainer = styled(motion.div)<{ type: NotificationType }>`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 50;
  width: 100%;
  max-width: 24rem;
  overflow: hidden;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  background-color: ${({ type }) => bgColorMap[type]};
`

const NotificationContent = styled.div`
  padding: 1rem;
  display: flex;
  align-items: start;
`

const IconContainer = styled.div`
  flex-shrink: 0;
`

const MessageContainer = styled.div`
  margin-left: 0.75rem;
  width: 0;
  flex-grow: 1;
  padding-top: 0.125rem;
`

const CloseButton = styled.button`
  margin-left: 1rem;
  display: inline-flex;
  color: white;
  transition: color 0.2s;

  &:hover {
    color: #e2e8f0; // Light gray on hover
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px white;
  }
`

const srOnly = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`

export default function Notification({
  type,
  message,
  duration = 5000,
  onClose,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose && onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const Icon = iconMap[type]

  return (
    <AnimatePresence>
      {isVisible && (
        <NotificationContainer
          type={type}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          <NotificationContent>
            <IconContainer>
              <Icon className="h-6 w-6" color="white" />
            </IconContainer>
            <MessageContainer>
              <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'white' }}>{message}</p>
            </MessageContainer>
            <CloseButton
              onClick={() => {
                setIsVisible(false)
                onClose && onClose()
              }}
            >
              <span css={srOnly}>Close</span>
              <X className="h-5 w-5" />
            </CloseButton>
          </NotificationContent>
        </NotificationContainer>
      )}
    </AnimatePresence>
  )
}
