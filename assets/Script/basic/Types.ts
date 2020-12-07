// () in Haskell, Unit in Purescript
export type Unit = "Symbol_Unit"
export const unit = "Symbol_Unit"

export type Effect<T> = () => T;

export function Action<T, U>(typeName: T, value?: Exclude<U, Unit>): [T, Exclude<U, Unit>] {
    return [typeName, value]
}

export function ActionUnit<T>(typeName: T): [T, Unit] {
    return [typeName, unit];
}

export const Cons = Action;
export const ConsUnit = ActionUnit;


// 函数类型
export type Fn<F1, F2> =  (_: F1) => F2
export type Fn2<F1, F2, F3> =  (_1: F1, _2: F2) => F3
export type Fn3<F1, F2, F3, F4> =  (_1: F1, _2: F2, _3: F3) => F4
export type Fn4<F1, F2, F3, F4, F5> =  (_1: F1, _2: F2, _3: F3, _4: F4) => F5
export type Fn5<F1, F2, F3, F4, F5, F6> =  (_1: F1, _2: F2, _3: F3, _4: F4, _5: F5) => F6

export type Pair<F1, F2> = { fst: F1, snd: F2 };
export function mkPair<F1, F2>(fst: F1, snd: F2): Pair<F1, F2> {
    return { fst: fst, snd: snd }
}