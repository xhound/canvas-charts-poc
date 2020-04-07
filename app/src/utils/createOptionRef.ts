import { fromNullable, none, Option, some } from 'fp-ts/lib/Option';
import { RefObject, useRef, MutableRefObject } from 'react';

export type OptionRefObject<T> = RefObject<T> & { optionCurrent: Option<T> };

export type HookOptionRefObject<T> = MutableRefObject<T | null> & { optionCurrent: Option<T> };

export const createOptionRef = <T = any>(
	initializer?: () => T,
): OptionRefObject<T> => {
	const initialValue = initializer === undefined ? undefined : initializer();
	const value: OptionRefObject<T> = {
		current: initialValue === undefined ? null : initialValue,
		optionCurrent: initialValue === undefined ? none : some(initialValue),
	};

	Object.defineProperty(value, 'optionCurrent', {
		get: () => fromNullable(value.current),
	});

	return value;
};

export const useOptionRef = <T = undefined>(
	initializer?: () => T,
): HookOptionRefObject<T> => {
	const initialValue = initializer === undefined ? null : initializer();
	const ref = useRef<T | null>(initialValue);
	const value: HookOptionRefObject<T> = {
		current: ref.current,
		optionCurrent: ref.current === null ? none : some(ref.current),
	};

	Object.defineProperty(value, 'optionCurrent', {
		get: () => fromNullable(value.current),
	});

	return value;
}
