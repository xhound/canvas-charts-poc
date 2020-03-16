import { fromNullable, none, Option, some } from 'fp-ts/lib/Option';
import { RefObject } from 'react';

export type OptionRefObject<T> = RefObject<T> & { optionCurrent: Option<T> };

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
