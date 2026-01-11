'use client'

import * as React from 'react'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import {motion, type HTMLMotionProps} from 'motion/react'

import {cn} from '@/lib/utils'

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & HTMLMotionProps<'button'>

function MotionCheckbox({className, onCheckedChange, ...props}: CheckboxProps) {
    const [isChecked, setIsChecked] = React.useState(props?.checked ?? props?.defaultChecked ?? false)

    React.useEffect(() => {
        if (props?.checked !== undefined) setIsChecked(props.checked)
    }, [props?.checked])

    const handleCheckedChange = React.useCallback(
        (checked: boolean) => {
            setIsChecked(checked)
            onCheckedChange?.(checked)
        },
        [onCheckedChange]
    )

    return (
        <CheckboxPrimitive.Root {...props} onCheckedChange={handleCheckedChange} asChild className="rounded-full">
            <motion.button
                data-slot='checkbox'
                data-state={isChecked ? 'checked' : 'unchecked'}
                className={cn(
                    'peer bg-background dark:bg-muted border border-input data-[state=checked]:!border-green-600 data-[state=checked]:!bg-green-600 text-white focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-8 w-8 md:h-6 md:w-6 shrink-0  shadow-xs transition-colors duration-500 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center',
                    className
                )}
                whileTap={{scale: 0.95}}
                whileHover={{scale: 1.05}}
                {...props}
            >
                <CheckboxPrimitive.Indicator forceMount asChild>
                    <motion.svg
                        data-slot='checkbox-indicator'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth='2'
                        stroke='currentColor'
                        className='h-5 w-5 sm:h-4 sm:w-4'
                        initial='unchecked'
                        animate={isChecked ? 'checked' : 'unchecked'}
                    >
                        <motion.path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M4.5 12.75l6 6 9-13.5'
                            variants={{
                                checked: {
                                    pathLength: 1,
                                    opacity: 1,
                                    transition: {
                                        duration: 0.2,
                                        delay: 0.2
                                    }
                                },
                                unchecked: {
                                    pathLength: 0,
                                    opacity: 0,
                                    transition: {
                                        duration: 0.2
                                    }
                                }
                            }}
                        />
                    </motion.svg>
                </CheckboxPrimitive.Indicator>
            </motion.button>
        </CheckboxPrimitive.Root>
    )
}

export {MotionCheckbox}