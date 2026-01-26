import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
  className,
}) => {
  const sizeStyles = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const content = (
    <div className={clsx('flex flex-col items-center justify-center gap-4', className)}>
      <motion.div
        className={clsx(
          'border-4 border-primary-100 border-t-primary-500 rounded-full',
          sizeStyles[size]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {text && (
        <p className={clsx('text-text-secondary', textSizes[size])}>{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

// Skeleton loader for content placeholders
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  rounded = 'md',
}) => {
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <motion.div
      className={clsx(
        'bg-secondary-300',
        roundedStyles[rounded],
        className
      )}
      style={{ width, height }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// Loading dots animation
export const LoadingDots: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <span className={clsx('inline-flex gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 bg-current rounded-full"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </span>
  );
};

// Page loading component
export const PageLoading: React.FC<{ message?: string }> = ({ message = 'Loading page...' }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loading size="lg" text={message} />
    </div>
  );
};

export default Loading;
