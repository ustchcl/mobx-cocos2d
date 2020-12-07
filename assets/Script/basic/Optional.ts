import { Fn, Fn2 } from "./Types";

export class Optional<T> {
    private _isValid = false;
    private _value: T | null = null;

    static Some<T>(v: T) {
        return new Optional<T>(v);
    }

    static None<T>() {
        return new Optional<T>();
    }

    constructor(v: T | null = null) {
        if (v != null) {
            this._isValid = true;
            this._value = v;
        } else {
            this._isValid = false;
        }
    }


    get isSome(): boolean {
        return this._isValid;
    }

    get isNone(): boolean {
        return !this.isSome;
    }

    fold<U>(ifSome: Fn<T, U>, isNone: () => U): U {
        if (this.isSome) {
            return ifSome(this.val as T);
        } else {
            return isNone();
        }
    }

    private get val() {
        return this._value;
    }

    // Functor f => (a -> b) -> f a -> f b
    map<U>(func: Fn<T, U>): Optional<U> {
        if (this.isSome) {
            return new Optional<U>(func(this.val as T));
        } else {
            return new Optional<U>();
        }
    }

    async asyncFmap<U>(func: Fn<T, Promise<U>>) {
        if (this.isSome) {
            const u = await func(this.val as T)
            return new Optional<U>(u);
        } else {
            return new Optional<U>();
        }
    }

    pure(x: T): Optional<T> {
        return new Optional(x);
    }

    // Monad m => (a -> m b) -> m a -> m b
    bind<U>(func: Fn<T, Optional<U>>): Optional<U> {
        if (this.isSome) {
            return func(this.val as T);
        } else {
            return new Optional<U>();
        }
    }

    getOrElse(func: () => T): T {
        return this.isSome ? this.val as T : func();
    }

    lift2<U, V>(func: Fn2<T, U, V>, ou: Optional<U>): Optional<V> {
        if (this.isSome && ou.isSome) {
            return new Optional<V>(func(this.val as T, ou.val as U));
        } else {
            return new Optional<V>();
        }
    }

    error(errMsg?: string): T {
        if (this.isSome) {
            return this._value as T
        } else {
            throw (errMsg)
        }
    }
}